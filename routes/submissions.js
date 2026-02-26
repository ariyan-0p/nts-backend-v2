const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// 1. POST: Save a new lead (Course Enrollment OR Homepage Form)
router.post('/', async (req, res) => {
  try {
    const newSubmission = new Submission(req.body);
    const savedSubmission = await newSubmission.save();
    res.status(201).json({ success: true, data: savedSubmission });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(400).json({ success: false, message: 'Failed to save submission', error: error.message });
  }
});

// 2. GET: Fetch leads with filtering for Tabs (Course OR Source)
router.get('/', async (req, res) => {
  try {
    const { course, source } = req.query; 
    const filter = {}; 
    
    if (course) filter.course = course;
    if (source) filter.source = source;

    const submissions = await Submission.find(filter).sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. PATCH: Update Lead Status (Saves your "Contacted/Converted" changes)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Returns the updated document
    );

    if (!updatedSubmission) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: updatedSubmission });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// 4. DELETE: Permanently remove a lead from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);

    if (!deletedSubmission) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, message: 'Lead permanently deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, message: 'Server error during deletion' });
  }
});

module.exports = router;