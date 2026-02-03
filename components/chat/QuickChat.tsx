'use client'

import { useState } from 'react'
import { MessageSquare, X, Minus, Send, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import ChatWindow from '@/components/chat/ChatWindow'
import Link from 'next/link'

interface QuickChatProps {
    currentUser: any
    connections: any[]
}

export default function QuickChat({ currentUser, connections }: QuickChatProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activePartner, setActivePartner] = useState<any | null>(null)
    const [isMinimized, setIsMinimized] = useState(false)

    if (!currentUser) return null

    const toggleOpen = () => {
        setIsOpen(!isOpen)
        setIsMinimized(false)
    }

    const selectPartner = (partner: any) => {
        setActivePartner(partner)
    }

    const backToList = () => {
        setActivePartner(null)
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={toggleOpen}
                    className="h-14 w-14 rounded-full shadow-lg bg-teal-600 hover:bg-teal-700 text-white p-0 relative"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>
            </div>
        )
    }

    return (
        <div className={`fixed bottom-4 right-6 z-50 w-80 sm:w-96 bg-white rounded-t-xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
            {/* Header */}
            <div
                className="bg-teal-600 text-white p-3 rounded-t-xl flex items-center justify-between cursor-pointer"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <div className="flex items-center gap-2 font-semibold">
                    {activePartner ? (
                        <>
                            <div
                                onClick={(e) => { e.stopPropagation(); backToList() }}
                                className="hover:bg-teal-700 p-1 rounded cursor-pointer"
                            >
                                ←
                            </div>
                            <Avatar className="h-6 w-6 border border-white/50">
                                <AvatarImage src={activePartner.avatar_url} />
                                <AvatarFallback>{activePartner.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[150px]">{activePartner.full_name}</span>
                        </>
                    ) : (
                        <>
                            <MessageSquare className="h-5 w-5" />
                            <span>Tin nhắn</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {activePartner && !isMinimized && (
                        <Link href={`/messages?id=${activePartner.id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-teal-700">
                                <Maximize2 className="h-3 w-3" />
                            </Button>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white hover:bg-teal-700"
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white hover:bg-teal-700"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div className="flex-1 overflow-hidden bg-white flex flex-col">
                    {activePartner ? (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Pass a minimal prop or ensure ChatWindow fits */}
                            <ChatWindow currentUser={currentUser} partner={activePartner} />
                        </div>
                    ) : (
                        <ScrollArea className="flex-1">
                            <div className="p-2">
                                {connections.length > 0 ? (
                                    connections.map((friend: any) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => selectPartner(friend)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <div className="relative">
                                                <Avatar>
                                                    <AvatarImage src={friend.avatar_url} />
                                                    <AvatarFallback>{friend.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm text-gray-900 truncate">{friend.full_name}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{friend.headline || "Đang hoạt động"}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        Chưa có kết nối nào.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            )}
        </div>
    )
}
