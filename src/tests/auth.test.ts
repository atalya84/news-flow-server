import initApp from "../app";
import request from "supertest";
import { Express } from "express";

let app: Express;
const user = {
  email: "testUser@test.com",
  password: "1234567890",
  name: "mr.test"
}

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
