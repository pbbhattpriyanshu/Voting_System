import { validationResult } from "express-validator";
import Candidate from "../models/candidates.model.js";
import User from "../models/user.model.js";

//Check Admin Role
const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === "admin";
    } catch (error) {
        console.error("Error in checkAdminRole", error);
        return false;
    }
};

//Post Route to refister a new candidate
export const registerCandidate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!(await checkAdminRole(req.user))) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        //Extract Candidate Details from request body
        const { name, age, party, symbolPic, isApproved } = req.body;

        //Basic Validation
        if (!name || !age || !party || !symbolPic) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Create new Candidate
        const newCandidate = new Candidate({
            name,
            age,
            party,
            symbolPic,
            isApproved,
        });
        await newCandidate.save();

        console.log("Candidate is Created Sucessfully");
        return res
            .status(201)
            .json({
                success: true,
                message: "Candidate registered successfully",
                candidate: newCandidate,
            });
    } catch (error) {
        console.error("Error in registerCandidate controller", error);
        res.status(500).json({ message: "Server error" });
    }
};

//PUT Route to update candidate details
export const updateCandidate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!(await checkAdminRole(req.user))) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const candidateId = req.params.id;
        const updates = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            candidateId,
            updates,
            { new: true }
        );

        if (!updatedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        console.log("Candidate is Updated Sucessfully");
        return res
            .status(200)
            .json({
                success: true,
                message: "Candidate updated successfully",
                candidate: updatedCandidate,
            });
    } catch (error) {
        console.error("Error in updateCandidate controller", error);
        res.status(500).json({ message: "Server error" });
    }
};

//DELETE Route to delete a candidate
export const deleteCandidate = async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user))) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        const candidateId = req.params.id;
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate is Deleted Sucessfully");
        return res
            .status(200)
            .json({
                success: true,
                message: "Candidate deleted successfully",
            });
    } catch (error) {
        console.error("Error in deleteCandidate controller", error);
        res.status(500).json({ message: "Server error" });
    }
};