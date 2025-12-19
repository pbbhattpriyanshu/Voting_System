import Candidate from "../models/candidates.model.js";
import User from "../models/user.model.js";


//Show list of all Candidates
export const showCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().select("name party");
    return res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("Error in showCandidates controller", error);
    res.status(500).json({ message: "Server error" });
  };
}


// Vote for a candidate
export const voteToCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admin can't vote
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot vote" });
    }

    // User already voted
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Record vote
    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;
    await candidate.save();

    // Update user
    user.isVoted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
    });
  } catch (error) {
    console.error("Error in voteToCandidate controller", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//Vote Count
export const getVoteCount = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .select("name party voteCount")
      .sort({ voteCount: -1 });

    return res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("Error in getVoteCount controller", error);
    res.status(500).json({ message: "Server error" });
  }
};
