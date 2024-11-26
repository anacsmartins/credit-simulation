import { check, validationResult } from 'express-validator';
import { Interest } from '../types/types';

export class LoanSimulationEntity {
  loanAmount: number;
  birthDate: Date;
  termMonths: number;
  interestType?: Interest;
  currency?: string;

  constructor({ loanAmount, birthDate, termMonths, interestType, currency  }: 
    { loanAmount: number; birthDate: Date; termMonths: number; interestType?: Interest, currency?: string; }) {
    this.loanAmount = loanAmount;
    this.birthDate = birthDate;
    this.termMonths = termMonths;
    this.interestType = interestType;
    this.currency = currency;
  }

  // Método para validar se os dados da simulação de empréstimo estão corretos
  public validate(): boolean {
    const supportedCurrencies = ["BRL", "USD", "EUR", "GBP"];
    if (!supportedCurrencies.includes(this.currency ?? "BRL")) {
      throw new Error(
        `Unsupported currency: ${this.currency}. Supported currencies are ${supportedCurrencies.join(", ")}.`
      );
    }
    const errors = validationResult(this);
    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${errors.array().map(err => err.msg).join(', ')}`);
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
