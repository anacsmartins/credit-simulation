import { body, ValidationChain } from "express-validator";
import { handleValidationErrors } from "./handlerValidationErrors";

// Validação dos dados de entrada
const validateLoanAmount: ValidationChain = body("loanAmount")
  .isFloat({ min: 100, max: 1000000 })
  .withMessage("Loan amount must be between 100 and 1000000.");

const validateBirthDate: ValidationChain = body("birthDate")
  .isISO8601()
  .toDate()
  .withMessage("Birth date must be a valid ISO8601 date.");

const validateRepaymentTerm: ValidationChain = body("repaymentTermMonths")
  .isInt({ min: 12, max: 60 })
  .withMessage("Repayment term must be between 12 and 60 months.");

const validateInterestType: ValidationChain = body("interestType")
  .optional()
  .isIn(["fixed", "variable"])
  .withMessage("Interest type must be 'fixed' or 'variable'.");

const validateCurrency: ValidationChain = body("currency")
  .optional()
  .isIn(["BRL", "USD", "EUR", "GBP"])
  .withMessage("Currency must be one of the following: BRL, USD, EUR, GBP.");

// Exportar os middlewares de validação
export const loanSimulationValidation: ValidationChain[] = [
  validateLoanAmount,
  validateBirthDate,
  validateRepaymentTerm,
  validateInterestType,
  validateCurrency,
];

// Exportar o middleware de tratamento de erros separadamente
export const loanSimulationErrorHandler = handleValidationErrors;
