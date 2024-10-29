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
        const { prompt, amount = "1", resolution = "512x512" } = body;
        const pixelResolution = parseInt(resolution.substring(0, 3));
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
            prompt: prompt,
            num_outputs: parseInt(amount),
            width: pixelResolution,
            height: pixelResolution
        };
        const response = await replicate.run("bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad", { input }) as ReadableStream[];
        if (!isPro) {
            await increaseApiLimit();
        }
        const buffers = await Promise.all(response.map((stream: ReadableStream) => readStream(stream)));
        const base64Images = buffers.map(buffer => Buffer.from(buffer).toString('base64'));

        return NextResponse.json({ images: base64Images });


    } catch (error) {
        console.log("[3D Image Gen ERROR]", error);
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