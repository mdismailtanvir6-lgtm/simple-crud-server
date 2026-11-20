
// routes/jobs.route.js
import express from "express";
import { ObjectId } from "mongodb";
import { jobsCollection } from "../lib/connectDB.js";

const router = express.Router();

// ==== get all jobs =====
router.get("/", async (req, res) => {
  try {
    const jobs = await jobsCollection.find({}).toArray();
    res.send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ success: false, message: "Failed to fetch jobs." });
  }
});

// ==== get job by ID =====
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid job ID." });
  }

  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

    if (!job) {
      return res.status(404).send({ success: false, message: "Job not found." });
    }

    res.send(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send({ success: false, message: "Failed to fetch job." });
  }
});

// ==== post job =====
router.post("/", async (req, res) => {
  const newJob = req.body;

  try {
    const result = await jobsCollection.insertOne(newJob);

    res.status(201).send({
      success: true,
      message: "Job created successfully.",
      job: { _id: result.insertedId, ...newJob },
    });

    console.log("New job created:", newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).send({ success: false, message: "Failed to create job." });
  }
});

// ==== patch job =====
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid job ID." });
  }

  try {
    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Job not found." });
    }

    res.send({ success: true, message: "Job updated successfully." });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send({ success: false, message: "Failed to update job." });
  }
});

// ==== delete job =====
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid job ID." });
  }

  try {
    const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Job not found." });
    }

    res.send({ success: true, message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send({ success: false, message: "Failed to delete job." });
  }
});

export default router;
