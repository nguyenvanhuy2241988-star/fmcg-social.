'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage, getCreateConversation } from '@/app/actions_chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MoreHorizontal, Phone, Video } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatWindowProps {
    currentUser: any
    partner: {
        id: string
        full_name: string
        avatar_url: string
    }
}

export default function ChatWindow({ currentUser, partner }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    // Use useState to hold the client instance so it doesn't recreate on re-renders
    const [supabase] = useState(() => createClient())

    // 1. Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getCreateConversation(partner.id)
            setMessages(data)
        }
        fetchMessages()
    }, [partner.id])

    // 2. Subscribe to Realtime changes AND Polling Fallback
    useEffect(() => {
        // A. Realtime Subscription
        const channel = supabase
            .channel('any_message_insert')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    const newMsg = payload.new as any
                    const isRelevant =
                        (newMsg.sender_id === currentUser.id && newMsg.receiver_id === partner.id) ||
                        (newMsg.sender_id === partner.id && newMsg.receiver_id === currentUser.id);

                    if (isRelevant) {
                        setMessages((prev) => {
                            if (prev.some(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        })
                        setTimeout(scrollToBottom, 100);
                    }
                }
            )
            .subscribe()

        // B. Polling Fallback (Every 3 seconds)
        const intervalId = setInterval(async () => {
            const latestMessages = await getCreateConversation(partner.id);
            if (latestMessages && latestMessages.length > 0) {
                setMessages(prev => {
                    if (latestMessages.length !== prev.length) {
                        setTimeout(scrollToBottom, 100);
                        return latestMessages;
                    }
                    return prev;
                });
            }
        }, 3000);

        return () => {
            supabase.removeChannel(channel)
            clearInterval(intervalId) // Cleanup polling
        }
    }, [currentUser.id, partner.id, supabase])

    // 3. Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim()) return
        setIsSending(true)
        await sendMessage(partner.id, newMessage)
        setNewMessage('')
        setIsSending(false)
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                        <AvatarImage src={partner.avatar_url} />
                        <AvatarFallback>{partner.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-gray-900">{partner.full_name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-muted-foreground">Đang hoạt động</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
                </div>
            </div>

            {/* Messages List Area */}
            <ScrollArea className="flex-1 bg-white">
                <div className="p-4 space-y-6">
                    {/* Timestamp Separator Example */}
                    <div className="flex justify-center">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Ngày hôm nay</span>
                    </div>

                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe
                                                ? 'bg-teal-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    {/* <span className="text-[10px] text-gray-400 mt-1">Sent</span> */}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
                <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-full border focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                    <Input
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isSending}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={isSending || !newMessage.trim()}
                        className={`rounded-full h-8 w-8 transition-all ${newMessage.trim() ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-300'}`}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
