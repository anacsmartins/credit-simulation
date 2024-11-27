import "reflect-metadata";  // Importante para ativar o suporte à reflexão no ambiente de testes
import { LoanSimulationController } from "../../application/loan/controllers/LoanSimulationController";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { SendgridProvider } from "../../infrastructure/providers/email/SendgridProvider";
import { Server } from "../../infrastructure/server";
import request from "supertest";

describe("LoanSimulationController Integration Test", () => {
  let serverInstance: Server;
  let loanSimulationService: LoanSimulationService;
  let loanSimulationController: LoanSimulationController;

  jest.mock("@sendgrid/mail", () => ({
    setApiKey: jest.fn(),
  }));

  beforeAll(() => {
    // Mockando a variável de ambiente SENDGRID_API_KEY
    process.env.SENDGRID_API_KEY = "fake-api-key";
  })

  afterAll(() => {
    // Limpar o mock após os testes
    delete process.env.SENDGRID_API_KEY;
    jest.restoreAllMocks();  // Limpa os mocks após cada teste

  });

  beforeEach(() => {
    
   // Instância falsa do SendgridProvider
    const fakeSendgridProvider: SendgridProvider = {
      sendEmail: jest.fn().mockResolvedValue({ success: true }),  // mock do método sendEmail
    };

    // Passar a instância falsa para o LoanSimulationService
    loanSimulationService = new LoanSimulationService(fakeSendgridProvider);
    // Criar a instância do servidor
    serverInstance = new Server();
    loanSimulationController = new LoanSimulationController(loanSimulationService);
  });

  it("should return a successful simulation result if all required fields are provided", async () => {
    const response = await request(serverInstance.app)
      .post("/simulate-loan")
      .send({
        loanAmount: "10000",
        birthDate: "1990-01-01",
        repaymentTermMonths: "12",
        interestType: "fixed",
        currency: "BRL",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        "monthlyInstallment": 846.94,
        "totalAmount": 10163.24,
        "totalInterest": 163.24
      }
    );
  });

  it("should return a successful simulation result if all required fields are provided", async () => {
    const response = await request(serverInstance.app)
      .post("/simulate-loans")
      .send([{
        loanAmount: "10000",
        birthDate: "1990-01-01",
        repaymentTermMonths: "12",
        interestType: "fixed",
        currency: "BRL",
      },
      {
        loanAmount: "1000",
        birthDate: "1980-01-01",
        repaymentTermMonths: "12",
        currency: "BRL",
      }]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{"monthlyInstallment": 851.5, "totalAmount": 10217.99, "totalInterest": 217.99}, {"monthlyInstallment": 84.69, "totalAmount": 1016.32, "totalInterest": 16.32}]
    );
  });
});
