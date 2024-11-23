# Simulação de Crédito

Este microserviço realiza simulações de crédito com base em informações fornecidas, como valor do empréstimo, data de nascimento do cliente e prazo de pagamento. Ele é construído em **TypeScript**, segue a **arquitetura hexagonal**, utiliza `worker_threads` para processamento em alta volumetria e está preparado para execução em containers **Docker** e gerenciamento por **Kubernetes**.

## Estrutura do Projeto

```plaintext
credit-simulation/
├── src/
│   ├── domain/                                          # Regras de negócio
│   │   ├── entities/                                    # Entidades principais
│   │   │   └── LoanSimulation.ts
│   │   └── use-cases/                                   # Casos de uso
│   │       └── SimulateLoan.ts
│   ├── application/                                     # Interface com o mundo externo
│   │   ├── controllers/                                 # Controladores de API
│   │   │   └── LoanController.ts
│   │   └── routes/                                      # Rotas HTTP
│   │       └── loanRoutes.ts
│   ├── infrastructure/                                  # Configurações, servidores e conectores
│   │   ├── config/                                      # Configurações de ambiente
│   │   │   └── dotenv.ts
│   │   ├── workers/                                     # Threads para processamento paralelo
│   │   │   └── simulateWorker.ts
│   │   ├── logger/                                      # Configuração de logs
│   │   │   └── logger.ts
│   │   └── server.ts                                    # Configuração do servidor
│   └── index.ts                                         # Ponto de entrada
├── tests/                                               # Testes unitários, integração e performance
├── k8s/                                                 # Configuração do Kubernetes
│   ├── deployment.yaml                                  # Configuração de deployment
│   └── service.yaml                                     # Configuração de serviço
├── docs/                                                # Documentação API
│   └── api-blueprint.apib                               # Especificação em API Blueprint
├── Dockerfile                                           # Configuração do Docker
├── docker-compose.yml                                   # Arquivo Compose para ambiente local
├── tsconfig.json                                        # Configuração do TypeScript
└── package.json                                         # Dependências e scripts
```
</pre>

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

#### 6. Executar no Kubernetes:
- Aplicar os arquivos de configuração:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Processamento em Alta Volumetria com worker_threads
O endpoint de simulações em massa (/loan/bulk-simulate) utiliza o módulo worker_threads do Node.js para dividir as tarefas de simulação em várias threads, otimizando a performance.

Arquivo: src/infrastructure/workers/simulateWorker.ts
Este arquivo contém a lógica que cada thread executa.

```typescript

  import { workerData, parentPort } from 'worker_threads';
  import { SimulateLoan } from '../../domain/use-cases/SimulateLoan';
  
  if (!workerData || !parentPort) {
    throw new Error('Worker must be initialized with data and port.');
  }
  
  const simulateLoan = new SimulateLoan();
  const results = workerData.map((simulation: any) => simulateLoan.execute(simulation));
  
  parentPort.postMessage(results);
```
Controle no Endpoint:

```typescript

  import { Worker } from 'worker_threads';
  
  export async function bulkSimulate(req: Request, res: Response) {
    const simulations = req.body;
  
    const worker = new Worker('./src/infrastructure/workers/simulateWorker.ts', {
      workerData: simulations,
    });
  
    worker.on('message', (results) => {
      res.status(200).json(results);
    });
  
    worker.on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
  }
```
## Documentação dos Endpoints
A documentação foi feita utilizando API Blueprint e está no diretório docs/api-blueprint.apib.

Exemplo de visualização de endpoints:

/loan/simulate: Simulação de empréstimo individual.
/loan/bulk-simulate: Processamento de múltiplas simulações.

Para gerar uma visualização legível, utilize Aglio:

```bash
aglio -i docs/api-blueprint.apib -o docs/api.html
```

## Integração Kafka (Abstraída)
O código prevê integração futura com Kafka para filas de simulações. Mensagens podem ser enviadas para um tópico e processadas por workers.
Exemplo de integração Kafka:

```typescript

  import { Kafka } from 'kafkajs';
  
  const kafka = new Kafka({ clientId: 'credit-simulation', brokers: ['kafka:9092'] });
  
  const producer = kafka.producer();
  await producer.connect();
  
  await producer.send({
    topic: 'simulation-requests',
    messages: [{ value: JSON.stringify(simulationData) }],
  });
```
## Testes
### Testes de Unidade
Testam a lógica de cálculo de empréstimos:

```bash
npm run test:unit
```
### Testes de Integração
Verificam os endpoints e a interação entre camadas:

```bash

npm run test:integration
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
          url: "/loan/bulk-simulate"
          json:
            - loanAmount: 10000
              birthDate: "1980-01-01"
              termMonths: 24
```
Execute:

```bash

artillery run tests/performance.yaml
```
Com esta estrutura, o microserviço está preparado para processamento paralelo, documentação clara e extensibilidade com mensageria.


