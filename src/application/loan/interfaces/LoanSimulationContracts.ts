import { LoanSimulationResult } from "../../../domain/interfaces/LoanSimulationResult";
import { Interest } from "../../../domain/interfaces/types";

export interface LoanSimulationRequest {
    loanAmount: string;
    birthDate: string;
    repaymentTermMonths: string;
    interestType?: Interest | undefined;
    currency?: string | undefined;
    id?: number;
    email?: string;
}

export interface LoanSimulationResponse {
    success: boolean;
    result?: LoanSimulationResult;
    error?: string;
  }