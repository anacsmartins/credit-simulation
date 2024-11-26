import { Request, Response } from "express";
import { LoanSimulationService } from "../../../domain/services/LoanSimulationService";
import { LoanSimulationRequest } from "../interfaces/LoanSimulationContracts";

export class LoanSimulationController {
  private readonly service: LoanSimulationService;

  constructor(service: LoanSimulationService) {
    this.service = service;
    this.simulate = this.simulate.bind(this);
    this.simulateBatch = this.simulateBatch.bind(this);
  }

  public async simulate(req: Request, res: Response): Promise<void> {
    const { loanAmount, birthDate, repaymentTermMonths, interestType, currency } : LoanSimulationRequest = req.body;

    const simulationResult = await this.service.simulateLoan(
      parseInt(loanAmount, 10),
      new Date(birthDate),
      parseInt(repaymentTermMonths, 10),
      interestType,
      currency
    );

    res.status(200).json(simulationResult);
  }

  public async simulateBatch(req: Request, res: Response): Promise<void> {
    const simulations: LoanSimulationRequest[] = req.body.simulations;

    const results = await Promise.all(
      simulations.map(({ loanAmount, birthDate, repaymentTermMonths, interestType, currency }) =>
        this.service.simulateLoan(
          parseInt(loanAmount, 10),
          new Date(birthDate),
          parseInt(repaymentTermMonths, 10),
          interestType,
          currency
        )
      )
    );
    res.status(200).json({ results });
  }
}
