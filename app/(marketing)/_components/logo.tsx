import Image from "next/image"
import { Poppins } from "next/font/google"

import { cn } from "@/lib/utils"

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
})

export const Logo = () => {
    return (
        <div className="hodden md:flex items-center gap-x-2">
            <Image 
                src="/logo.svg"
                alt="logo"
                width="40"
                height="40"
            />
            <p className={cn("font-semibold", font.className)}>
                Notion_clone
            </p>
        </div>
    )
}