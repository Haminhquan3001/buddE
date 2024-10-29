"use client"
import Heading from '@/components/Heading'
import axios from "axios";
import { Code } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { formSchema } from './constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import Empty from '@/components/Empty';
import ReactMarkdown from 'react-markdown'
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar';
import BotAvatar from '@/components/BotAvatar';
import { useProModel } from '@/hooks/use-pro-model';
import toast from 'react-hot-toast';

const CodePage = () => {
    const proModel = useProModel();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    // similar to create a isLoading using useState
    // useForm has its own formState where we can use
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //Construct userMessage Object
            const userMessage: ChatCompletionMessageParam = {
                role: "user",
                content: values.prompt
            };
            //Construct a new array of messages, to keep track of the 
            // previous conversation
            const newMessages = [...messages, userMessage];

            //Make a axios post request to openAI api
            const response = await axios.post("/api/code",
                { messages: newMessages });

            //update the current messages
            setMessages((current) => [...current, userMessage, response.data])
            form.reset();

        } catch (error: any) {
            if(error?.response?.status === 403) {
                proModel.onOpen();
            }
            else {
                toast.error("Something went wrong. Please try again")
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Code-versation Assistant that help you to understand code step by step"
                icon={Code}
                iconColor='text-green-700'
                bgColor='bg-green-700/10' />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3
                         md:px-6 focus-within:shadow-sm grid grid-cols-12
                          gap-2'>
                            <FormField name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className='m-0 p-0'>
                                            <Input className='border-0 outline-none focus-visible:ring-0 
                                        focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='Write a Pac-Man game using C++'
                                                {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            <Button className='col-span-12 lg:col-span-2 bg-slate-700
                         w-full' disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}

                    {messages.length === 0 && !isLoading && (
                        <Empty label='No Code Generated' />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((mess) => (
                            <div key={String(mess.content)}
                                className={
                                    cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                                        mess.role === "user" ?
                                            "bg-white border border-black/10"
                                            : "bg-muted"
                                    )}>
                                {mess.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className='overflow-auto w-full my-2
                                         bg-black/10 p-2 rounded-lg'>
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className='bg-black/10 p-1
                                         rounded-lg' {...props} />

                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7">
                                    {String(mess.content) || ""}

                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CodePage