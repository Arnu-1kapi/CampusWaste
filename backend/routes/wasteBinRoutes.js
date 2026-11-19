const express = require("express");
const router = express.Router();

const WasteBin = require("../models/wasteBin");

// CREATE: Register a waste bin
router.post("/", async (req, res) => {
    try {
        const bin = new WasteBin(req.body);
        await bin.save();

        res.status(201).json(bin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ: Get all waste bins
router.get("/", async (req, res) => {
    try {
        const bins = await WasteBin.find();
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Edit a waste bin
router.put("/:id", async (req, res) => {
    try {
        const bin = await WasteBin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json(bin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Remove a waste bin
router.delete("/:id", async (req, res) => {
    try {
        const bin = await WasteBin.findByIdAndDelete(req.params.id);

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json({ message: "Waste bin deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// READ: Get one waste bin by its Bin Code
router.get("/code/:binCode", async (req, res) => {
    try {
        const bin = await WasteBin.findOne({
            binCode: req.params.binCode
        });

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json(bin);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
// READ: Get one waste bin by MongoDB ID
router.get("/:id", async (req, res) => {
    try {
        const bin = await WasteBin.findById(req.params.id);

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json(bin);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
// UPDATE: Edit a waste bin using its Bin Code
router.put("/code/:binCode", async (req, res) => {
    try {
        const { binCode, ...updatedDetails } = req.body;

const bin = await WasteBin.findOneAndUpdate(
    { binCode: req.params.binCode },
    { $set: updatedDetails },
    { new: true, runValidators: true }
);

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json(bin);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
// DELETE: Remove a waste bin using its Bin Code
router.delete("/code/:binCode", async (req, res) => {
    try {
        const bin = await WasteBin.findOneAndDelete({
            binCode: req.params.binCode
        });

        if (!bin) {
            return res.status(404).json({
                message: "Waste bin not found"
            });
        }

        res.json({
            message: "Waste bin deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
module.exports = router;
