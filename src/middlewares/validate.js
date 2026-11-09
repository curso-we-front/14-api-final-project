const required = () => (value) => {
  if (value === null || value === undefined || value === "") {
    return "Requirement error"
  }
  return null
}

const minLength = (min) => (value) => {
  if (value.length < min) {
    return `Minimum length ${min}`
  }
  return null
}

const maxLength = (max) => (value) => {
  if (value.length > max) {
    return `Maximum length is ${max}`
  }
  return null
}

const isEmail = () => (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(value)) {
    return `Invalid email`
  }
  return null
}

function validate(data, schema) {
  const errors = {}
  for (const field in schema) {
    for (const validator of schema[field]) {
      const error = validator(data[field])
      if (error) {
        errors[field] = error
        break
      }
    }
  }
  return errors
}

function validateBody(schema) {
  return (req, res, next) => {
    const errors = validate(req.body, schema)
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors })
    }
    next()
  }
}

const registerSchema = {
  name: [required()],
  email: [required(), isEmail()],
  password: [required(), minLength(6)],
}
const loginSchema = {
  email: [required(), isEmail()],
  password: [required()],
}
const articleSchema = {
  title: [required(), minLength(3), maxLength(100)],
  content: [required(), minLength(10)],
}
const categorySchema = {
  name: [required(), minLength(2), maxLength(50)],
}
const commentSchema = {
  content: [required(), maxLength(300)],
}

module.exports = {
  validateBody,
  registerSchema,
  loginSchema,
  articleSchema,
  categorySchema,
  commentSchema,
}
