const { connect, disconnect } = require("./connection")
const User = require("../models/User")
const users = require("../../data/users")
const articles = require("../../data/articles.json")
const Article = require("../models/Article")
const categories = require("../../data/categories")
const Category = require("../models/Category")
const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 10

async function seed() {
  try {
    await connect()
    await User.deleteMany({})
    await Article.deleteMany({})
    await Category.deleteMany({})
    const hashPasswordUsers = await Promise.all(
      users.map(async (user) => {
        const hashPassword = await bcrypt.hash(user.password, SALT_ROUNDS)
        return { ...user, password: hashPassword }
      }),
    )
    const insertUsers = await User.insertMany(hashPasswordUsers)

    for (const article of articles) {
      const articleAuthor = await User.findOne({ name: article.author })
      const status = article.published ? "published" : "draft"
      const newArticle = {
        title: article.title,
        author: articleAuthor._id,
        content: article.content,
        status,
        tags: [],
        categories: [],
        createdAt: article.createdAt,
      }
      await Article.create(newArticle)
    }
    for (const category of categories) {
      await Category.create(category)
    }
    console.log(`${insertUsers.length} usuarios añadidos a la BBDD`)
  } catch (error) {
    console.error("Error al ejecutar el seed", error)
  } finally {
    await disconnect()
  }
}
seed()
