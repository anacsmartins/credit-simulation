import { parentPort } from "worker_threads";
import { LoanSimulationService } from "../LoanSimulationService";
import { logger } from "../types/infrastructure/config/utils/logger";
import { LoanSimulationEntity } from "../entities/LoanSimulationEntity";
import { LoanSimulationResult } from "../interfaces/LoanSimulationResult";
import { LoanSimulationResponse } from "../../application/loan/interfaces/LoanSimulationContracts";


// Serviço de simulação
const loanSimulationService = LoanSimulationService.getInstance();

// Função para adicionar timeout às promessas
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout exceeded")), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

// Processa a simulação de empréstimo
parentPort?.on("message", async (entity: LoanSimulationEntity) => {
  try {
    const { loanAmount, birthDate, termMonths, interestType } = entity;

    // Validação inicial
    if (!loanAmount || !birthDate || !termMonths || !interestType) {
      throw new Error("Invalid payload format received by Worker");
    }

    // Simulação com timeout de 5 segundos
    const simulate: LoanSimulationResult = await withTimeout(
      loanSimulationService.simulateLoan(
        loanAmount,
        birthDate,
        termMonths,
        interestType
      ),
      5000
    );

    // Retorno de sucesso
    const response: LoanSimulationResponse = {
      success: true,
      result: simulate,
    };
    parentPort?.postMessage(response);
  } catch (error) {
    // Log de erro e retorno de falha
    logger.error("Simulation error", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    const response: LoanSimulationResponse = {
      success: false,
      error: errorMessage,
    };
    parentPort?.postMessage(response);
  }
});
