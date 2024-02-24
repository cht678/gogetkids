import mongoose from "mongoose";

const userSchoolSchema = mongoose.Schema({
    school_name: {
        type: String,
        required: true,
        unique: true,
        default: '',
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
    },
    postalcode: {
        type: Number,
        required: [true, "Please provide a postal code"],
    },
});

const UserSchool = mongoose.models.schoolUsers || mongoose.model("schools", userSchoolSchema);

export default UserSchool;
