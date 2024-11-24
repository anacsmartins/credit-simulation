import { LoanSimulation } from "../../domain/entities/LoanSimulation";
import { LoanSimulationResult } from "../../domain/interfaces/LoanSimulationResult";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { Interest } from "../../domain/types/types";


// Mock da classe LoanSimulation
jest.mock("../../domain/entities/LoanSimulation");

describe("LoanSimulationService", () => {
  let loanSimulationService: LoanSimulationService;

  beforeEach(() => {
    loanSimulationService = new LoanSimulationService();
  });

  it("should call LoanSimulation with the correct parameters and return the simulated result", async () => {
    // Arrange
    const mockLoanSimulationResult: LoanSimulationResult = {
        monthlyInstallment: 221.34,
        totalAmount: 10624.48,
        totalInterest: 624.48
    };

    const simulateMock = jest.fn().mockResolvedValue(mockLoanSimulationResult);

    // Substituindo a implementação do método `simulate` da classe `LoanSimulation` pelo mock
    (LoanSimulation as jest.Mock).mockImplementation(() => ({
      simulate: simulateMock,
    }));

    const loanAmount = 10000;
    const birthDate = new Date("1995-01-01");
    const termMonths = 48;
    const interestType: Interest = "fixed";

    // Act
    const result = await loanSimulationService.simulateLoan(loanAmount, birthDate, termMonths, interestType);

    // Assert
    expect(LoanSimulation).toHaveBeenCalledWith({
      loanAmount,
      birthDate,
      termMonths,
      interestType,
    });

    expect(simulateMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockLoanSimulationResult);
  });
});
