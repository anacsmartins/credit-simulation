import { LoanSimulationResult } from "../interfaces/LoanSimulationResult";
import { Interest } from "../types/types";

const MONTHS = 12;

export class LoanSimulation {

  private loanAmount: number;
  private birthDate: Date;
  private termMonths: number;
  private interestType?: Interest;

  constructor({ loanAmount, birthDate, termMonths, interestType }: 
    { loanAmount: number; birthDate: Date; termMonths: number; interestType?: Interest }) 
  {
    this.loanAmount = loanAmount;
    this.birthDate = birthDate;
    this.termMonths = termMonths;
    this.interestType = interestType;
  }

  protected calculateInterestRate(): number {
    const age = new Date().getFullYear() - this.birthDate.getFullYear();
    let baseRate = 0;

    if (age <= 25) baseRate = 0.05;
    else if (age <= 40) baseRate = 0.03;
    else if (age <= 60) baseRate = 0.02;
    else baseRate = 0.04;

    if (this.interestType === "fixed") {
      return baseRate;
    }

    // Para taxa variável, é possível usar uma lógica que muda a taxa ao longo do tempo
    // Exemplo: taxa inicial mais uma margem de ajuste.
    const adjustmentFactor = 0.01; // Considerando um aumento de taxa ao longo do tempo de 1%
    return baseRate + adjustmentFactor * (this.termMonths / MONTHS); // Aumento a taxa ao longo do tempo
  }

  public simulate(): LoanSimulationResult {
    const rate = this.calculateInterestRate() / MONTHS;
    const n = this.termMonths;
    const PV = this.loanAmount;

    const PMT = (PV * rate) / (1 - Math.pow(1 + rate, -n));
    const totalPaid = PMT * n;
    const totalInterest = totalPaid - PV;

    return {
      monthlyInstallment: parseFloat(PMT.toFixed(2)),
      totalAmount: parseFloat(totalPaid.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
    };
  }
}
