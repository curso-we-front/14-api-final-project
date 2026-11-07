const request = require("supertest")
const app = require("../src/app")
const { connect, disconnect } = require("../src/db/connection")
const User = require("../src/models/User")
const Article = require("../src/models/Article")
const Comment = require("../src/models/Comment")
const { Types } = require("mongoose")

describe("Comment", () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_TEST_URI)
  }, 10000)

  afterAll(async () => {
    await disconnect()
  })

  beforeEach(async () => {
    await Article.deleteMany({})
    await User.deleteMany({})
    await Comment.deleteMany({})
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

  test("GET /articles/:id/comments - Get comments successful", async () => {
    const userId = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const article = await Article.create({
      author: userId.body.id,
      title: "Test",
      content: "Contenido de prueba para el test de comments",
      status: "published",
    })
    const res = await request(app).get(`/articles/${article._id}/comments`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test("POST /articles/:id/comments - Successful comment post", async () => {
    const user = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const article = await Article.create({
      author: user.body.id,
      title: "Test",
      content: "Contenido de prueba para el test de comments",
      status: "published",
    })
    const token = await loginUser()
    const res = await request(app)
      .post(`/articles/${article._id}/comments`)
      .set("Authorization", "Bearer " + token)
      .send({ content: "Comentario de prueba para el test" })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("content")
  })

  test("POST /articles/:id/comments - Comment post unauthorized", async () => {
    const fakeId = new Types.ObjectId()
    const res = await request(app)
      .post(`/articles/${fakeId}/comments`)
      .send({ content: "Comentario de prueba para test" })
    expect(res.status).toBe(401)
  })

  test("DELETE articles/:id/comments/commentId - Deleted comment successfully", async () => {
    const user = await request(app)
      .post("/auth/register")
      .send({ name: "Test", email: "test@test.com", password: "123456" })
    const article = await Article.create({
      author: user.body.id,
      title: "Test",
      content: "Contenido de prueba para el test de comments",
      status: "published",
    })
    const comment = await Comment.create({
      article: article._id,
      author: user.body.id,
      content: "Comentario de prueba para el delete",
    })
    const token = await loginUser()
    const res = await request(app)
      .delete(`/articles/${article._id}/comments/${comment._id}`)
      .set("Authorization", "Bearer " + token)
    expect(res.status).toBe(204)
  })
})
