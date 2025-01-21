import request from "supertest";
import app from "../app";
import { connectToDatabase, closeDatabase } from "../utils/testDatabase";

describe("URL API Endpoints", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("should create a new URL", async () => {
    const res = await request(app)
      .post("api/v1/shorten")
      .send({
        longUrl: "https://example.com",
        customAlias: "exmpl75",
        topic: "tech",
      })
      .expect(201);

    console.log("Response:", res.body); // Debugging statement

    // expect(res.body).toHaveProperty("urlId");
    // expect(res.body.originalUrl).toBe("https://example.com");
    // expect(res.body.alias).toBe("exmpl");
  });

  // it("should return 400 for invalid URL", async () => {
  //   const res = await request(app)
  //     .post("api/v1/shorten")
  //     .send({
  //       originalUrl: "invalid-url",
  //       alias: "invld",
  //     })
  //     .expect(400);

  //   console.log("Response:", res.body); // Debugging statement

  //   expect(res.body.message).toBe("Invalid URL format");
  // });

  // it("should return a URL by alias", async () => {
  //   const alias = "exmpl";
  //   const res = await request(app).get(`api/v1/shorten${alias}`).expect(200);

  //   console.log("Response:", res.body); // Debugging statement

  //   expect(res.body.alias).toBe(alias);
  //   expect(res.body.originalUrl).toBe("https://example.com");
  // });

  // it("should return 404 for non-existing alias", async () => {
  //   const alias = "nonexistent";
  //   const res = await request(app).get(`/api/urls/${alias}`).expect(404);

  //   console.log("Response:", res.body); // Debugging statement

  //   expect(res.body.message).toBe("URL not found");
  // });
});
