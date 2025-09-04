const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profileimages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const filefilter = (req, file, cb) => {
  if (!file) {
    cb(null, true);
  } else {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
      //here true means file should be allowed to be upload
    } else {
      cb(new Error("File Type Must Be Png Or Jpeg"), false);
    }
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = upload;
