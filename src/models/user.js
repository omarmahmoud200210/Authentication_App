import mongoose from "mongoose";
const { Schema } = mongoose;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("Users", User);

export { UserSchema };
