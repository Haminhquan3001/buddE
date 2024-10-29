import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = "1", resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not found", { status: 500 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 });
        }
        const freeTrials = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrials && !isPro) {
            return new NextResponse("Free trials has expired", { status: 403 });
        }

        const images = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: parseInt(amount, 10),
            size: resolution
        });
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(images.data);

    } catch (error) {
        console.log("[CONVERSATION ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}