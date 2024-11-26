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
    const simulations: LoanSimulationRequest[] = req.body;
  
    // Validar se simulations é um array e tem elementos
    if (!Array.isArray(simulations) || simulations.length === 0) {
      res.status(400).json({ message: 'No simulations data provided or invalid format' });
      return;
    }
  
    try {
      // Processar todas as simulações
      const results = await Promise.all(
        simulations.map(({ loanAmount, birthDate, repaymentTermMonths, id }) => {
          // Simular o empréstimo com base nos parâmetros fornecidos
          return this.service.simulateLoan(
            parseInt(loanAmount, 10),
            new Date(birthDate),
            parseInt(repaymentTermMonths, 10)
          ).then((simulationResult) => {
            return {
              ...simulationResult,
              id: id,  // id que foi passado no payload
            };
          });
        })
      );
  
      // Retornar os resultados com a chave 'id' inclusa
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while processing the simulations' });
    }
  }  
}
