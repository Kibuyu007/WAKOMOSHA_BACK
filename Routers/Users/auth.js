import express from "express";
import multer from "multer"; 
import { login, logout, registerUser } from "../../Controlers/Users/auth.js";

const router = express.Router()

// Multer Storage Configuration (File Upload)
const storage = multer.diskStorage({
    destination: "./images",
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post("/register", upload.single("file"),registerUser);
router.post('/login',login)
router.get('/logout',logout)

export default router