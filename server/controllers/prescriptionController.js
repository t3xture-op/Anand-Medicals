import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

//add prescription
export async function addPrescription(req, res) {
  try {
    const { doctorName, doctorSpecialization, medicines, notes } = req.body;
    const userId = req.user._id;

    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ message: "Prescription image is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPrescription = new Prescription({
      user: userId,
      image: req.file.path,
      doctorName,
      doctorSpecialization,
      medicines: medicines ? JSON.parse(medicines) : [],
      notes,
    });

    const saved = await newPrescription.save();

    await Notification.create({
      title: "New Prescription Uploaded",
      message: `A new prescription was uploaded by ${req.user.name}.`,
      type: "prescription",
      targetId: saved._id, // <- required field
    });

    res
      .status(201)
      .json({ message: "Prescription uploaded successfully", data: saved });
  } catch (error) {
    console.error("Error uploading prescription:", error.message);
    res.status(500).json({
      message: "Failed to upload prescription",
      error: error.message,
    });
  }
}

//get all presciption

export async function getAllPrescriptions(req, res) {
  try {
    // Ensure req.user exists
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find()
      .populate("user", "name email")
      .populate("reviewedBy", "name email");

    const formatted = prescriptions.map((p) => ({
      id: p._id,
      userName: p.user?.name || "Unknown",
      image: p.image,
      orderId: p._id.toString().slice(-6),
      status: p.status,
      reviewDate: p.createdAt,
      notes: p.reviewNotes || "",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch prescriptions", error: error.message });
  }
}

//get prescription by id
export const getPrescriptionById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescription = await Prescription.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json(prescription);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching prescription", error: err.message });
  }
};

//review prescription
export async function reviewPrescription(req, res) {
  try {
    const { status, notes } = req.body;
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = status;
    prescription.notes = notes;
    prescription.reviewedBy = req.userId;

    await prescription.save();
    res.status(200).json({ message: `Prescription ${status}`, prescription });
  } catch (error) {
    res.status(500).json({
      message: "Error reviewing prescription",
      error: error.message,
    });
  }
}
