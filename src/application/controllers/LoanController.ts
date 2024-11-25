import { Request, Response } from "express";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { LoanSimulationResult } from "../../domain/interfaces/LoanSimulationResult";

export class LoanSimulationController {
  private readonly service: LoanSimulationService;

  constructor() {
    this.service = new LoanSimulationService();
  }

  /**
   * Processa a simulação de empréstimo.
  */
  public async simulate(req: Request, res: Response): Promise<void> {
    try {
      const { loanAmount, birthDate, repaymentTermMonths, interestType } = req.body;

      const simulationResult: LoanSimulationResult = await this.service.simulateLoan(
        parseInt(loanAmount, 10),
        new Date(birthDate),
        parseInt(repaymentTermMonths, 10),
        interestType
      );

      res.status(200).json(simulationResult);
    } catch (error) {
      console.error("Simulation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
