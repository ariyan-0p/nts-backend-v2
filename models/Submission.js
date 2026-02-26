const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // ── LEAD SOURCE & ROUTING ──
  source: { type: String }, // e.g., 'homepage-contact' (helps you filter leads later)
  course: { 
    type: String, 
    // Removed 'required: true' so the homepage contact form doesn't crash
    // Added 'sales-mastery' to match your updated frontend component
    enum: ['nail-the-sale', 'corporate-training', 'fmp-program', 'sales-mastery'] 
  },
  
  // ── PERSONAL & IDENTITY (Common) ──
  // We include both 'fullName' (courses) and 'name' (contact form) to match your frontend
  fullName: { type: String }, 
  name: { type: String }, 
  
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // ── COURSE SPECIFIC FIELDS ──
  dateOfBirth: { type: String }, 
  currentCompany: { type: String },
  currentDesignation: { type: String }, 
  helpNeeded: { type: String },
  
  // ── SOCIAL & PORTFOLIO LINKS (Course Specific) ──
  instagramId: { type: String },
  linkedinUrl: { type: String },
  portfolioUrl: { type: String }, 

  // ── HOMEPAGE CONTACT SPECIFIC FIELDS ──
  interest: { type: String }, // e.g., '1on1', 'corporate', 'bootcamp'
  message: { type: String },
  
  // ── PIPELINE MANAGEMENT ──
  status: { 
    type: String, 
    default: 'new',
    enum: ['new', 'contacted', 'converted', 'closed']
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Submission', submissionSchema);