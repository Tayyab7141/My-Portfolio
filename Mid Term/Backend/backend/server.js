const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ Ensure fetch is imported
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Job-List', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  fetchAndStoreJobs(); // ✅ Run only after successful connection
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// 🔹 Job Schema & Model
const jobSchema = new mongoose.Schema({
    _id: { type: String, required: true },
  title: String,
  company: String,
  description: String,
  requirements: String,
  apply_link: String,
  logo: String,
},
  { _id: false });

const Job = mongoose.model('Job', jobSchema);

// 🔹 Function to Fetch & Store Jobs in MongoDB
const fetchAndStoreJobs = async () => {
  try {
    const response = await fetch('https://jsonfakery.com/jobs'); // 🔹 API URL
    const jobs = await response.json();

    for (const job of jobs) {
      const existingJob = await Job.findOne({ title: job.title, company: job.company });
      if (!existingJob) {
        await Job.create(job);
      }
    }

    console.log('✅ Jobs fetched & stored in MongoDB!');
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
  }
};

// 🔹 API to Get Stored Jobs for React Native App
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: '❌ Error fetching jobs from MongoDB' });
  }
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
