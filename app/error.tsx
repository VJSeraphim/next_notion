"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <Image 
                src="/error.png"
                width="300"
                height="300"
                alt="error"
                className="dark:hidden"
            />
            <Image 
                src="/error-dark.png"
                width="300"
                height="300"
                alt="error"
                className="hidden dark:block"
            />
            <h2 className="text-xl font-medium">
                Ouch... Maybe you bumped to the wrong room!
            </h2>
            <Button asChild>
                <Link href="/documents">
                    Go back
                </Link>
            </Button>
        </div>
    )
}

export default Error