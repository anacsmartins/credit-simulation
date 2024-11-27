import { Server } from "./domain/types/infrastructure/server";

const PORT = 3000;

const server = new Server();
server.start(PORT);
