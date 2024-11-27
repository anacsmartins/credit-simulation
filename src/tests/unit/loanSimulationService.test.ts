import "reflect-metadata";
import { LoanSimulationEntity } from "../../domain/entities/LoanSimulationEntity";
import { LoanSimulationResult } from "../../domain/interfaces/LoanSimulationResult";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { SendgridProvider } from "../../infrastructure/providers/email/SendgridProvider";

jest.mock("../../infrastructure/providers/email/SendgridProvider"); // Mockando o SendgridProvider

describe("LoanSimulationService", () => {
  let service: LoanSimulationService;
  let sendgridProvider: jest.Mocked<SendgridProvider>;

  beforeEach(() => {
    sendgridProvider = new SendgridProvider() as jest.Mocked<SendgridProvider>;
    service = new LoanSimulationService(sendgridProvider);
  });

  describe("simulateLoan", () => {
    it("should calculate loan simulation results correctly in BRL", async () => {
      const result = await service.simulateLoan(1000, new Date("1990-01-01"), 12, "fixed", "BRL");
      
      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.totalAmount).toBeGreaterThan(1000);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it("should convert loan amount to BRL and calculate correctly for USD", async () => {
      const result = await service.simulateLoan(1000, new Date("1990-01-01"), 12, "fixed", "USD");

      expect(result.monthlyInstallment).toBeDefined();
      expect(result.totalAmount).toBeDefined();
      expect(result.totalInterest).toBeDefined();
    });

    it("should throw an error if loan simulation data is invalid", async () => {
      jest.spyOn(LoanSimulationEntity.prototype, "validate").mockReturnValue(false);

      await expect(service.simulateLoan(0, new Date("1990-01-01"), 12, "fixed"))
        .rejects
        .toThrow("Failed to simulate loan. Please check the input parameters.");
    });
  });

  describe("sendEmail", () => {
    it("should send email with valid simulation results", async () => {
      const simulationResult: LoanSimulationResult = {
        monthlyInstallment: 100.0,
        totalAmount: 1200.0,
        totalInterest: 200.0,
      };

      const emailText = `Aqui estão os resultados da sua simulação de empréstimo:\n\n` +
      `Parcela Mensal: ${simulationResult.monthlyInstallment.toFixed(0)}\n` +
      `Total a Pagar: ${simulationResult.totalAmount.toFixed(0)}\n` +
      `Total de Juros: ${simulationResult.totalInterest.toFixed(0)}`;

      const email = "test@example.com";
      await service.sendEmail(simulationResult, email);

      expect(sendgridProvider.sendEmail).toHaveBeenCalledWith(
        email,
        "Resultado da Simulação de Empréstimo",
        emailText
      );
    });

    it("should throw an error for invalid email", async () => {
      const simulationResult: LoanSimulationResult = {
        monthlyInstallment: 100.0,
        totalAmount: 1200.0,
        totalInterest: 200.0,
      };

      await expect(service.sendEmail(simulationResult, "invalid-email"))
        .rejects
        .toThrow("E-mail inválido.");
    });
  });
});
