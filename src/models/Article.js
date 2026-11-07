const mongoose = require("mongoose")
const slugify = require("slugify")
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    tags: [String],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

articleSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      remove: /[,.:]/g,
      lower: true,
    })
  }
})

articleSchema.index({ title: "text", content: "text" })

module.exports = mongoose.model("Article", articleSchema)
