
// routes/companies.route.js
import express from "express";
import { ObjectId } from "mongodb";
import { companiesCollection } from "../lib/connectDB.js";

const router = express.Router();

// ==== get all companies =====
router.get("/", async (req, res) => {
  try {
    const companies = await companiesCollection.find({}).toArray();
    res.send(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch companies.",
    });
  }
});

// ==== get company by ID =====
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid company ID." });
  }

  try {
    const company = await companiesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!company) {
      return res.status(404).send({
        success: false,
        message: "Company not found.",
      });
    }

    res.send(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch company.",
    });
  }
});

// ==== post company =====
router.post("/", async (req, res) => {
  const newCompany = req.body;

  try {
    const result = await companiesCollection.insertOne(newCompany);

    res.status(201).send({
      success: true,
      message: "Company created successfully.",
      company: { _id: result.insertedId, ...newCompany },
    });

    console.log("New company created:", newCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create company.",
    });
  }
});

// ==== patch company =====
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid company ID." });
  }

  try {
    const result = await companiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Company not found.",
      });
    }

    res.send({
      success: true,
      message: "Company updated successfully.",
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update company.",
    });
  }
});

// ==== delete company =====
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid company ID." });
  }

  try {
    const result = await companiesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Company not found.",
      });
    }

    res.send({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).send({
      success: false,
      message: "Failed to delete company.",
    });
  }
});

export default router;
