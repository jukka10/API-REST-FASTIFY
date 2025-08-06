import z from "zod";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const requestBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = requestBodySchema.parse(req.body);

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    return res.status(201).send();
  });
}
