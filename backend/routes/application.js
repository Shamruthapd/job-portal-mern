const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require("../middleware/auth");
const recruiterOnly = require("../middleware/recruiter");
const jobseekerOnly = require("../middleware/jobseeker");

router.post("/:jobId",auth,jobseekerOnly,async(req,res)=>{
  try{
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if(!job){
      return res.status(404).json({ msg:"Job not found" });
    }

    const existingApplication = await Application.findOne({ userId,jobId });
    if(existingApplication){
      return res.status(400).json({ msg:"You have already applied for this job" });
    }

    const application = new Application({ userId,jobId,status:"Applied" });
    await application.save();

    return res.status(201).json({ msg:"Successfully Applied",application });
  }catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:"Job not found" });
    }
    return res.status(500).json({ msg:"Server error while applying for the job",error:error.message });
  }
});

router.get("/my",auth,jobseekerOnly,async(req,res)=>{
  try{
    const userId = req.user.id;
    const applications = await Application.find({ userId }).populate("jobId").sort({ createdAt:-1 });
    res.status(200).json(applications);
  }
  catch(error){
    res.status(500).json({ postMessage:"Server error",error:error.message });
  }
});

router.get("/job/:jobId",auth,recruiterOnly,async(req,res)=>{
  try{
    const jobId = req.params.jobId;
    const applications = await Application.find({ jobId }).populate("userId","name email").sort({ createdAt:-1 });
    res.status(200).json(applications);
  }
  catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:"Job not found" });
    }
    res.status(500).json({ postMessage:"Server error",error:error.message });
  }
});

router.put("/:applicationId",auth,recruiterOnly,async(req,res)=>{
  try{
    const { status } = req.body;

    if(!status){
      return res.status(400).json({ msg:"Status is required" });
    }

    const validStatuses = ["Applied","Shortlisted","Rejected","Selected"];

    if(!validStatuses.includes(status)){
      return res.status(400).json({ msg:"Invalid status" });
    }

    const application = await Application.findById(req.params.applicationId);

    if(!application){
      return res.status(404).json({ msg:"Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ msg:"Application status updated successfully",application });
  }catch(error){
    if(error.name==="CastError"){
      return res.status(404).json({ msg:"Application not found" });
    }
    return res.status(500).json({ msg:"Server error while updating application status",error:error.message });
  }
});

module.exports = router;