const Comment = require("../models/Comment")
const asyncHandler = require("../utils/asyncHandler")

const getAll = asyncHandler(async (req, res) => {
  const { id } = req.params
  const comment = await Comment.find({ article: id })
  res.status(200).json(comment)
})

const create = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { content, parentComment } = req.body
  const author = req.user.id
  const comment = await Comment.create({ article: id, author, content, parentComment })
  res.status(201).json(comment)
})

const remove = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  const comment = await Comment.findById(commentId)
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" })
  }
  if (comment.author.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" })
  }
  await Comment.findByIdAndDelete(commentId)
  res.status(204).send()
})

module.exports = { getAll, create, remove }
