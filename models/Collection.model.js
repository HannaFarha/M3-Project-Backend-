const {mongoose, Schema, model } = require('mongoose')

// TODO: Please make sure you edit the Vinyl model to whatever makes sense in this case
const Collection = new Schema(
  {
    
    user:{
      type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    },
    vinyl:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      },
    
  },
  
)

const Collections = model('Collection', Collection)

module.exports = Collections
