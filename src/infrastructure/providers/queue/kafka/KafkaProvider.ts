import { Kafka, Consumer, Producer } from "kafkajs";

interface KafkaProviderOptions {
  clientId: string;
  brokers: string[];
  groupId?: string; // Permite configurar o grupo de consumidores
}

export class KafkaProvider {
  private kafka: Kafka;
  private clientId: string;
  private brokers: string[];

  constructor(options: KafkaProviderOptions) {
    this.clientId = options.clientId;
    this.brokers = options.brokers;
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    });
  }

  // Método para enviar mensagens para qualquer tópico
  async sendMessage(topic: string, messages: any[]): Promise<void> {
    const producer: Producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: messages.map((message) => ({ value: JSON.stringify(message) })),
    });
    await producer.disconnect();
  }

  // Método genérico para consumir mensagens de qualquer tópico com callback
  async consumeMessages(topic: string, groupId: string, handleMessage: (message: any) => Promise<void>): Promise<void> {
    const consumer: Consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
          await handleMessage(data);
        }
      },
    });
  }

  // Método para criar múltiplos consumidores com tópicos diferentes e grupos diferentes
  async consumeMultipleMessages(topics: string[], groupId: string, handleMessage: (message: any) => Promise<void>): Promise<void> {
    const consumer: Consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    
    // Subscrição em múltiplos tópicos
    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
          await handleMessage(data);
        }
      },
    });
  }
}
