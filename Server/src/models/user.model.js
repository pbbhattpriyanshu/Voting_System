import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true
        },
        age: {
            type: Number, required: true
        },
        email: {
            type: String, unique: true, required: true
        },
        phone: {
            type: String
        },
        address: {
            type: String, required: true
        },
        adharNumber: {
            type: Number, unique: true, required: true
        },
        password: {
            type: String, required: true
        },
        role: {
            type: String, enum: [
                "admin", "voter"], default: "voter"
        },
        isVoted: {
            type: Boolean, default: false
        },
    },
    { timestamps: true }
);



//Hashes a plain text password using bcrypt with a salt round of 10 - Signup
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


//compare password with hashed password - Login
userSchema.methods.comparePassword = async function(password) {
    const isPasswordCorrect = await bcrypt.compare(password, this.password);
    return isPasswordCorrect;
};


const User = mongoose.model("User", userSchema);
export default User;
