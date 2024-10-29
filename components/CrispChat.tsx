"use client"

import { useEffect } from 'react'
import { Crisp } from "crisp-sdk-web"

const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("1f269a51-30e6-46e9-8a0a-42f69658479f")
    }, [])
    return null
}

export default CrispChat