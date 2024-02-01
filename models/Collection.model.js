const {mongoose, Schema, model } = require('mongoose')


const Collection = new Schema(
  {
    
    user:{
      type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
    vinyl:[{
        type: mongoose.Schema.Types.ObjectId,
      ref: "Vinyl",
      }],
    
  },
  
)

const Collections = model('Collection', Collection)

module.exports = Collections
