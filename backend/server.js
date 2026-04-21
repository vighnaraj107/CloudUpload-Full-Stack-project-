const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");
const app = express();


app.use(cors({
  origin: "*", // allow all (for now)
  methods: ["GET", "POST", "DELETE"],
}));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});



// ================= AWS CONFIG =================
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "eu-north-1",
});
const s3 = new AWS.S3();

// ================= MULTER CONFIG =================
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ================= UPLOAD API =================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const params = {
      Bucket: "vighnaraj-cloud-file-upload", // your bucket
      Key: Date.now() + "-" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    res.json({
      message: "File uploaded successfully",
      file: data.Location,
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

// ================= GET FILES API =================
app.get("/files", async (req, res) => {
  try {
    const params = {
      Bucket: "vighnaraj-cloud-file-upload",
    };

    const data = await s3.listObjectsV2(params).promise();

    // ✅ SAFE FIX
    const files = (data.Contents || []).map((item) => ({
      name: item.Key,
      url: `https://vighnaraj-cloud-file-upload.s3.amazonaws.com/${item.Key}`,
    }));

    res.json(files);

  } catch (err) {
    console.error("FULL ERROR:", JSON.stringify(err, null, 2));
    res.status(500).json([]);
  }
});

// ================= DELETE API =================
app.delete("/delete/:filename", async (req, res) => {
  try {
    const fileName = decodeURIComponent(req.params.filename);

    console.log("Deleting file:", fileName);

    const params = {
      Bucket: "vighnaraj-cloud-file-upload",
      Key: fileName,
    };

    await s3.deleteObject(params).promise();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});