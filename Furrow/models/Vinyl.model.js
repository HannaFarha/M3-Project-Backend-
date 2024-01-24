const {mongoose, Schema, model } = require('mongoose')

// TODO: Please make sure you edit the Book model to whatever makes sense in this case
const vinylSchema = new Schema(
  {
    artist: {
      type: String,
      required: [true, 'Artist is required.'],
      trim: true,
    },
    album: {
      type: String,
      required: [true, 'Album is required.'],
      trim: true,
    },
    types: {
      type: String,
      enum: ["Jazz, Rock, Electronic, Hip-hop, Funk" ],
    },
    years: {
      type: Date,
      
    },
    condition: {
      type: String,
      enum: ["Mint, Very_good, Fair" ],
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
  }
)

const Vinyl = model('Vinyl', vinylSchema)

module.exports = Vinyl
