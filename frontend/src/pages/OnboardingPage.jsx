import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast"
import { completeOnboarding } from "../lib/api";
import {GhostIcon, MapPinIcon, ShuffleIcon} from "lucide-react";
import { LANGUAGES } from "../constants";


const OnboardingPage = () => {
  const {authUser}=useAuthUser();
  const queryClient=useQueryClient();

  const [formState, setFormState]=useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })

  const {mutate:onboardingMutation, isPending}=useMutation({
    mutationFn: completeOnboarding,
    onSuccess: ()=>{
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },

    onError:(error)=>{
      toast.error(error.response.data.message);
    },
  })

  const handleSubmit=(e)=>{
    e.preventDefault();

    onboardingMutation(formState);
  }

  const handleRandomAvatar=()=>{
    const ind=Math.floor(Math.random() * 100)+1;
    const randomAvatar=`https://avatar.iran.liara.ru/public/${ind}.png`;
    setFormState({...formState, profilePic: randomAvatar})
    toast.success("Random profilepic generated");
  }
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                <img 
                  src={formState.profilePic}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ): (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="size-12 text-base-content opacity-40"/>
                </div>
              )}
              </div>

              <div className="flex ietms-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2"/>
                  Generate Random Avatar
                </button>
              </div>
            </div>

              {/* name */}
              <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What should we call you, language explorer?"
                    className="input input-bordered w-full"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState({ ...formState, fullName: e.target.value })
                    }
                    required
                  />
              </div>

              {/* bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                name="bio"
                value={formState.bio}
                onChange={(e)=>setFormState({...formState, bio: e.target.value})}
                className="textarea textarea-bordered h-24"
                placeholder="Who are you in a sentence? (Example: A traveler learning Spanish)"
                />
              </div>
              
              {/* languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* native lang */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e)=>setFormState({...formState, nativeLanguage: e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang)=>(
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* learning lang */}
              <div className="form-control">
                <label className="label">
                  <span clasName="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningState}
                  onChange={(e)=>setFormState({...formState, learningLanguage:e.target.value})}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang)=>{
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                      </option>
                    })}
                </select>
              </div>
              </div>

              {/* location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70"/>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e)=>setFormState({...formState, location: e.target.value})}
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country e.g., Hyderabad, India"
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                {!isPending ? (
                  <>
                    <GhostIcon className="size-5 mr-2"/>
                    Let’s Start the Journey
                  </>
                ):(
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2"/>
                    Setting Up Your Adventure...
                  </>
                )}
              </button>


          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
