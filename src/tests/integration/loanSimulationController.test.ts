import supertest from 'supertest';
import { Server } from '../../infrastructure/server';

// Mockando o LoanSimulationService
jest.mock("../../domain/services/LoanSimulationService");

describe("LoanSimulationController", () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
  });

  it("should return error 400 if 'loanAmount' is missing", async () => {
    const response = await supertest(server.app)
      .post("/simulate-loan")
      .send({
        birthDate: "1990-01-01",
        repaymentTermMonths: 12,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required fields");
  });

  it("should return error 400 if 'birthDate' is missing", async () => {
    const response = await supertest(server.app)
      .post("/simulate-loan")
      .send({
        loanAmount: 10000,
        repaymentTermMonths: 12,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required fields");
  });

  it("should return error 400 if 'repaymentTermMonths' is missing", async () => {
    const response = await supertest(server.app)
      .post("/simulate-loan")
      .send({
        loanAmount: 10000,
        birthDate: "1990-01-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required fields");
  });
});

