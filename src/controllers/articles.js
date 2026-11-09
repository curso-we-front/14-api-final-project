const Article = require("../models/Article")
const PAGE_DEFAULT = 1
const LIMIT_DEFAULT = 10
const asyncHandler = require("../utils/asyncHandler")
const { CONTENT_MANAGERS } = require("../config/roles")
const { ARTICLE_STATUS } = require("../config/articleStatus")

const canModify = (article, user) => {
  return article.author.toString() === user.id.toString() || CONTENT_MANAGERS.includes(user.role)
}

const getAll = asyncHandler(async (req, res) => {
  const {
    tag,
    author,
    category,
    search,
    status,
    sort,
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
    populate,
  } = req.query
  const pageNumber = Number(page)
  const limitNumber = Number(limit)
  const filters = {
    status: status || ARTICLE_STATUS.PUBLISHED,
  }
  if (tag) {
    filters.tags = tag
  }
  if (search) {
    filters.$text = {
      $search: search,
    }
  }
  if (author) {
    filters.author = author
  }
  if (category) {
    filters.categories = category
  }
  let query = Article.find(filters)

  if (search) {
    query = query.sort({ score: { $meta: "textScore" } })
  } else {
    query = query.sort({ [sort || "createdAt"]: -1 })
  }
  if (populate === "author") {
    query = query.populate("author", "-password")
  }
  const [total, data] = await Promise.all([
    Article.countDocuments(filters),
    query.skip((pageNumber - 1) * limitNumber).limit(limitNumber),
  ])
  const totalPages = Math.ceil(total / limitNumber)
  res.status(200).json({ data, total, page: pageNumber, limit: limitNumber, totalPages })
})

const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await Article.findById(id)
  if (!article) {
    return res.status(404).json({ error: "Article not found" })
  }
  res.status(200).json(article)
})

const create = asyncHandler(async (req, res) => {
  const author = req.user.id
  const { title, content, status, tags, categories } = req.body
  const article = await Article.create({ author, title, content, tags, categories, status })
  res.status(201).json(article)
})

const replace = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, content, status, tags, categories } = req.body
  const article = await Article.findById(id)
  if (!article) {
    return res.status(404).json({ error: "Article not found" })
  }
  if (!canModify(article, req.user)) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  article.title = title
  article.content = content
  article.status = status
  article.tags = tags
  article.categories = categories
  await article.save()

  res.status(200).json(article)
})

const update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, content, tags, categories, status } = req.body
  const article = await Article.findById(id)
  if (!article) {
    return res.status(404).json({ error: "Article not found" })
  }
  if (!canModify(article, req.user)) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  if (title !== undefined) article.title = title
  if (content !== undefined) article.content = content
  if (tags !== undefined) article.tags = tags
  if (categories !== undefined) article.categories = categories
  if (status !== undefined) article.status = status
  await article.save()

  res.status(200).json(article)
})

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await Article.findById(id)
  if (!article) {
    return res.status(404).json({ error: "Article not found" })
  }
  if (!canModify(article, req.user)) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  await Article.findByIdAndDelete(id)

  res.status(204).send()
})

module.exports = { getAll, getOne, create, replace, update, remove }
