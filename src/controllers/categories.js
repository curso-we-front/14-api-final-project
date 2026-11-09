const Category = require("../models/Category")
const asyncHandler = require("../utils/asyncHandler")

const getAll = asyncHandler(async (req, res) => {
  const allCategories = await Category.find()
  res.status(200).json(allCategories)
})

const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params
  const category = await Category.findById(id)
  if (!category) {
    return res.status(404).json({ error: "Category not found" })
  }
  res.status(200).json(category)
})

const create = asyncHandler(async (req, res) => {
  const { name } = req.body
  const category = await Category.create({ name })
  res.status(201).json(category)
})

const update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name } = req.body
  const category = await Category.findById(id)
  if (!category) {
    return res.status(404).json({ error: "Category not found" })
  }
  category.name = name
  await category.save()
  res.status(200).json(category)
})

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params
  const categoryRemove = await Category.findByIdAndDelete(id)
  if (!categoryRemove) {
    return res.status(404).json({ error: "Category not found" })
  }
  res.status(204).send()
})

module.exports = { getAll, getOne, create, update, remove }
