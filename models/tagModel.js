import mongoose from "mongoose"
mongoose.Promise = global.Promise;

const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order_number: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tagSchema.virtual("id").get(function () {
  return this._id.toHexString()
})

export {tagSchema}


const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema)

export default Tag
