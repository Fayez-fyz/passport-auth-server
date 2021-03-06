import mongoose from "mongoose";
import { Schema } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
      
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
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    verified: {
        type: Boolean,
        default: false,
      },
      googleId: {
        required: false,
        type: String
    },
    facebookId: {
        required: false,
        type: String
    },
    githubId: {
        required: false,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", UserSchema);
