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
        const candidate = await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }

        //find user id
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        //User is already voted
        if(user.isVoted){
            return res.status(400).json({message: 'You have already voted'})
        }

        //User is admin
        if(user.role == 'admin'){
            return res.status(403).json({message: "Admin can't be vote"})
        }

        //Update the candidate document
        candidate.votes.push({user: userId});
        candidate.voteCount++;  
        await candidate.save();

        //Update the user documents
        user.isVoted  = true;
        await user.save();

        return res.status(200).json({sucess: true, message: 'Vote recorded Sucessfully'})
    } catch(error){
        console.error("Error in voteToCandidate controller", error);
        res.status(500).json({ message: "Server error" });
    }
}

//Vote Count
export const getVoteCount = async(req, res) => {
    try {
        //find all candidates and sort by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidates to include only their name and voteCount
        const voteRecord = candidate.map((data) => {
            return {name: data.party, voteCount: data.voteCount};
        })
        return res.status(200).json({candidates: voteRecord});
    } catch (error) {
        console.error("Error in getVoteCount controller", error);
        res.status(500).json({ message: "Server error" });
    }
}