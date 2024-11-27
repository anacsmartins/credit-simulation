import { KafkaProvider } from "../../../infrastructure/providers/queue/kafka/KafkaProvider";
import { Worker } from "worker_threads";
import { LoanSimulationEntity } from "../../../domain/entities/LoanSimulationEntity";
import { logger } from "../../../infrastructure/utils/logger";

export class LoanSimulationKafkaListener {
  private kafkaProvider: KafkaProvider;

  constructor() {
    this.kafkaProvider = new KafkaProvider({
      clientId: "loan-simulation-service",
      brokers: ["localhost:9092"],
      groupId: "loan-simulation-group",
    });
  }

  async startListening(): Promise<void> {
    await this.kafkaProvider.consumeMultipleMessages(
      ["loan-simulations"],
      "loan-simulation-group",
      async (message) => {
        try {
          // Parse e validação inicial da mensagem
          const loanSimulationEntity: LoanSimulationEntity = JSON.parse(
            message.value.toString()
          );

          if (
            !loanSimulationEntity.loanAmount ||
            !loanSimulationEntity.birthDate ||
            !loanSimulationEntity.termMonths ||
            !loanSimulationEntity.interestType
          ) {
            throw new Error("Invalid payload format received from Kafka");
          }

          // Cria um Worker para processar a simulação
          const worker = new Worker("./src/infrastructure/workers/simulateWorker.ts", {
            execArgv: ["-r", "ts-node/register"],
          });

          // Timeout para monitorar o tempo de resposta do Worker
          const workerTimeout = setTimeout(() => {
            worker.terminate();
            logger.error("Worker timed out");
          }, 6000); // Timeout de 6 segundos

          worker.on("message", (result) => {
            clearTimeout(workerTimeout);

            if (result.success) {
              logger.info("Processed loan simulation:", result.result);
            } else {
              logger.error("Error processing loan simulation:", result.error);
            }

            worker.terminate(); // Terminando o Worker
          });

          worker.on("error", (error) => {
            clearTimeout(workerTimeout);
            logger.error("Worker encountered an error:", error);
            worker.terminate();
          });

          worker.on("exit", (code) => {
            clearTimeout(workerTimeout);
            if (code !== 0) {
              logger.error(`Worker stopped with exit code ${code}`);
            }
          });

          // Enviando a mensagem para o Worker
          worker.postMessage(loanSimulationEntity);
        } catch (error) {
          logger.error("Failed to process Kafka message:", error);
        }
      }
    );
  }
}
