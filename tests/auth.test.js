const request = require("supertest")
const app = require("../src/app")
const { connect, disconnect } = require("../src/db/connection")
const User = require("../src/models/User")

describe("Auth", () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_TEST_URI)
  }, 10000)

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test("POST /auth/register - Registration successful", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "123456" })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("email")
  })

  test("POST /auth/register - Duplicate email", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "123456" })

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User 2", email: "test@test.com", password: "123456" })

    expect(res.status).toBe(400)
  })

  test("POST /auth/register - Invalid fields", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "", email: "test@test.com", password: "123456" })

    expect(res.status).toBe(422)
  })

  test("POST /auth/login - Login successful", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "123456" })
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
  })

  test("POST /auth/login - Invalid password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "123456" })
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "1234567" })

    expect(res.status).toBe(401)
  })

  test("POST /auth/login - Invalid email", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@test.com", password: "123456" })
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@testt.com", password: "123456" })

    expect(res.status).toBe(401)
  })
})
