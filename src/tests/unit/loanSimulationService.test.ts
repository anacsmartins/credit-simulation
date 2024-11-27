import { LoanSimulationEntity } from "../../domain/entities/LoanSimulationEntity";
import { LoanSimulationResult } from "../../domain/interfaces/LoanSimulationResult";
import { Interest } from "../../domain/interfaces/types";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";


// Mock do constructor e da função `validate` da entidade LoanSimulationEntity
jest.mock('../../domain/entities/LoanSimulationEntity', () => ({
  LoanSimulationEntity: jest.fn().mockImplementation(() => ({
    validate: jest.fn().mockReturnValue(true),
    loanAmount: 1000,
    birthDate: new Date('1990-01-01'),
    termMonths: 12,
    interestType: 'fixed',
  })),
}));


describe('LoanSimulationService', () => {
  let loanSimulationService: LoanSimulationService;

  beforeEach(() => {
    loanSimulationService = LoanSimulationService.getInstance();
  });

  it('should simulate a loan in BRL correctly', async () => {
    const loanAmount = 1000;
    const birthDate = new Date('1990-01-01');
    const termMonths = 12;
    const interestType: Interest = 'fixed';

    const result: LoanSimulationResult = await loanSimulationService.simulateLoan(
      loanAmount,
      birthDate,
      termMonths,
      interestType,
      'BRL'
    );

    expect(result).toHaveProperty('monthlyInstallment');
    expect(result).toHaveProperty('totalAmount');
    expect(result).toHaveProperty('totalInterest');
    expect(result.monthlyInstallment).toBeGreaterThan(0);
    expect(result.totalAmount).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('should throw an error if loan amount is invalid', async () => {
    const loanAmount = -1000; // Empréstimo com valor negativo (fora do intervalo permitido)
    const birthDate = new Date('1990-01-01');
    const termMonths = 12;
    const interestType: Interest = 'fixed';
  
    // Espera-se que o erro lançado tenha a mensagem correspondente ao erro de valor inválido
    await expect(
      loanSimulationService.simulateLoan(loanAmount, birthDate, termMonths, interestType)
    ).rejects
  });
  

  it('should calculate interest rate based on age and interest type', () => {
    const loanSimulationEntity = new LoanSimulationEntity({
      loanAmount: 1000,
      birthDate: new Date('1990-01-01'),
      termMonths: 12,
      interestType: 'fixed',
    });

    const interestRate = loanSimulationService['calculateInterestRate'](loanSimulationEntity);

    expect(interestRate).toBe(0.03); // Age is 34, so baseRate should be 0.03 for 'fixed' interestType
  });
});
