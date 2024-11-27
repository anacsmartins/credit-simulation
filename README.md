# Simulação de Crédito

Este microserviço realiza simulações de crédito com base em informações fornecidas, como valor do empréstimo, data de nascimento do cliente e prazo de pagamento. Ele é construído em **TypeScript**, segue a **arquitetura hexagonal**, utiliza `worker_threads` para processamento em alta volumetria e está preparado para execução em containers **Docker** e gerenciamento por **Kubernetes**.

## Estrutura do Projeto

```plaintext
credit-simulation/
├── src/
│   ├── domain/                                          # Regras de negócio
│   │   ├── entities/                                    # Entidades principais
│   │   │   └── LoanSimulation.ts
│   ├── application/                                     # Interface com o mundo externo
|   |   │   └── loan/
|   |   │       └── controllers/                         # Controladores de API
|   |   │           └── LoanController.ts
│   │   │       └── listeners/                           # Listeners Kafka
│   │   │           └── LoanSimulationKafkaListener.ts   # Consumidor de mensagens
│   │   │       └── interface/                           # Listeners Kafka
│   │   │           └── LoanSimulationContracts.ts
|   |   ├── middlewares
|   |   │   └── handlerValidationErrors.ts
│   │   |   └── globalErrorsHandler.ts
│   │   |   └── loanSimulationValidation.ts
│   │   |   └── notFoundHandler.ts
│   ├── infrastructure/                                  # Configurações, servidores e conectores
│   │   ├── config/                                      # Configurações de ambiente
│   │   │   └── routers.ts                               # Configuração de rotas
│   │   ├── providers/
│   │   │   ├── queue/                                   # Serviços Kafka (produtores e consumidores)
│   │   │   │   └── KafkaProvider.ts                     # Cliente Kafka
│   │   │   ├── workers/                                 # Threads para processamento paralelo
│   │   │   │   └── loanSimulateWorker.js
│   │   │   ├── inversify/
|   |   |   |   ├── config.ts        
│   │   │   │   └── types.ts
│   │   │   └── email/                                  # Configuração de envio de email
│   │   │       └── sendgridProvider.ts
│   │   ├── utils/
│   │   │   └── logger/                                  # Configuração de logs
│   │   │       └── logger.ts
│   │   └── server.ts                                    # Configuração do servidor
│   └── index.ts                                         # Ponto de entrada
├── tests/                                               # Testes unitários, integração e performance
├── k8s/                                                 # Configuração do Kubernetes
│   ├── deployment.yaml                                  # Configuração de deployment
│   └── service.yaml                                     # Configuração de serviço
├── docs/                                                # Documentação API
|   ├── api.html
│   └── api.apib                                         # Especificação em API Blueprint
├── Dockerfile                                           # Configuração do Docker
├── docker-compose.yml                                   # Arquivo Compose para ambiente local
├── tsconfig.json                                        # Configuração do TypeScript
└── package.json                                         # Dependências e scripts
```
> [!NOTE]
> Com esta estrutura, o microserviço está preparado para processamento paralelo, documentação clara e extensibilidade com mensageria.

## Tecnologias e Decisões de Arquitetura
- **Arquitetura Hexagonal:**
  As regras de negócio são separadas da interface com o mundo externo, facilitando testes, manutenção e extensibilidade do código.
- **worker_threads para alta volumetria:**
  Utilizado para processar múltiplas simulações de crédito em massa (ex: 10.000 simulações) em paralelo.
- **Mensageria (Kafka):**
  Preparado para integrar com Kafka para processamento de mensagens em segundo plano.
- **TypeScript:**
  Maior segurança e clareza ao código.
- **Kubernetes e Docker:**
  Preparado para execução em containers e escalabilidade.

## **Instruções de Setup**
Pré-requisitos
  - **Node.js: v20.x ou superior**
  - **Docker e Docker Compose**
  - **Kubernetes (kubectl)**
Passos para execução
#### 1. Instalar dependências:

```bash
npm install
```

#### 2. Executar o serviço localmente:

```bash
npm run dev
```

#### 3. Testar localmente:

```bash

npm test
```

#### 4. Construir a imagem Docker:

```bash

docker build -t credit-simulation .
```

#### 5. Executar com Docker Compose:

```bash

docker-compose up
```

## Documentação dos Endpoints
A documentação foi feita utilizando API Blueprint e está no diretório docs/api-blueprint.apib.

Para gerar uma visualização legível, utilize **Aglio**:
obs: certifique que a aplicação esta em execução. 

```bash
aglio -i src/docs/api.apib - theme-template triple -s
```
Agurade o seguinte retorno no console:

```bash
Rendering src/docs/api.apib
Refresh web page in browser
```
Após exibição acesse http://127.0.0.1:3000/

![alt text](https://raw.githubusercontent.com/anacsmartins/credit-simulation/main/src/docs/image.png)

Exemplo de visualização de endpoints:

> [!CAUTION]
> Para que o projeto seja executado localmente, garanta que a execução do mock referente a documentação tenha sido interronpida. Para isso uso excute ctrl+c no console.

```bash
Rendering src/docs/api.apib
Refresh web page in browser
> cntrl+c
```

### Endpoint 1
```bash
  //Simulação de empréstimo individual.
  curl --location --request POST 'http://localhost:3000/simulate-loan' \
  --header 'Content-Type: application/json' \
  --data-raw '

  {
      "loanAmount": 100000,
      "birthDate": "1970-01-01",
      "repaymentTermMonths": 12,
      "email": "teste@teste.com",
      "currency": "BRL",
      "interestType": "variable"
  }  

  '
```
payload

```json
  {
    "loanAmount": 100000,
    "birthDate": "1970-01-01",
    "repaymentTermMonths": 12,
    "email": "teste@teste.com",
    "currency": "BRL",
    "interestType": "variable"
  }
```
Resonse

```json
  {
    "monthlyInstallment": 8469.37,
    "totalAmount": 101632.44,
    "totalInterest": 1632.44
  }
```
### Endpoint 2

```bash
//Processamento de múltiplas simulações.
curl --location --request POST 'http://localhost:3000/simulate-loans' \
  --header 'Content-Type: application/json' \
  --data-raw '
      [
          {
              "loanAmount": 2500,
              "birthDate": "1993-01-01",
              "repaymentTermMonths": 12,
              "id": 2
          },
          {
              "loanAmount": 2500,
              "birthDate": "2000-01-01",
              "repaymentTermMonths": 12,
              "id": 3
          },
          {
              "loanAmount": 1000,
              "birthDate": "1970-01-01",
              "repaymentTermMonths": 12,
              "id": 1
          }
      ]

  '
```
payload

```json  
    [
        {
            "loanAmount": 2500,
            "birthDate": "1993-01-01",
            "repaymentTermMonths": 12,
            "id": 2
        },
        {
            "loanAmount": 2500,
            "birthDate": "2000-01-01",
            "repaymentTermMonths": 12,
            "id": 3
        },
        {
            "loanAmount": 1000,
            "birthDate": "1970-01-01",
            "repaymentTermMonths": 12,
            "id": 1
        }
    ]
```
Resonse

```json
  [
    {
        "monthlyInstallment": 212.87,
        "totalAmount": 2554.5,
        "totalInterest": 54.5,
        "id": 2
    },
    {
        "monthlyInstallment": 215.17,
        "totalAmount": 2581.99,
        "totalInterest": 81.99,
        "id": 3
    },
    {
        "monthlyInstallment": 84.69,
        "totalAmount": 1016.32,
        "totalInterest": 16.32,
        "id": 1
    }
]
```

## Processamento em alta volumetria com worker_threads
O endpoint de simulações em massa (/loan/bulk-simulate) utiliza o módulo worker_threads do Node.js para dividir as tarefas de simulação em várias threads, otimizando a performance.

Arquivo: src/infrastructure/workers/simulateWorker.ts
Este arquivo contém a lógica que cada thread executa.

```typescript
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
```
Controle no linstener:

```typescript

    // Cria um Worker para processar a simulação
    const worker = new Worker("./src/infrastructure/workers/simulateWorker.ts", {
      execArgv: ["-r", "ts-node/register"],
    });

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
```

## Integração Kafka (Abstraída)
O código prevê integração futura com Kafka para filas de simulações. Mensagens podem ser enviadas para um tópico e processadas por workers.
Exemplo de integração Kafka:

```typescript

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
```
## Testes
### Testes de Unidade
Testam a lógica de cálculo de empréstimos:

```bash
npm run test
```
### Testes de Integração
Verificam os endpoints e a interação entre camadas:

```bash

npm run test
```

### Testes de Performance
Simula alta volumetria usando Artillery:

```yaml

config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 200
scenarios:
  - flow:
      - post:
          url: "/simulate-loan"
          json:
            - loanAmount: 10000
              birthDate: "1980-01-01"
              repaymentTermMonths: 24
```
Execute:

```bash

  artillery run src/tests/performance/performance.yaml
```
> [!IMPORTANT]
> Abaixo descrevo o roteiro usado para implementação do projeto.
           
#### Simulador de Crédito
- [x] Código submetido em um repositório Git público
- [x] Incluso um arquivo README.md com instruções sobre como configurar e rodar o projeto.
#### Setup do Projeto
- [x] Utilização da linguagem de programação backend: typeScript
- [x] Framework : express
- [x] Crie endpoints para simular um empréstimo
- [x] O resultado da simulação deve incluir: valor total a ser pago, ○ Valor das parcelas mensais, ○ Total de juros pagos.
- [x] Cálculos de Simulação
- [x] Utilize a fórmula de cálculo de parcelas fixas:
Onde: ○ PMT = Pagamento mensal, ○ PV = Valor presente (empréstimo), ○ r = Taxa de juros mensal (taxa anual / 12), n = Número total de pagamentos (meses)
#### Testes Automatizados
- [x] Escreva testes unitários e de integração para os principais componentes da aplicação.
- [x] Inclua testes de desempenho para garantir que a aplicação lide bem com alta volumetria de cálculos.
- [x] Utilização ferramentas de teste: Jest
#### Documentação
- [x] Inclua no README.md: Instruções de setup,  exemplos de requisições para os endpoints, explicação sobre a estrutura do projeto e decisões de arquitetura.
#### Boas Práticas e Qualidade de Código
- [x] Siga boas práticas de codificação e arquitetura: Hexagonal, codigo fortemente tipado
- [x] Utilize um linter para manter a consistência do código
- [x] Inclua comentários e documentação no código quando necessário
#### Alta Volumetria
- [x] Implemente um endpoint que aceite múltiplas simulações de crédito em uma única
requisição (ex: 10.000 simulações).
- [x] Considere utilizar técnicas de paralelismo e/ou processamento assíncrono para
melhorar a performance.
- [x] Abstraia no código a utilização de serviços de mensageria (como SQS, Kafka,
RabbitMQ), sem a necessidade de implementação completa. Descreva como seriam
utilizados em um cenário real.
#### Documentação: A documentação dos endpoints da API utilizam a ferramenta API Blueprint
- [x] Implementar notificação por email com os resultados da simulação.
- [x] Adicionar suporte para diferentes cenários de taxa de juros (fixa e variável).
- [x] Criar um Dockerfile e docker-compose para facilitar o setup da aplicação.
- [x] Adicionado suporte para diferentes moedas e conversão de taxas.
