"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { FileIcon } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

import { Item } from "./item"


interface DocumentListProps {
    parentDocumentId? : Id<"documents">
    level?: number
    data?: Doc<"documents">[]
}

export const DocumentList = ({
   parentDocumentId,
   level = 0,
}: DocumentListProps) => {
    const params = useParams()
    const router = useRouter()
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const onExpand = (documentId: string) => {
        setExpanded(prev => ({
            ...prev,
            [documentId]: !prev[documentId]
        }))
    }

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    })

    if(documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        )
    }

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`)
    }

    return (
        <>
            <p
                style={{
                    paddingLeft : level ? `${(level + 12) * 25}px` : "12px"
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages Inside
            </p>
            {documents.map((doc) => (
                <div key={doc._id}>
                    <Item
                        id={doc._id}
                        onClick={() => onRedirect(doc._id)}
                        label={doc.title}
                        icon={FileIcon}
                        documentIcon={doc.icon}
                        active={params.documentId === doc._id}
                        level={level}
                        onExpand={() => onExpand(doc._id)}
                        expanded={expanded[doc._id]}
                    />
                    {expanded[doc._id] && (
                        <DocumentList
                        parentDocumentId={doc._id}
                        level={level + 1}
                        />
                    )}
                </div>
            ))}
        </>
    )
}