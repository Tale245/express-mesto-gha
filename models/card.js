const mongoose = require('mongoose');
const { isUrl } = require('validator');

const objectId = mongoose.Schema.Types.ObjectId;

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
      validate: {
        validator: (v) => isUrl(v),
      },
    },
    owner: {
      type: objectId,
      required: true,
      ref: 'user',
    },
    likes: [
      {
        type: objectId,
        default: [],
        ref: 'user',
      },
    ],
    createsAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
