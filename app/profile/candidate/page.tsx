"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Upload, ExternalLink, Github, Linkedin, UploadCloud } from "lucide-react";
import updateCandidateProfile from "./actions";
import { useProfileData } from "./hooks";

export default function CandidateProfilePage() {
  const { profileData, setProfileData, completionPercentage } = useProfileData('64e9b2f1c2a4f1e5b8a1d2c3');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    setProfileCompletion(completionPercentage);
  }, [completionPercentage]);

  useEffect(() => {
    setEditName(profileData.name || "");
    setEditTagline(profileData.tagline || "");
    setEditSummary(profileData.summary || "");
  }, [profileData.name, profileData.tagline, profileData.summary]);

  const handleSaveProfile = async() => {
    const updatedData = {
      ...profileData,
      summary: editSummary,
      name: editName,
      tagline: editTagline
    };
    setProfileData(updatedData);
    setIsEditDialogOpen(false);
    console.log("Sending updated data to backend:", updatedData);
    const res = await updateCandidateProfile(updatedData);
    console.log("Backend response:", res);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // Handle file upload logic here
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      console.log("File dropped:", files[0].name);
      // Handle file drop logic here
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    }));
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, { year: "", degree: "", institution: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project))
    }));
  };

  const addProject = () => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", link: "" }]
    }));
  };

  const removeProject = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateCertificate = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
    }));
  };

  const addCertificate = () => {
    setProfileData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { name: "", issuer: "", link: "" }]
    }));
  };

  const removeCertificate = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (key: "linkedin" | "github", value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  };

  const handleUpdateProfile = async () => {
    console.log("Sending data to backend:", profileData); // Debug log
    const res = await updateCandidateProfile(profileData);
    console.log("Backend response:", res);
    setIsUpdateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A18] to-[#0D0D20]">
      <div className="max-w-7xl mx-auto pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
              Profile
            </h1>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* First Column - 1/3 width */}
              <div className="lg:col-span-1 space-y-6">
                {/* Info Section - Vertical Layout */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Profile Avatar */}
                    <div className="relative">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src="/api/placeholder/128/128" />
                        <AvatarFallback className="bg-violet-600 text-white text-4xl">
                          {profileData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 border-none"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Name */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{profileData.name}</h2>
                      <p className="text-white/70 text-lg">{profileData.tagline}</p>
                    </div>

                    {/* Edit Button */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="hover:bg-white/10 hover:text-white">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0D0D20] border-white/20 text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Edit Profile Information</DialogTitle>
                          <DialogDescription className="text-white/70">
                            Update your name and tagline.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Name</Label>
                            <Input
                              id="name"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tagline" className="text-white">Tagline</Label>
                            <Textarea
                              id="tagline"
                              value={editTagline}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditTagline(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                              placeholder="Enter your professional tagline"
                            />
                            <div className="space-y-2">
                              <Label htmlFor="summary">Summary</Label>
                              <Textarea
                                id="summary"
                                value={editSummary}
                                onChange={(e) => setEditSummary(e.target.value)}
                                placeholder="Briefly describe your professional background and skills"
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="destructive"
                              onClick={() => setIsEditDialogOpen(false)}
                              className="bg-red-800 hover:bg-red-900"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveProfile}
                              className="bg-white text-[#0A0A18] hover:bg-white/90 border-none"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Summary</h3>
                  <p className="text-white/80 leading-relaxed">{profileData.summary}</p>
                </div>
              </div>

              {/* Second Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Note Section with Progress */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        {/* Circular Progress Bar */}
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/20"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - profileCompletion / 100)}`}
                            className="text-violet-500 transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{profileCompletion}%</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Complete your profile now</h3>
                        <p className="text-white/70">Your profile is {profileCompletion}% complete</p>
                      </div>
                    </div>

                    <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-white/80 text-[#0A0A18] hover:bg-white/70 border-none">
                          Update Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0D0D20] border-white/20 text-white w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className=" bg-[#0D0D20] z-10 pb-4">
                          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <DialogTitle className="text-white">Update Your Profile</DialogTitle>
                            <DialogDescription className="text-white/70">
                              Complete your profile information or upload your resume.
                            </DialogDescription>
                          </div>
                        </DialogHeader>

                        <Tabs defaultValue="form" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/10 top-16 z-10">
                            <TabsTrigger
                              value="form"
                              className="data-[state=active]:bg-white/80 data-[state=active]:text-[#0A0A18] text-white"
                            >
                              Form
                            </TabsTrigger>
                            <TabsTrigger
                              value="resume"
                              className="data-[state=active]:bg-white/80 data-[state=active]:text-[#0A0A18] text-white"
                            >
                              Resume
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="form" className="space-y-4 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="workDetails" className="text-white">Work Details</Label>
                                <Textarea
                                  id="workDetails"
                                  value={profileData.workDetails}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, workDetails: e.target.value }))}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                  placeholder="Describe your work experience..."
                                  rows={4}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="skills" className="text-white">Skills</Label>
                                <Textarea
                                  id="skills"
                                  value={profileData.skills}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                  placeholder="List your skills..."
                                  rows={4}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="education" className="text-white">Education</Label>
                              <div className="space-y-3">
                                {profileData.education.map((edu, index) => (
                                  <div key={index} className="flex items-start gap-4">
                                    <div className="w-16 text-sm text-white/60 font-medium">{edu.year}</div>
                                    <div className="flex-1 space-y-1">
                                      <Input
                                        type="text"
                                        value={edu.year}
                                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Year"
                                      />
                                      <Input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Degree"
                                      />
                                      <Input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Institution"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeEducation(index)}
                                      className="text-red-500 hover:text-red-400"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  onClick={addEducation}
                                  className="w-full text-black"
                                >
                                  Add Education
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="projects" className="text-white">Projects</Label>
                              <div className="space-y-3">
                                {profileData.projects.map((project, index) => (
                                  <div key={index} className="border border-white/10 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 space-y-1">
                                        <Input
                                          type="text"
                                          value={project.name}
                                          onChange={(e) => updateProject(index, "name", e.target.value)}
                                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                          placeholder="Project Name"
                                        />
                                        <Textarea
                                          value={project.description}
                                          onChange={(e) => updateProject(index, "description", e.target.value)}
                                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                          placeholder="Project Description"
                                          rows={2}
                                        />
                                        <Input
                                          type="text"
                                          value={project.link}
                                          onChange={(e) => updateProject(index, "link", e.target.value)}
                                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                          placeholder="Project Link"
                                        />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProject(index)}
                                        className="text-red-500 hover:text-red-400"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  onClick={addProject}
                                  className="w-full text-black"
                                >
                                  Add Project
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="certificates" className="text-white">Certificates</Label>
                              <div className="space-y-3">
                                {profileData.certificates.map((cert, index) => (
                                  <div key={index} className="flex items-start justify-between border border-white/10 rounded-lg p-4">
                                    <div className="flex-1 space-y-1">
                                      <Input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertificate(index, "name", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Certificate Name"
                                      />
                                      <Input
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) => updateCertificate(index, "issuer", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Issuer"
                                      />
                                      <Input
                                        type="text"
                                        value={cert.link}
                                        onChange={(e) => updateCertificate(index, "link", e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        placeholder="Certificate Link"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCertificate(index)}
                                      className="text-red-500 hover:text-red-400"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  onClick={addCertificate}
                                  className="w-full text-black"
                                >
                                  Add Certificate
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
                              <Input
                                type="text"
                                value={profileData.socialLinks.linkedin}
                                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                placeholder="https://linkedin.com/in/your-profile"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="github" className="text-white">GitHub</Label>
                              <Input
                                type="text"
                                value={profileData.socialLinks.github}
                                onChange={(e) => updateSocialLink("github", e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                placeholder="https://github.com/your-profile"
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                variant="destructive"
                                onClick={() => setIsUpdateDialogOpen(false)}
                                className="bg-red-800 hover:bg-red-900"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdateProfile}
                                className="bg-white/80 text-[#0A0A18] hover:bg-white/70 border-none"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </TabsContent>

                          <TabsContent value="resume" className="mt-6">
                            <div className="space-y-4">
                              <div
                                className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('resume-upload')?.click()}
                              >
                                <UploadCloud className="w-12 h-12 text-white/60 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Upload your resume</h3>
                                <p className="text-white/70 mb-4">
                                  Drag and drop your resume here, or click to browse
                                </p>
                                <p className="text-sm text-white/60 font-medium">
                                  Calibr AI will automatically extract info
                                </p>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  id="resume-upload"
                                />
                              </div>

                              <div className="flex justify-end gap-3 pt-4">
                                <Button
                                  variant="destructive"
                                  onClick={() => setIsUpdateDialogOpen(false)}
                                  className=""
                                >
                                  Cancel
                                </Button>
                                <Button className="bg-white/80 text-[#0A0A18] hover:bg-white/70 border-none">
                                  Upload Resume
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>

                  <div className="space-y-8">
                    {/* Work Details */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Work Details</h4>
                      <p className="text-white/80">{profileData.workDetails}</p>
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Education</h4>
                      <div className="space-y-3">
                        {profileData.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-16 text-sm text-white/60 font-medium">{edu.year}</div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{edu.degree}</p>
                              <p className="text-white/70">{edu.institution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Skills</h4>
                      <p className="text-white/80">{profileData.skills}</p>
                    </div>

                    {/* Projects */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Projects</h4>
                      <div className="space-y-3">
                        {profileData.projects.map((project, index) => (
                          <div key={index} className="border border-white/10 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-white font-medium">{project.name}</h5>
                                <p className="text-white/70 mt-1">{project.description}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white" asChild>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificates */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Certificates</h4>
                      <div className="space-y-3">
                        {profileData.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between border border-white/10 rounded-lg p-4">
                            <div>
                              <h5 className="text-white font-medium">{cert.name}</h5>
                              <p className="text-white/70">{cert.issuer}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white" asChild>
                              <a href={cert.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Social Links</h4>
                      <div className="flex gap-4">
                        <Button variant="link" className="text-white" asChild>
                          <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                        <Button variant="link" className="text-white" asChild>
                          <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}