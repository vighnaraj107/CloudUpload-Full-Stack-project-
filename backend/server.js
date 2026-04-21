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

// ================= AWS CONFIG =================
AWS.config.update({
  accessKeyId: "KIAXML6424LPYN25JEO",
  secretAccessKey: "gcnMgoww+pKZ1Jgs8mnZczrp//bMbYVMJHqEh6Dn",
  region: "ap-south-1", // change if needed
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

    const files = data.Contents.map((item) => ({
      name: item.Key,
      url: `https://vighnaraj-cloud-file-upload.s3.amazonaws.com/${item.Key}`,
    }));

    res.json(files);

  } catch (err) {
    res.status(500).send(err);
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
app.listen(3000, () => {
  console.log("Server running on port 3000");
});