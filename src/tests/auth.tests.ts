import { Express } from "express";

let app: Express;

const user = {
    email: "jhonDoe@test.com",
    password: "abcd1234",
    name: "jhon"
}

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
});

describe("Auth tests", () => {

})