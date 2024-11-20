import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKENEXPIRY, TOKENSECRETKEY } from "../../envAccess.js"
const userSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User"
    },
    reviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }]
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.passwordValidityCheck = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
  };
userSchema.methods.generateUserAccessToken = async function () {
 const token= jwt.sign(
    {
      email: this.email,
    },
    TOKENSECRETKEY,
    { expiresIn: TOKENEXPIRY }
  );
  return token;
};
const User= mongoose.model("User", userSchema);

export default User;
