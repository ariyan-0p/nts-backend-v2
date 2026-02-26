const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Testimonial = require('../models/Testimonial');

// NEW STORAGE CONFIG: Points to the dedicated media folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/www/media/testimonials'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// POST: Add Testimonial
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { type, name, role, text, result, rating } = req.body;
    
    // Updated path for the database entry
    const content = req.file ? `/media/testimonials/${req.file.filename}` : text;

    const newTestimonial = new Testimonial({
      type, name, role, content, result, rating: Number(rating),
      published: true 
    });

    await newTestimonial.save();
    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: All Testimonials
router.get('/', async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// DELETE: Real-time removal from New Path
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    // UPDATED DELETE LOGIC: Looks in the new /var/www/media folder
    if (testimonial.type !== 'text' && testimonial.content.startsWith('/media')) {
      const filePath = path.join('/var/www', testimonial.content);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      }
    }

    await testimonial.deleteOne();
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed on server' });
  }
});

module.exports = router;