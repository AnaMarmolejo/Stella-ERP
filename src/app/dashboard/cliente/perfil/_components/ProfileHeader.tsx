"use client";

import { User, ShieldCheck } from "lucide-react";
import { UserProfile } from "../type";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
      {/* Banner Background */}
      <div className="absolute top-0 left-0 w-full h-32 sm:h-48 bg-gradient-to-r from-[#b76e79] to-[#c88b94] opacity-90 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 pt-16 sm:pt-24 mt-4 sm:mt-0">
        {/* Avatar Container */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden z-20">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-4xl sm:text-5xl font-semibold text-[#b76e79] italic">
                {profile.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2d3748] m-0 mb-2 italic drop-shadow-sm">
            {profile.nombre}
          </h1>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f6f4ef] rounded-full border border-gray-200 shadow-sm">
            <ShieldCheck size={16} className="text-[#b76e79]" />
            <span className="font-sans text-[10px] sm:text-xs font-bold text-[#708090] uppercase tracking-widest">
              {profile.rol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
