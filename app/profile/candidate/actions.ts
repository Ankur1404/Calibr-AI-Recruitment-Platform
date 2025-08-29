"use server"

import { connectToDatabase } from "@/utils/connectDb";
import Profile from "@/models/profile.model";
import candidate from "@/models/candidate.model";
import { ProfileData, ProfileResponse } from "./type";

const candidateId = '64e9b2f1c2a4f1e5b8a1d2c3';
export default async function updateCandidateProfile(profileData: ProfileData): Promise<{ success: boolean; message: string }> {
  // Logic to update candidate profile
  await connectToDatabase();
  try {
    // console.log("Backend received data:", profileData);
    let name: any = await candidate.findById(candidateId).select('firstName lastName');
    name = name?.firstName + " " + name?.lastName;
    const data = { ...profileData, candidate: candidateId, name };

    // await Profile.create(data);
    await Profile.findOneAndUpdate(
      { candidate: candidateId }, 
      data,                     
      { 
        upsert: true,           
        new: true,              
        setDefaultsOnInsert: true
      }
    );
    return { success: true, message: "Profile updated successfully" };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Error updating profile" };
  }

}


export async function fetchCandidateProfile(candidateId: string): Promise<ProfileResponse> {
  await connectToDatabase();
  try {

    let name: any = await candidate.findById(candidateId).select('firstName lastName');
    name = name?.firstName + " " + name?.lastName;
    const profile = await Profile.findOne({ candidate: candidateId });

    const data = {
      name,
      tagline: profile?.tagline || "",
      summary: profile?.summary || "",
      workDetails: profile?.workDetails || "",
      education: profile?.education?.map((edu: any) => ({
        year: edu.year,
        degree: edu.degree,
        institution: edu.institution,
      })) || [],
      skills: profile?.skills || "",
      projects: profile?.projects?.map((proj: any) => ({
        name: proj.name,
        description: proj.description,
        link: proj.link || "",
      })) || [],
      certificates: profile?.certificates?.map((cert: any) => ({
        name: cert.name,
        issuer: cert.issuer,
        link: cert.link || "",
      })) || [],
      socialLinks: {
        linkedin: profile?.socialLinks?.linkedin || "",
        github: profile?.socialLinks?.github || "",
      },
    };

    return {
      success: true,
      message: profile ? "Profile fetched successfully" : "No profile found, returning defaults",
      data,
      completionPercentage: calculateCompletion(data)
    };


  } catch (err) {
    console.error(err);
    return { success: false, message: "Error fetching profile", data: null, completionPercentage: 0 }
  }

//need to be updated

function calculateCompletion(data: any): number {
  const fields = [
    data.name,
    data.tagline,
    data.summary,
    data.workDetails,
    data.education?.length,
    data.skills,
    data.projects?.length,
    data.certificates?.length,
    data.socialLinks?.linkedin,
    data.socialLinks?.github
  ];
  return Math.round((fields.filter(Boolean).length / 10) * 100);
}