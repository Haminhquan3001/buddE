"use client"

import React, { useEffect, useState } from 'react'
import ProModel from '@/components/ProModel';

const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null
    }

    return (
        <>
            <ProModel />
        </>
    )
}

export default ModelProvider