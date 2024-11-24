import request from "supertest";
import { Server } from "../../infrastructure/server";

// Mockando o LoanSimulationController
jest.mock("../../application/controllers/LoanController");

describe("Server", () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
  });

  it("should return status 404 for unknown routes", async () => {
    const response = await request(server.app).get("/unknown-route");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not Found");
  });
});
