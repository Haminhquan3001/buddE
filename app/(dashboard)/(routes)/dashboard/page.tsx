"use client"

import { Card } from "@/components/ui/card";
import { ArrowRight, Box, Code, ImageIcon, MessageSquare, Music } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tools = [
    {
        label: 'Conversation',
        icon: MessageSquare,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        href: '/conversation'
    },
    {
        label: 'Music Generation',
        icon: Music,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        href: '/music'
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: 'text-pink-700',
        bgColor: 'bg-pink-700/10',
        href: '/image'
    },
    {
        label: "3D Image Generation",
        icon: Box,
        href: '/illustrations',
        bgColor: 'bg-fuchsia-700/10',
        color: 'text-fuchsia-700'
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: 'text-green-700',
        bgColor: 'bg-green-700/10',
        href: '/code'
    },

]

const DashboardPage = () => {
    const router = useRouter();
    return (
        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-center">
                    Discover the power of AI and Making Rational Decisions
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                    Have a conversation with AI chatBot to increase
                    your efficiency and continous learning
                </p>
            </div>
            <div className="px-4 md:px-20 lg:px-32 space-y-4">
                {tools.map((tool) => (
                    <Card key={tool.href}
                        onClick={() => { router.push(tool.href) }}
                        className="p-4 border-black/5 flex items-center 
                    justify-between hover:shadow-md transition cursor-pointer">
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-8 h-8", tool.color)} />
                            </div>
                            <div className="font-semibold">{tool.label}</div>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage
