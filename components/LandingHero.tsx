"use client";
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react'
import TypewriterComponent from 'typewriter-effect'
import { Button } from '@/components/ui/button';
const LandingHero = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className='text-white font-bold py-36 text-center space-y-5'>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>The AI Tool That Guide You to a Professional Success</h1>
                <div className='text-transparent bg-clip-text 
                bg-gradient-to-r from-cyan-500 to-blue-500'>
                    <TypewriterComponent options={{
                        strings: [
                            "Features...",],
                        autoStart: true,
                        loop: true
                    }} />

                </div>
                <div className='text-transparent bg-clip-text 
                bg-gradient-to-r from-purple-400 to-pink-600'>
                    <TypewriterComponent options={{
                        strings: [
                            "Chatbot.",
                            "Photo Generation.",
                            "Music Generation.",
                            "3D Generation.",
                            "Code Generation.",
                        ],
                        autoStart: true,
                        loop: true
                    }} />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Create content using AI Models 10x faster.
            </div>
            <div>
                <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
                    <Button variant="pro"
                        className='md:text-lg p-4 md:p-6 rounded-full font-semibold'>
                        Get Started For Free
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No payment required.
            </div>
        </div>
    )
}

export default LandingHero