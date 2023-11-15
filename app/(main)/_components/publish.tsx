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
import { Check, Copy, Globe } from "lucide-react"

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
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Globe 
                                className="text-sky-500 animate-pulse w-4 h-4"
                            />
                            <p className="text-xs font-medium text-sky-500">
                                This Note is Currently live.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input 
                                className="flex-1 px-2 text-xs border rounded-1-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4"/>
                                ) : (
                                    <Copy className="w-4 h-4"/>
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
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