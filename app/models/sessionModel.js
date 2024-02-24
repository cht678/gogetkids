import mongoose from "mongoose";

// Define the session schema
const sessionSchema = new mongoose.Schema({
    sessionName: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
});

// Create the Session model
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
