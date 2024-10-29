import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const instructionMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: "You will be provided with a piece of code or a prompt, and your task is to explain it in a"
        + "concise way. Your code snippets should be in markdown."
}

export async function POST(req: Request) {

    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not found", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const freeTrials = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrials && !isPro) {
            return new NextResponse("Free trials has expired", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [instructionMessage, ...messages]
        });
        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log("[CODE ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}