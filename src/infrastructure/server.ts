import 'reflect-metadata';
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
    this.app.use("/", routes);  // Suas rotas são registradas aqui

    // Middleware para rotas desconhecidas
    this.app.use(notFoundHandler);  // Captura as requisições para rotas não definidas

    // Middleware global de erro, se necessário para erros internos
    this.app.use(globalErrorHandler); 
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
