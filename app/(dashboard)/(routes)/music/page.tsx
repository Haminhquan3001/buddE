"use client"
import Heading from '@/components/Heading'
import axios from "axios";
import { Music } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { formSchema } from './constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';
import { useProModel } from '@/hooks/use-pro-model';
import toast from 'react-hot-toast';

const MusicPage = () => {
    const proModel = useProModel();
    const router = useRouter();
    const [music, setMusic] = useState<string>();
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
            setMusic(undefined);
            const response = await axios.post("/api/music", values, {timeout: 100000});
            setMusic(response.data.audio);
            form.reset();

        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModel.onOpen();
            } else {
                toast.error("Something went wrong. Please try again")
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Music Generation"
                description="One good thing about music, when it hits you, you feel no pain"
                icon={Music}
                iconColor='text-emerald-500'
                bgColor='bg-emerald-500/10' />
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
                                                placeholder='Write a nostalgic song about memories...'
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

                    {!music && !isLoading && (
                        <Empty label='No Music Generated' />
                    )}
                    {music && (
                        <audio className='w-full mt-8' controls >
                            <source src={music} />
                        </audio>
                    )}
                </div>
            </div>


        </div>
    )
}

export default MusicPage