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
