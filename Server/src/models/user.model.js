import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true
        },
        age: {
            type: Number, required: true
        },
        email: {
            type: String, unique: true
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



const User = mongoose.model("User", userSchema);
export default User;
