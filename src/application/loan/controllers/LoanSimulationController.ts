import { inject } from 'inversify';
import { Request, Response } from 'express';
import { LoanSimulationRequest } from '../interfaces/LoanSimulationContracts';
import { LoanSimulationService } from '../../../domain/services/LoanSimulationService';
import { TYPES } from '../../../infrastructure/providers/inversify/types';

export class LoanSimulationController {
  private readonly service: LoanSimulationService;

  // Injeção de dependência via container
  constructor(@inject(TYPES.LoanSimulationService) service: LoanSimulationService) {
    this.service = service;
    this.simulate = this.simulate.bind(this);
    this.simulateBatch = this.simulateBatch.bind(this);    
  }

  public async simulate(req: Request, res: Response): Promise<void> {
    const { loanAmount, birthDate, repaymentTermMonths, interestType, currency, email }: LoanSimulationRequest = req.body;

    try {
      const simulationResult = await this.service.simulateLoan(
        parseInt(loanAmount, 10),
        new Date(birthDate),
        parseInt(repaymentTermMonths, 10),
        interestType,
        currency
      );

      await this.service.sendEmail(simulationResult, email);

      res.status(200).json(simulationResult);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao processar a simulação' });
    }
  }

  public async simulateBatch(req: Request, res: Response): Promise<void> {
    const simulations: LoanSimulationRequest[] = req.body;

    // Validar se simulations é um array e tem elementos
    if (!Array.isArray(simulations) || simulations.length === 0) {
      res.status(400).json({ message: 'No simulations data provided or invalid format' });
      return;
    }

    try {
      const results = await Promise.all(
        simulations.map(({ loanAmount, birthDate, repaymentTermMonths, id }) => {
          return this.service.simulateLoan(
            parseInt(loanAmount, 10),
            new Date(birthDate),
            parseInt(repaymentTermMonths, 10)
          ).then((simulationResult) => {
            return {
              ...simulationResult,
              id: id,
            };
          });
        })
      );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while processing the simulations' });
    }
  }
}
