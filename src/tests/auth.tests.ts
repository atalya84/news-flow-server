import { Express } from "express";
import initApp from "../app";
import request from "supertest";

let app: Express;

const user = {
  email: "jhonDoe@test.com",
  password: "abcd1234",
  name: "jhon",
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

describe("Auth tests", () => {

  test("Test Register with name", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  });
});
