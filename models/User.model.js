const { mongoose,Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    // wishlist: {
    //   type: mongoose.Schema.Types.ObjectId,
    // ref: "vinyl",
    // },
  },
  
);

const User = model("User", userSchema);

module.exports = User;

