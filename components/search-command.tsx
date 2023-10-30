"use client"

import { File } from "lucide-react"

import { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"

import { 
    CommandDialog,
    CommandEmpty,
    CommandList,
    CommandInput,
    CommandGroup,
    CommandItem
} from "@/components/ui/command"
import { useSearch } from "@/hooks/use-search"
import { api } from "@/convex/_generated/api"

export const SearchCommand = () => {
    const { user } = useUser()
    const router = useRouter()
    const documents = useQuery(api.documents.getSearch)
    const [isMounted, setIsMounted] = useState(false)

    const toggle = useSearch((store) => store.toggle)
    const isOpen = useSearch((store) => store.isOpen)
    const onClose = useSearch((store) => store.onClose)

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`)
        onClose()
    }

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggle()
            }
        }

        document.addEventListener("keydown", keyDown)
        return () => document.removeEventListener("keydown", keyDown)
    }, [toggle])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput 
                placeholder={`Search ${user?.fullName}'s Notion...`}
            />
            <CommandList>
                <CommandEmpty>
                    No Results Found.
                </CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map((doc) => (
                        <CommandItem
                            key={doc._id}
                            value={`${doc._id} - ${doc.title}`}
                            title={doc.title}
                            onSelect={onSelect}
                        >
                            {doc.icon ? (
                                <p className="mr-2 text-[18px]">
                                    {doc.icon}
                                </p>
                            ) : (
                                <File className="mr-2 h-4 w-4"/>
                            )}
                            <span>
                                {doc.title}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}