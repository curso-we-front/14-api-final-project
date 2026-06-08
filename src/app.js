
const express = require("express");
const articlesRouter = require("./routes/articles");
const categoriesRouter = require("./routes/categories");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const { publicLimiter, authLimiter } = require("./middleware/rateLimit");

const app = express();

app.use(express.json());

app.use("/articles", publicLimiter, articlesRouter);
app.use("/categories", publicLimiter, categoriesRouter);
app.use("/comments", publicLimiter, commentsRouter);
app.use("/auth", authLimiter, authRouter);

app.use(errorHandler);

module.exports = app;
