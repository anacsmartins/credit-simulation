import { LoanSimulation } from "../entities/LoanSimulation";
import { LoanSimulationResult } from "../interfaces/LoanSimulationResult";
import { Interest } from "../types/types";

export class LoanSimulationService {
  async simulateLoan(
    loanAmount: number,
    birthDate: Date,
    termMonths: number,
    interestType?: Interest,
  ): Promise<LoanSimulationResult> {
    return new LoanSimulation({loanAmount, birthDate, termMonths, interestType}).simulate();
  }
}
