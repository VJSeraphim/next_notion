"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react"

interface ItemProps {
    id?: Id<"documents">
    documentIcon?: string
    active?: boolean
    expanded?: boolean
    isSearch?: boolean
    level?: number
    onExpand?: () => void
    label: string
    onClick: () => void
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
    const ChevronIcon = expanded ? ChevronDown : ChevronRight

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
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={() => {}}
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

            <Icon className="h-[18px] mr-2 text-muted-foreground shrink-0"/>
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