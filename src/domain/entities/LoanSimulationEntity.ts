import { check } from 'express-validator';
import { Interest } from '../types/types';

export class LoanSimulationEntity {
  loanAmount: number;
  birthDate: Date;
  termMonths: number;
  interestType?: Interest;
  currency?: string;

  constructor({
    loanAmount,
    birthDate,
    termMonths,
    interestType,
    currency,
  }: {
    loanAmount: number;
    birthDate: Date;
    termMonths: number;
    interestType?: Interest;
    currency?: string;
  }) {
    this.loanAmount = loanAmount;
    this.birthDate = birthDate;
    this.termMonths = termMonths;
    this.interestType = interestType;
    this.currency = currency;
  }

  // Método para validar os dados de simulação de empréstimo
  public validate(): boolean {
    // Validando a moeda
    const supportedCurrencies = ["BRL", "USD", "EUR", "GBP"];
    if (!supportedCurrencies.includes(this.currency ?? "BRL")) {
      throw new Error(
        `Unsupported currency: ${this.currency}. Supported currencies are ${supportedCurrencies.join(", ")}.`
      );
    }

    // Validações customizadas
    if (this.loanAmount < 1000 || this.loanAmount > 100000) {
      throw new Error('Loan amount must be between $1,000 and $100,000.');
    }

    if (this.termMonths < 12 || this.termMonths > 60) {
      throw new Error('Term must be between 12 and 60 months.');
    }

    if (isNaN(this.birthDate.getTime())) {
      throw new Error('Birth date must be a valid date.');
    }

    if (this.interestType && !['fixed', 'variable'].includes(this.interestType)) {
      throw new Error('Interest type must be either "fixed" or "variable".');
    }

    return true;
  }

  // Validações customizadas
  static get validations() {
    return [
      check('loanAmount').isFloat({ min: 1000, max: 100000 }).withMessage('Loan amount must be between $1,000 and $100,000.'),
      check('termMonths').isInt({ min: 12, max: 60 }).withMessage('Term must be between 12 and 60 months.'),
      check('birthDate').isDate().withMessage('Birth date must be a valid date.'),
      check('interestType').optional().isIn(['fixed', 'variable']).withMessage('Interest type must be either "fixed" or "variable".'),
    ];
  }
}
