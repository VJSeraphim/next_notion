"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { useUser } from "@clerk/clerk-react"
import { toast } from "sonner"

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"


import { MoreHorizontal, Trash } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProps {
    documentId: Id<"documents">
}

export const Menu = ({
    documentId
}: MenuProps) => {
    const router = useRouter()
    const { user } = useUser()

    const archive = useMutation(api.documents.archive)

    const onArchive = () => {
        const promise = archive({ id: documentId })

        toast.promise(promise, {
            loading: "Note moving to Trash Bin..",
            success: "Your Note has been successfully move to Trash Bin.",
            error: "Failed to move Note."
        })

        router.push("/documents")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-60" 
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="w-4 h-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last Edited By: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-10 w-10"/>
    )
}