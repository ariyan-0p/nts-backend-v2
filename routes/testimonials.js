const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Testimonial = require('../models/Testimonial');

// 1. CONFIGURE STORAGE TO PROFESSIONAL PATH
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/var/www/media/testimonials';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB Limit
});

// GET ALL
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json({ success: true, data: testimonials });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE NEW
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { name, role, type, content, rating, result } = req.body;
        
        let finalContent = content;
        if (req.file) {
            // Save as /media/testimonials/filename.mp4 for Nginx to serve
            finalContent = `/media/testimonials/${req.file.filename}`;
        }

        const newTestimonial = new Testimonial({
            name, role, type, rating, result,
            content: finalContent,
            published: false
        });

        await newTestimonial.save();
        res.status(201).json({ success: true, data: newTestimonial });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.id);
        if (!testimonial) return res.status(404).json({ message: "Not found" });

        // Clean up file from disk
        if (testimonial.type !== 'text' && testimonial.content.startsWith('/media')) {
            const filePath = path.join('/var/www', testimonial.content);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;