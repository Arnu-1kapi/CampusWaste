const mongoose = require("mongoose");

const wasteBinSchema = new mongoose.Schema({
       binCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
   
    binName: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    wasteType: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Available"
    },

    capacity: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("WasteBin", wasteBinSchema, "wasteBins");