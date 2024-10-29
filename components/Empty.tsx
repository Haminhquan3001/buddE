import Image from 'next/image'
import React from 'react'
interface EmptyProps {
    label: string,
}
const Empty = ({ label }: EmptyProps) => {
    return (
        <div className='h-full p-20 flex flex-col items-center justify-center'>
            <div className="relative min-h-60 w-60">
                <Image fill src="/empty.png" alt="empty" />
            </div>
            <p className="text-muted-foreground text-sm text-center">{label}</p>
        </div>
    )
}

export default Empty