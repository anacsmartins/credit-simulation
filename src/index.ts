import { config } from 'dotenv';
config();  // Carrega as variáveis do arquivo .env
import 'reflect-metadata';
import { Server } from "./infrastructure/server";

const PORT = 3000;

const server = new Server();
server.start(PORT);
