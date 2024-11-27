import express from "express";
import { LoanSimulationService } from "../../LoanSimulationService";
import { SendgridProvider } from "../providers/email/SendgridProvider";
import { handleValidationErrors } from "../../../../application/middlewares/handlerValidationErrors";
import { loanSimulationValidation } from "../../../../application/middlewares/loanSimulationValidation";
import { LoanSimulationController } from "../../../../application/loan/controllers/LoanController";
import { globalErrorHandler } from "../../../../application/middlewares/globalErrorsHandler";

const router = express.Router();
const sendgridProvider = SendgridProvider.getInstance(); // Criando instância do SendgridProvider
const loanSimulationService = new LoanSimulationService(sendgridProvider); // Injetando SendgridProvider
const loanSimulationController = new LoanSimulationController(loanSimulationService);

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
