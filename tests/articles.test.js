const request = require("supertest")
const app = require("../src/app")
const { connect, disconnect } = require("../src/db/connection")
const User = require("../src/models/User")
const Article = require("../src/models/Article")
const { Types } = require("mongoose")
const { ARTICLE_STATUS } = require("../src/config/articleStatus")

describe("Article", () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_TEST_URI)
  }, 10000)

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await Article.deleteMany({})
    await User.deleteMany({})
  })

  async function loginUser() {
    await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" })
    return res.body.token
  }
  async function loginAdmin() {
    const bcrypt = require("bcryptjs")
    const hash = await bcrypt.hash("123456", 10)
    await User.create({ name: "Admin", email: "admin@test.com", password: hash, role: "admin" })
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "admin@test.com", password: "123456" })
    return res.body.token
  }

  test("GET /articles - Get articles successful", async () => {
    const res = await request(app).get("/articles")
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("data")
  })

  test("GET /articles/:id - Get article by id successful", async () => {
    const registerRegistration = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const userId = registerRegistration.body.id
    const article = await Article.create({
      author: userId,
      title: "Test",
      content: "Esto es un artículo de prueba",
      status: "published",
    })
    const res = await request(app).get(`/articles/${article._id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("title")
  })

  test("GET /articles/:id - Article id does not exist", async () => {
    const fakeArticleId = new Types.ObjectId()
    const res = await request(app).get(`/articles/${fakeArticleId}`)
    expect(res.status).toBe(404)
  })

  test("POST /articles - Article post successful", async () => {
    const token = await loginAdmin()
    const res = await request(app)
      .post("/articles")
      .set("Authorization", "Bearer " + token)
      .send({ title: "Test", content: "Esto es un post de un artículo de prueba" })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("title")
  })

  test("POST /articles - Article post not authorized", async () => {
    const res = await request(app)
      .post("/articles")
      .send({ title: "Test", content: "Esto es un post de un artículo de prueba" })
    expect(res.status).toBe(401)
  })

  test("PATCH /articles/:id - Article patch successful", async () => {
    const registerRegistration = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const userId = registerRegistration.body.id
    const article = await Article.create({
      author: userId,
      title: "Test",
      content: "Esto es un artículo de prueba",
      status: ARTICLE_STATUS.PUBLISHED,
    })
    const token = await loginUser()
    const res = await request(app)
      .patch(`/articles/${article._id}`)
      .set("Authorization", "Bearer " + token)
      .send({ title: "Cambio el título", content: "Cambio el contenido del artículo de prueba" })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("title")
  })

  test("PATCH /articles/:id - Unauthorized article patch", async () => {
    const registerRegistration = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const userId = registerRegistration.body.id
    const article = await Article.create({
      author: userId,
      title: "Test",
      content: "Esto es un artículo de prueba",
      status: ARTICLE_STATUS.PUBLISHED,
    })
    await request(app)
      .post("/auth/register")
      .send({ name: "Test2", email: "test2@test.com", password: "123456" })
    const secondUserRes = await request(app)
      .post("/auth/login")
      .send({ email: "test2@test.com", password: "123456" })
    const token = secondUserRes.body.token
    const res = await request(app)
      .patch(`/articles/${article._id}`)
      .set("Authorization", "Bearer " + token)
      .send({ title: "Cambio de título", content: "Cambio el contenido del artículo de prueba" })
    expect(res.status).toBe(403)
  })

  test("DELETE /articles/:id - Delete articles successful", async () => {
    const registerRegistration = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const userId = registerRegistration.body.id
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" })
    const token = loginRes.body.token
    const article = await Article.create({
      author: userId,
      title: "Test",
      content: "Esto es un artículo de prueba",
      status: ARTICLE_STATUS.PUBLISHED,
    })
    const res = await request(app)
      .delete(`/articles/${article._id}`)
      .set("Authorization", "Bearer " + token)
    expect(res.status).toBe(204)
  })

  test("DELETE /articles/:id - Unauthorized delete article", async () => {
    const fakeArticleId = new Types.ObjectId()
    const res = await request(app).delete(`/articles/${fakeArticleId}`)
    expect(res.status).toBe(401)
  })
})
