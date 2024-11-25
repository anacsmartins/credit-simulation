import { body, ValidationChain } from "express-validator";
import { handleValidationErrors } from "./handleValidationErrors";

// Validação dos dados
const validateLoanAmount: ValidationChain = body("loanAmount")
  .isNumeric()
  .withMessage("Loan amount must be a number.")
  .custom((value: number) => value > 0)
  .withMessage("Loan amount must be greater than 0.");

const validateBirthDate: ValidationChain = body("birthDate")
  .isISO8601()
  .toDate()
  .withMessage("Birth date must be a valid ISO8601 date.");

const validateRepaymentTerm: ValidationChain = body("repaymentTermMonths")
  .isInt({ min: 1 })
  .withMessage("Repayment term must be an integer greater than 0.");

const validateInterestType: ValidationChain = body("interestType")
  .optional()
  .isIn(["fixed", "variable"])
  .withMessage("Interest type must be 'fixed' or 'variable'.");

// Exportar os middlewares de validação
export const loanSimulationValidation: ValidationChain[] = [
  validateLoanAmount,
  validateBirthDate,
  validateRepaymentTerm,
  validateInterestType,
];

// Exportar o middleware de tratamento de erros separadamente
export const loanSimulationErrorHandler = handleValidationErrors;
