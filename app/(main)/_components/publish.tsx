"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface PublishProps {
    initialData: Doc<"documents">
}

export const Publish = ({
    initialData
}: PublishProps) => {
    const origin = useOrigin()
    const update = useMutation(api.documents.update)

    const [copied, setCopied] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const url = `${origin}/preview/${initialData._id}`

    const onPublish = () => {
        setIsSubmitting(true)

        const promise = update({
            id: initialData._id,
            isPublished: true
        })
        .finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note Successfully Published.",
            error: "Failed to Publish Note."
        })
    }

    const onUnpublish = () => {
        setIsSubmitting(true)

        const promise = update({
            id: initialData._id,
            isPublished: false
        })
        .finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            loading: "unPublishing...",
            success: "Note Successfully Unpublished.",
            error: "Failed to Unpublish Note."
        })
    }

    const onCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {initialData.isPublished && (
                        <Globe 
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-72" 
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div>
                        Published
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe 
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Publish this Note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with Others.
                        </span>
                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}