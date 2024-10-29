"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SubscriptionButtonProps {
    isPro: boolean
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);
    const onClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stripe');
            window.location.href = response.data.url
        } catch (error) {
            toast.error("Something went wrong. Please try again")
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button disabled={loading} onClick={onClick} variant={isPro ? "default" : "pro"}>
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className='w-4 h-4 fill-white ml-2' />}
        </Button>
    )
}

export default SubscriptionButton