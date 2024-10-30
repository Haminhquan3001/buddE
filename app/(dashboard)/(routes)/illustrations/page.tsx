"use client"
import Heading from '@/components/Heading'
import axios from "axios";
import { Box, Download } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { amountOptions, formSchema, resolutionOptions } from './constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import Empty from '@/components/Empty';
import Loader from '@/components/Loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { useProModel } from '@/hooks/use-pro-model';
import toast from 'react-hot-toast';


const IllustrationPage = () => {
    const proModel = useProModel();
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });
    // similar to create a isLoading using useState
    // useForm has its own formState where we can use
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            //Make a axios post request to openAI api
            const response = await axios.post("/api/3d-image", values, {timeout: 100000});
            console.log("response.data: ", response.data);
            // const urls = response.data.images.map(
            //     (base64String: string) => `data:image/png;base64,${base64String}`);

            // Convert each base64 image to a Blob and then create an object URL
            const urls = response.data.images.map((base64Image: string) => {
                const binaryString = window.atob(base64Image);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);

                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: 'image/png' });
                return URL.createObjectURL(blob);
            });
            console.log(urls);
            setImages(urls);

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
                title="Art/Illustrated/3D Image Generation"
                description="Generate 3D, Illustrated Image based on your prompt"
                icon={Box}
                animate='animate-bounce'
                iconColor='text-fuchsia-700'
                bgColor='bg-fuchsia-700/10' />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3
                         md:px-6 focus-within:shadow-sm grid grid-cols-12
                          gap-2'>
                            <FormField name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className='m-0 p-0'>
                                            <Input className='border-0 outline-none focus-visible:ring-0 
                                        focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='Cristiano Ronaldo holding World Cup'
                                                {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            <FormField name="amount"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-2'>
                                        <Select disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField name="resolution"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-2'>
                                        <Select disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((resolution) => (
                                                    <SelectItem key={resolution.value} value={resolution.value}>
                                                        {resolution.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Button className='col-span-12 lg:col-span-2 bg-slate-700
                         w-full' disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}

                    {images.length === 0 && !isLoading && (
                        <Empty label='No 3D images generated' />
                    )}
                    <div className='grid grid-cols-1 md:grid-cols-2
                lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
                        {images.map((src) => (
                            <Card key={src} className='rounded-lg overflow-hidden'>
                                <div className="relative aspect-square">
                                    <Image src={src} alt="Image" fill />
                                </div>
                                <CardFooter className='p-2'>
                                    <Button
                                        onClick={() => window.open(src)}
                                        variant="secondary" className='w-full'>
                                        <Download className='h-4 w-4 mr-2' />Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default IllustrationPage