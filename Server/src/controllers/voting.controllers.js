import Candidate from "../models/candidates.model.js";
import User from "../models/user.model.js";

// Let's start voting
export const voteToCandidate = async (req, res) => {
    //admin can't be vote
    //user/voter only vote once
    const candidateId = req.params.candidateId;
    const userId = req.user;

    try {
        //find candidate by id
        
    }


}