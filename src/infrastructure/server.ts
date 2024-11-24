import express from "express";
import { LoanSimulationController } from "../application/controllers/LoanController";

export class Server {
  private app = express();
  private loanSimulationController = new LoanSimulationController();

  constructor() {
    const bodyParser = require('body-parser');
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.post("/simulate-loan", (req, res) => this.loanSimulationController.simulate(req, res));

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
