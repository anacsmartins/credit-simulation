import express from "express";
import { LoanSimulationService } from "../../domain/services/LoanSimulationService";
import { handleValidationErrors } from "../../application/middlewares/handlerValidationErrors";
import { loanSimulationValidation } from "../../application/middlewares/loanSimulationValidation";
import { LoanSimulationController } from "../../application/loan/controllers/LoanController";
import { globalErrorHandler } from "../../application/middlewares/globalErrorsHandler";

const router = express.Router();
const loanSimulationService = LoanSimulationService.getInstance();
const loanSimulationController = new LoanSimulationController(loanSimulationService);

router.post(
    "/simulate-loan",
    [...loanSimulationValidation, handleValidationErrors],
    (req: any, res: any) => loanSimulationController.simulate(req, res) // Arrow function garante o contexto correto
  );
  
  router.post(
    "/simulate-loans",
    [...loanSimulationValidation],
    (req: any, res: any) => loanSimulationController.simulateBatch(req, res)
  );
  
// Middleware para tratar erros globais
router.use(globalErrorHandler);

export default router;
