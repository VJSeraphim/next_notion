"use client"

import { ImageIcon, Smile, X } from "lucide-react"
import React, { useRef, ElementRef, useState } from "react"
import { useMutation } from "convex/react"
import TextareaAutosize from "react-textarea-autosize"

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import { IconPicker } from "./icon-picker"
import { Button } from "./ui/button"

interface ToolbarProps {
    initialData: Doc<"documents">
    preview?: boolean
}

export const Toolbar = ({
    initialData,
    preview
}: ToolbarProps) => {
    const InputRef = useRef<ElementRef<'textarea'>>(null)
    const [isEditing, setisEditing] = useState(false)
    const [value, setValue] = useState(initialData.title)

    const update = useMutation(api.documents.update)

    const enableInput = () => {
        if(preview) return

        setisEditing(true)
        setTimeout(() => {
            setValue(initialData.title)
            InputRef.current?.focus()
        }, 0)
    }

    const disableInput = () => setisEditing(false)

    const onInput = (value: string) => {
        setValue(value)
        update({
            id: initialData._id,
            title: value || "Untitled"
        })
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if(event.key === "Enter") {
            event.preventDefault()
            disableInput()
        }
    }

    return (
        <div className="pl-[54px] group relative">
            {/* User Looking at one's own Note*/}
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={() => {}}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        onClick={() => {}}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                        variant="outline"
                        size="icon"
                    >
                        <X  className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {/* Guest Looking at other's Note*/}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker asChild onChange={() => {}}>
                        <Button
                            className="text-muted-foreground text-xs"
                            variant="outline"
                            size="sm"
                        >
                            <Smile className="h-4 w-4 mr-2"/>
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button
                        onClick={() => {}}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2"/>
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextareaAutosize 
                    ref={InputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl text-[#3f3f3f] dark:text-[#cfcfcf] font-bold break-world outline-none"
                >

                </div>
            )}
        </div>
    )
}