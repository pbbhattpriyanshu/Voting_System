import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String, required: true
        },
        age: {
            type: Number, required: true
        },
        party: {
            type: String, required: true
        },
        symbolPic: {
            type: String, required: true
        },
        isApproved: {
            type: Boolean, default: false, required: true
        },
        votes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                votedAt: { 
                    type: Date, 
                    default: Date.now 
                }
            }
        ],
        voteCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);



const Candidate = mongoose.model("Candidate", candidateSchema );
export default Candidate;