"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useMutation } from 'convex/react'
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
    DropdownMenu,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
 } from "@/components/ui/dropdown-menu"
import { useUser } from "@clerk/clerk-react"

interface ItemProps {
    id?: Id<"documents">
    documentIcon?: string
    active?: boolean
    expanded?: boolean
    isSearch?: boolean
    level?: number
    onExpand?: () => void
    label: string
    onClick?: () => void
    icon: LucideIcon
}

export const Item = ({
    id,
    documentIcon,
    active,
    expanded,
    isSearch,
    level = 0,
    onExpand,
    label,
    onClick,
    icon: Icon
}: ItemProps) => {
    const { user } = useUser()
    const router = useRouter()
    const ChevronIcon = expanded ? ChevronDown : ChevronRight

    const create = useMutation(api.documents.create)
    const archive = useMutation(api.documents.archive)

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        onExpand?.()
    }

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        if(!id) return
        const promise = create({ title: "Untitled", parentDocument: id })
        .then((docId) => {
            if(!expanded) {
                onExpand?.()
            }
            //router.push(`/documents/${docId}`)
        })
        toast.promise(promise, {
            loading: "Creating a New Note...",
            success: "Your Note has been Successfully created.",
            error: "Note Creation Failed."
        })
    }

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if(!id) return
        const promise = archive({ id })

        toast.promise(promise, {
            loading: "Archiving Note...",
            success: "Your Note has been Successfully archived.",
            error: "Failed to archive Note."
        })
    }

    return (
        <div
            onClick={onClick}
            role="button"
            style={{ 
                paddingLeft: level ? `${(level * 12) + 12}px`: "12px" 
            }}
            className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon 
                        className="h-4 w-4 shrink-0 text-muted-foreground/50" 
                    />
                </div>
            )}

            {documentIcon ? (
                <div className="text-[18px] mr-2 shrink-0">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="h-[18px] mr-2 text-muted-foreground shrink-0"/>
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none px-1.5 text-[10px] font-mono font-medium text-muted-foreground opacity-100 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted">
                    <span className="text-xs px-1.5">
                        CTRL +
                    </span> K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation}
                    >
                        <div 
                            role="button"
                            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        >
                            <MoreHorizontal 
                                className="h-4 w-4 text-muted-foreground"
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-60"
                        align="start"
                        side="right"
                        forceMount
                    >
                        <DropdownMenuItem
                            onClick={onArchive}
                        >
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="text-xs text-muted-foreground p-2">
                            Last edited by: {user?.fullName}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft :  level ? `${(level * 12) + 25}px` : "12px"
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}