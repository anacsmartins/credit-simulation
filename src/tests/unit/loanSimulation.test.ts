import { LoanSimulation } from "../../domain/entities/LoanSimulation";


describe('LoanSimulation', () => {

  it('should calculate correct interest rate for fixed interest with age under 25', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 10000,
      birthDate: new Date(2000, 1, 1),  // Idade de 24 anos
      termMonths: 24,
      interestType: 'fixed',
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBeGreaterThan(0);
  });

  it('should calculate correct interest rate for fixed interest with age between 26 and 40', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 15000,
      birthDate: new Date(1985, 1, 1),  // Idade de 39 anos
      termMonths: 36,
      interestType: 'fixed',
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBeGreaterThan(0);
  });

  it('should calculate correct interest rate for variable interest', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 20000,
      birthDate: new Date(1990, 1, 1),  // Idade de 34 anos
      termMonths: 48,
      interestType: 'variable',
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBeGreaterThan(0);
  });

  it('should calculate correct interest rate for age above 60 with variable interest', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 25000,
      birthDate: new Date(1950, 1, 1),  // Idade de 74 anos
      termMonths: 60,
      interestType: 'variable',
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalAmount).toBeGreaterThan(0);
  });

  it('should return correct monthly installment and total amount with expected precision', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 5000,
      birthDate: new Date(1995, 1, 1),  // Idade de 29 anos
      termMonths: 12,
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeCloseTo(425.75, 2);
    expect(result.totalAmount).toBeCloseTo(5108.99, 2);
    expect(result.totalInterest).toBeCloseTo(108.99, 2);
  });


  it('should return the correct monthly installment and total amount with the expected accuracy for those under 24 years of age', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 5000,
      birthDate: new Date(2005, 1, 1),  // Idade de 19 anos
      termMonths: 12,
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeCloseTo(430.33, 2);
    expect(result.totalAmount).toBeCloseTo(5163.99, 2);
    expect(result.totalInterest).toBeCloseTo(163.99, 2);
  });

  it('should return the correct monthly installment and the total amount if you are under 40 and over 25 years old', () => {
    const loanSimulation = new LoanSimulation({
      loanAmount: 35000,
      birthDate: new Date(1994, 1, 1),  // Idade de 30 anos
      termMonths: 48,
      interestType: 'fixed',
    });

    const result = loanSimulation.simulate();
    expect(result.monthlyInstallment).toBeCloseTo(774.70, 2);
    expect(result.totalAmount).toBeCloseTo(37185.67, 2);
    expect(result.totalInterest).toBeCloseTo(2185.67, 2);
  });
});
