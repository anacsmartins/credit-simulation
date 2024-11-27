import { LoanSimulationService } from "../../domain/types/LoanSimulationService";
import { LoanSimulationController } from "../../application/loan/controllers/LoanController";
import { Server } from "../../domain/types/infrastructure/server";
import request from "supertest";

// Mockando a classe LoanSimulationService corretamente
jest.mock("../../domain/services/LoanSimulationService", () => {
  return {
    LoanSimulationService: {
      getInstance: jest.fn().mockReturnValue({
        simulateLoan: jest.fn(),
      }),
    },
  };
});

describe("LoanSimulationController Integration Test", () => {
  let serverInstance: Server;
  let mockSimulationService: jest.Mocked<LoanSimulationService>;

  beforeEach(() => {
    // Obtendo a instância mockada do LoanSimulationService
    mockSimulationService = LoanSimulationService.getInstance() as jest.Mocked<LoanSimulationService>;

    // Cria a instância do servidor
    serverInstance = new Server();

    // Substitui o controlador no servidor com o serviço mockado
    serverInstance.app.post("/simulate-loan", (req, res) => {
      const loanSimulationController = new LoanSimulationController(mockSimulationService);
      loanSimulationController.simulate(req, res);
    });
  });

  it("should return a successful simulation result if all required fields are provided", async () => {
    const mockSimulationResult = {
      totalAmount: 10000,
      monthlyInstallment: 1841,
      totalInterest: 11841,
    };

    // Mock do método simulateLoan
    mockSimulationService.simulateLoan.mockResolvedValue(mockSimulationResult);

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
    expect(response.body).toEqual(mockSimulationResult);
    expect(mockSimulationService.simulateLoan).toHaveBeenCalledWith(
      10000,
      new Date("1990-01-01"),
      12,
      "fixed",
      "BRL"
    );
  });
});
