const request = require("supertest")
const app = require("../src/app")
const { connect, disconnect } = require("../src/db/connection")
const User = require("../src/models/User")
const Category = require("../src/models/Category")

describe("Category", () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_TEST_URI)
  }, 10000)

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await Category.deleteMany({})
    await User.deleteMany({})
  })

  async function loginAdmin() {
    const bcrypt = require("bcryptjs")
    const hash = await bcrypt.hash("123456", 10)
    await User.create({ name: "Admin", email: "admin@test.com", password: hash, role: "admin" })
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "admin@test.com", password: "123456" })
    return res.body.token
  }

  test("GET /categories - Successful get categories", async () => {
    const res = await request(app).get("/categories")
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test("POST /categories - Categories post successful", async () => {
    const token = await loginAdmin()
    const res = await request(app)
      .post("/categories")
      .set("Authorization", "Bearer " + token)
      .send({ name: "Test" })
    expect(res.status).toBe(201)
  })

  test("POST /categories - Categories post unauthorized", async () => {
    const res = await request(app).post("/categories").send({ name: "test" })
    expect(res.status).toBe(401)
  })

  test("POST /categories - Categories post forbidden user role", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })

    const loginUser = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" })
    const token = loginUser.body.token
    const res = await request(app)
      .post("/categories")
      .set("Authorization", "Bearer " + token)
      .send({ name: "Test" })
    expect(res.status).toBe(403)
  })

  test("DELETE /categories/:id - Delete category successful", async () => {
    const token = await loginAdmin()
    const category = await Category.create({
      name: "Test",
    })
    const res = await request(app)
      .delete(`/categories/${category._id}`)
      .set("Authorization", "Bearer " + token)
    expect(res.status).toBe(204)
  })
})
