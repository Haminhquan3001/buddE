"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { Box, Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import FreeCounter from '@/components/FreeCounter';

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
})

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500'
    },

    {
        label: "Conversation",
        icon: MessageSquare,
        href: '/conversation',
        color: 'text-violet-500'
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        href: '/image',
        color: 'text-pink-700'
    },
    {
        label: "3D Image Generation",
        icon: Box,
        href: '/illustrations',
        color: 'text-fuchsia-700'
    },
    {
        label: "Music Generation",
        icon: Music,
        href: '/music',
        color: 'text-emerald-500'
    },
    {
        label: "Code Generation",
        icon: Code,
        href: '/code',
        color: 'text-green-700'
    },
    {
        label: "Settings",
        icon: Settings,
        href: '/settings',
    }
]

interface SidebarProps {
    apiLimitCount: number,
    isPro: boolean,
}


const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
    const pathName = usePathname();
    return (
        <div className='space-y-4 py-4 flex flex-col 
        h-full text-white bg-[#111827]'>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className='flex items-center pl-3 mb-14'>
                    <div className="relative w-8 h-8 mr-4">
                        <Image fill alt="Logo" src="/brain.png" />
                    </div>
                    <h1 className={cn('text-2xl font-bold', montserrat.className)}>BuddE</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link key={route.href} href={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start"
                                + "font-medium cursor-pointer hover:text-white hover:bg-white/10"
                                + "rounded-lg transition",
                                pathName === route.href ? "text-white bg-white/10" : "text-zinc-400")}>
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <FreeCounter
                apiLimitCount={apiLimitCount}
                isPro={isPro} />
        </div>
    )
}

export default Sidebar