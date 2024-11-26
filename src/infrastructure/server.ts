import express from "express";
import bodyParser from "body-parser";
import routes from "../infrastructure/config/routers";
import { globalErrorHandler } from "../application/middlewares/globalErrorsHandler";
import { notFoundHandler } from "../application/middlewares/notFoundHandler";

export class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.app.use("/", routes);
    this.app.use(notFoundHandler); // Middleware modular para rotas 404
    this.app.use(globalErrorHandler); // Captura erros globais
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
