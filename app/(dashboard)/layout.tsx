import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import React from 'react'

const DashBoardLayOut = async ({
    children
}: {
    children: React.ReactNode

}) => {
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();
    return (
        <div className='h-full relative'>
            <div className='hidden h-full md:flex md:w-72 md:flex-col
            md:fixed mx:inset-y-0 
            bg-gray-900'>
                <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
            </div>
            <main className='md:pl-72'>
                <Navbar />
                {children}
            </main>
        </div>
    )
}

export default DashBoardLayOut