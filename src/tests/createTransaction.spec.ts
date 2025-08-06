import { it, expect, beforeAll, afterAll, describe } from "vitest";
import supertest from "supertest";

import { app } from "../app";

describe("transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create transactions", async () => {
    const { statusCode } = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "salario",
        amount: 6000,
        type: "debit",
      });

    expect(statusCode).toEqual(201);
  });
});
