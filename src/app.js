const express = require("express")
const authRouter = require("./routes/auth")
const { errorHandler } = require("./middlewares/errorHandler")
const categoriesRouter = require("./routes/categories")
const articlesRouter = require("./routes/articles")
const commentsRouter = require("./routes/comments")

const app = express()
app.use(express.json())

app.use("/auth", authRouter)
app.use("/categories", categoriesRouter)
app.use("/articles", articlesRouter)
app.use("/articles/:id/comments", commentsRouter)

app.use(errorHandler)

module.exports = app
