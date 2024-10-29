import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
})
export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt are required", { status: 400 });
        }

        const freeTrials = await checkApiLimit();
        const isPro = await checkSubscription();
        if (!freeTrials && !isPro) {
            return new NextResponse("Free trials has expired", { status: 403 });
        }
        const input = {
            prompt_a: prompt
        };
        const response: any = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });
        if (!isPro) {
            await increaseApiLimit();
        }
        const audioBuffer = await readStream(response.audio);
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        const jsonResponse = {
            audio: `data:audio/wav;base64,${base64Audio}`
        };

        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.log("[MUSIC ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

async function readStream(stream: ReadableStream): Promise<Uint8Array> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    const concatenatedArray = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
        Uint8Array.prototype.set.call(concatenatedArray, chunk, offset);
        offset += chunk.length;
    }

    return concatenatedArray;
}