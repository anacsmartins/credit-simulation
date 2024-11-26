import { LoanSimulationEntity } from "../entities/LoanSimulationEntity";
import { LoanSimulationResult } from "../interfaces/LoanSimulationResult";
import { Interest } from "../types/types";

const MONTHS = 12;

// Exemplo de taxas de câmbio fictícias (ideal seria armazenar essa info no banco de dados)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.9,
  GBP: 0.75,
  BRL: 5.3, // 1 USD = 5.3 BRL
};

export class LoanSimulationService {
  private static instance: LoanSimulationService;

  private constructor() {}

  public static getInstance(): LoanSimulationService {
    if (!LoanSimulationService.instance) {
      LoanSimulationService.instance = new LoanSimulationService();
    }
    return LoanSimulationService.instance;
  }

  // Função para converter o valor do empréstimo
  private convertCurrency(amount: number, currency: string = 'BRL'): number {
    const rate = exchangeRates[currency] || exchangeRates['BRL']; // Default para BRL se a moeda não for reconhecida
    return amount / rate; // Convertendo para BRL, que é a moeda padrão
  }

  // Método para simular o empréstimo
  public async simulateLoan(loanAmount: number, birthDate: Date, termMonths: number, interestType?: Interest, currency: string = 'BRL'): Promise<LoanSimulationResult> {
    try {
      // Convertendo o valor do empréstimo para BRL (moeda padrão)
      const loanAmountInBRL = this.convertCurrency(loanAmount, currency);

      const loanSimulation = new LoanSimulationEntity({ loanAmount: loanAmountInBRL, birthDate, termMonths, interestType });
      if (!loanSimulation.validate()) {
        throw new Error("Invalid loan simulation data.");
      }

      // Calculando a taxa de juros
      const rate = this.calculateInterestRate(loanSimulation) / MONTHS;
      const n = loanSimulation.termMonths;
      const PV = loanSimulation.loanAmount;

      // Cálculo das parcelas, total pago e juros totais
      const PMT = (PV * rate) / (1 - Math.pow(1 + rate, -n));
      const totalPaid = PMT * n;
      const totalInterest = totalPaid - PV;

      // Convertendo os resultados para a moeda original (BRL)
      return {
        monthlyInstallment: parseFloat((PMT * exchangeRates[currency]).toFixed(2)),
        totalAmount: parseFloat((totalPaid * exchangeRates[currency]).toFixed(2)),
        totalInterest: parseFloat((totalInterest * exchangeRates[currency]).toFixed(2)),
      };
    } catch (error) {
      console.error("Error during loan simulation:", error);
      throw new Error("Failed to simulate loan. Please check the input parameters.");
    }
  }

  // Método para calcular a taxa de juros
  private calculateInterestRate(loanSimulation: LoanSimulationEntity): number {
    const age = new Date().getFullYear() - loanSimulation.birthDate.getFullYear();
    let baseRate = 0;

    if (age <= 25) baseRate = 0.05;
    else if (age <= 40) baseRate = 0.03;
    else if (age <= 60) baseRate = 0.02;
    else baseRate = 0.04;

    if (loanSimulation.interestType === "fixed") {
      return baseRate;
    }

    const adjustmentFactor = 0.01;
    return baseRate + adjustmentFactor * (loanSimulation.termMonths / MONTHS);
  }
}
