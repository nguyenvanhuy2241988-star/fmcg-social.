"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-lg bg-background border shadow-lg animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
