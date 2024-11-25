import express from "express";
import { LoanSimulationController } from "../application/controllers/LoanController";
import { loanSimulationErrorHandler, loanSimulationValidation } from "../application/middlewares/loanSimulationValidation";

export class Server {
  public app = express();
  private loanSimulationController = new LoanSimulationController();

  constructor() {
    const bodyParser = require("body-parser");
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Rota com middleware de validação
    this.app.post(
      "/simulate-loan",
      [...loanSimulationValidation, loanSimulationErrorHandler],
      (req: any, res: any) => this.loanSimulationController.simulate(req, res)
    );

    this.app.use((req, res) => {
      res.status(404).json({ error: "Not Found" });
    });
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
