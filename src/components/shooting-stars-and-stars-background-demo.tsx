"use client";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>AstroBio</span>
        <span className="text-white text-lg font-thin">×</span>
        <span>Space Research</span>
      </h2>
      <ShootingStars 
        starColor="#22c55e"
        trailColor="#16a34a"
        minSpeed={6}
        maxSpeed={16}
      />
      <StarsBackground />
    </div>
  );
}