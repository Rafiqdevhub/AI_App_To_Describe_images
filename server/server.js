const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());
const port = 5000;

const dir = path.join(__dirname, "images");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GEMINI_API);

    const uploadResult = await fileManager.uploadFile(
      `./images/` + req.file.filename,
      {
        mimeType: req.file.mimetype,
        displayName: req.file.originalname,
      }
    );
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([
      "Tell me about this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    console.log(result.response.text());
    res.send(result.response.text());
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error("Multer Error:", error.field);
    return res.status(400).send(`Multer Error: ${error.message}`);
  }
  next(error);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
