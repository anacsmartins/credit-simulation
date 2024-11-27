import express from "express";
import { LoanSimulationController } from "../../application/loan/controllers/LoanSimulationController";
import { handleValidationErrors } from "../../application/middlewares/handlerValidationErrors";
import { loanSimulationValidation } from "../../application/middlewares/loanSimulationValidation";
import { globalErrorHandler } from "../../application/middlewares/globalErrorsHandler";
import { inversifyContainer } from "../providers/inversify/config";
import { TYPES } from "../providers/inversify/types";

const router = express.Router();

// Obtendo o controlador do contêiner (inversify)
const loanSimulationController = inversifyContainer.get<LoanSimulationController>(TYPES.LoanSimulationController);

// Definindo as rotas
router.post(
  "/simulate-loan",
  [...loanSimulationValidation, handleValidationErrors],
  (req: any, res: any) => loanSimulationController.simulate(req, res)
);

router.post(
  "/simulate-loans",
  [...loanSimulationValidation],
  (req: any, res: any) => loanSimulationController.simulateBatch(req, res)
);

router.use(globalErrorHandler);

export default router;
