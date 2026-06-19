const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require("../middleware/auth");
const recruiterOnly = require("../middleware/recruiter");

router.get('/',async(req,res)=>{
  try{
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  }
  catch(error){
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/",auth,recruiterOnly,async(req,res)=>{
  const {title,company,location,description,skillsRequired,jobType,experienceLevel,lastDate} = req.body;
  if(!title || !company || !location || !description || !skillsRequired || skillsRequired.length===0 || !jobType || !experienceLevel || !lastDate)
    return res.status(400).json({ msg: "All fields are required" });

  try{
    let job = new Job({ title,company,location,description,skillsRequired,jobType,experienceLevel,lastDate });
    await job.save();
    return res.status(201).json({ msg: 'Job created successfully', job });
  }catch(error){
    return res.status(500).json({ msg: 'Server error while creating job', error: error.message });
  }
});

router.put("/:id",auth,recruiterOnly,async(req,res)=>{
  try{
    let job = await Job.findById(req.params.id);
    if(!job)
      return res.status(404).json({ msg:'Job not found' });

    const {title,company,location,description,skillsRequired,jobType,experienceLevel,lastDate} = req.body;
    if(!title || !company || !location || !description || !skillsRequired || skillsRequired.length===0 || !jobType || !experienceLevel || !lastDate)
      return res.status(400).json({ msg: "All fields are required" });

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {title,company,location,description,skillsRequired,jobType,experienceLevel,lastDate},
      { new:true, runValidators:true }
    );

    return res.status(200).json({ msg:'Job updated successfully', job:updatedJob });

  }catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:"Job not found" });
    }
    return res.status(500).json({ msg:'Server error while updating job', error:error.message });
  }
});

router.get("/:id",async(req,res)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job)
      return res.status(404).json({ msg:'Job not found' });

    return res.status(200).json(job);
  }catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:'Job not found' });
    }
    return res.status(500).json({ msg:'Server error while trying to fetch', error:error.message });
  }
});

router.delete("/:id",auth,recruiterOnly,async(req,res)=>{
  try{
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if(!deletedJob){
      return res.status(404).json({ msg:"Job not found" });
    }

    return res.status(200).json({ msg:"Successfully deleted" });

  }catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:"Job not found" });
    }
    return res.status(500).json({ msg:"Server error while deleting" });
  }
});

module.exports = router;