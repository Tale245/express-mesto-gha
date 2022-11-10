const mongoose = require("mongoose");

const objectId = mongoose.Schema.ObjectId;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: objectId,
      required: true,
    },
    likes: [
      {
        type: objectId,
        default: [],
      },
    ],
    createsAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("card", cardSchema);
