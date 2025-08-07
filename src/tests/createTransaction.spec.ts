import { it, expect, beforeAll, afterAll, beforeEach, describe } from "vitest";
import { execSync } from "node:child_process";
import supertest from "supertest";

import { app } from "../app";

describe("transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback");
    execSync("npm run knex migrate:latest");
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

  it("Should be able to list all transactions", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "salario",
        amount: 6000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionResponse = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", String(cookies))
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "salario",
        amount: 6000,
      }),
    ]);
  });

  it("Should be able to get a especific transaction", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "salario",
        amount: 6000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionResponse = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", String(cookies))
      .expect(200);

    const transactionId = listTransactionResponse.body.transactions[0].id;

    const getTransactionResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", String(cookies))
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({ title: "salario", amount: 6000 })
    );
  });

  it("Should be able to get the summary", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "salario",
        amount: 6000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await supertest(app.server)
      .post("/transactions")
      .set("Cookie", String(cookies))
      .send({
        title: "Conta de luz",
        amount: 3000,
        type: "debit",
      });

    const listTransactionResponse = await supertest(app.server)
      .get("/transactions/summary")
      .set("Cookie", String(cookies))
      .expect(200);

    expect(listTransactionResponse.body.summary).toEqual(
      expect.objectContaining({ amount: 3000 })
    );
  });
});
