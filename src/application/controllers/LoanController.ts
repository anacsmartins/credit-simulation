import { Request, Response } from "express";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { LoanSimulationResult } from "../../domain/interfaces/LoanSimulationResult";

export class LoanSimulationController {
  private service: LoanSimulationService;

  constructor() {
    this.service = new LoanSimulationService();
  }

  async simulate(req: Request, res: Response): Promise<void> {
    const { loanAmount, birthDate, repaymentTermMonths, interestType } = req.body;
    if (!loanAmount || !birthDate || !repaymentTermMonths) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const simulationResult: LoanSimulationResult = await this.service.simulateLoan(
      parseInt(loanAmount, 10),
      new Date(birthDate),
      parseInt(repaymentTermMonths, 10),
      interestType
    );

    res.status(200).json(simulationResult);
  }
}
