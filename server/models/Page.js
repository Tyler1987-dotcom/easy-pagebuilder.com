const mongoose = require('mongoose');

// Define the schema
const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true }, // This field is required
    phoneNumber: { type: String, required: false }, // No regex validation here
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create and export the model
const Page = mongoose.model('Page', PageSchema);
module.exports = Page;
