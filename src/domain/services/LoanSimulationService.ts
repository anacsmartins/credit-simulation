
import { SendgridProvider } from "../../infrastructure/providers/email/SendgridProvider";
import { TYPES } from "../../infrastructure/providers/inversify/types";
import { LoanSimulationEntity } from "../entities/LoanSimulationEntity";
import { LoanSimulationResult } from "../interfaces/LoanSimulationResult";
import { Interest } from "../interfaces/types";
import { injectable, inject } from 'inversify';
import { EmailValidator } from "../utils/validators/emailValidate";


const MONTHS = 12;

// Exemplo de taxas de câmbio fictícias (ideal seria armazenar essa info no banco de dados)
const exchangeRates: Record<string, number> = {
  USD: 5.3,  // 1 USD = 5.3 BRL
  EUR: 5.88, // 1 EUR = 5.88 BRL
  GBP: 6.67, // 1 GBP = 6.67 BRL
  BRL: 1.0,  // 1 BRL = 1 BRL
};

@injectable()
export class LoanSimulationService {
  private sendgridProvider: SendgridProvider;

  constructor(@inject(TYPES.SendgridProvider) sendgridProvider: SendgridProvider) {
    this.sendgridProvider = sendgridProvider;
  }

  // Função para converter o valor do empréstimo para BRL (moeda padrão)
  private convertCurrency(amount: number, currency: string = 'BRL'): number {
    const rate = exchangeRates[currency];
    return amount * rate; // Convertendo para BRL
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

      // Convertendo os resultados para a moeda original (caso não seja BRL)
      const result: LoanSimulationResult = {
        monthlyInstallment: parseFloat((PMT / exchangeRates[currency]).toFixed(2)),  // Convertendo para a moeda original
        totalAmount: parseFloat((totalPaid / exchangeRates[currency]).toFixed(2)),
        totalInterest: parseFloat((totalInterest / exchangeRates[currency]).toFixed(2)),
      };

      return result;
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

  public async sendEmail(simulationResult: LoanSimulationResult, email?: string) {
    // Verificando se o e-mail é válido
    if (email && !EmailValidator.isValid(email)) {
      throw new Error("E-mail inválido.");
    }
  
    // Preparando a mensagem para envio
    const emailText = `Aqui estão os resultados da sua simulação de empréstimo:\n\n` +
    `Parcela Mensal: ${simulationResult.monthlyInstallment}\n` +
    `Total a Pagar: ${simulationResult.totalAmount}\n` +
    `Total de Juros: ${simulationResult.totalInterest}`;
  
    // Enviando o e-mail com os resultados da simulação
    await this.sendgridProvider.sendEmail(email!, 'Resultado da Simulação de Empréstimo', emailText);
  }
}
