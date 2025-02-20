"use client"
import Heading from '@/components/Heading'
import axios from "axios";
import { Download, ImageIcon } from 'lucide-react'
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


const ImagePage = () => {
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
            const response = await axios.post("/api/image", values, {timeout: 100000});

            const urls = response.data.map((image: { url: string }) => image.url);
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
                title="Image Generation"
                description="Generate Image based on your prompt"
                icon={ImageIcon}
                iconColor='text-pink-700'
                bgColor='bg-pink-700/10' />
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
                                                placeholder='Europe sunset with cinematic lightning'
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
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}

                    {images.length === 0 && !isLoading && (
                        <Empty label='No images generated' />
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

export default ImagePage