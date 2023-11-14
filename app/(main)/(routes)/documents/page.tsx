"use client"

import Image from "next/image"
import { useUser } from "@clerk/clerk-react"
import { PlusCircle } from "lucide-react"
import { useMutation } from "convex/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const DocumentsPage = () => {
    const { user } = useUser()
    const router = useRouter()
    const create = useMutation(api.documents.create)

    const onCreate = () => {
        const promise = create({ 
            title: "Untitled"
        })
        .then((documentId) => 
            router.push(`/documents/${documentId}`)
        )
        toast.promise(promise, {
            loading: "Creating a New Note...",
            success: "Your Note has been Successfully created.",
            error: "Note Creation Failed."
        })
    }

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/empty.png"
                alt="Empty"
                width="300"
                height="300"
                className="dark:hidden"
            />
            <Image 
                src="/empty-dark.png"
                alt="Empty"
                width="300"
                height="300"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s Notion
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle 
                    className="h-4 w-4 mr-2"
                />
                Create new note
            </Button>
        </div>
    )
}

export default DocumentsPage