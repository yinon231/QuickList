const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});
const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    items: [itemSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("lists", listSchema);
