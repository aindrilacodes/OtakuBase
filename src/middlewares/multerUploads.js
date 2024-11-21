import multer from "multer";
import path from "path"
const allowedFormats = ["jpg", "jpeg", "png"];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const originalName = file.originalname
      cb(null, `${timestamp}_${originalName}`); 
    }
  })
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log(ext);
    
    if (allowedFormats.includes(ext.substring(1))) {
      cb(null, true); 
    } else {
      cb(new Error("Unsupported file format! Only JPEG, PNG, and JPG are allowed."), false);
    }
  };
  const limits = {
    fileSize: 2 * 1024 * 1024, // 2 MB
  };
  export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
  })