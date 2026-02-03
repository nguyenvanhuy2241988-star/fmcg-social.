'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { sendMessage, getCreateConversation } from '@/app/actions_chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
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
    const scrollRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // 1. Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getCreateConversation(partner.id)
            setMessages(data)
        }
        fetchMessages()
    }, [partner.id])

    // 2. Subscribe to Realtime changes
    useEffect(() => {
        const channel = supabase
            .channel(`chat:${currentUser.id}-${partner.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=in.(${currentUser.id},${partner.id})` // Listen for messages from either party (technically we need complex filter or just listen to all and filter client side if needed, but RLS handles security)
                    // Simplified filter: actually we can just listen to table messages and filter roughly
                },
                (payload) => {
                    const newMsg = payload.new as any
                    // Check if this message belongs to this conversation
                    if (
                        (newMsg.sender_id === currentUser.id && newMsg.receiver_id === partner.id) ||
                        (newMsg.sender_id === partner.id && newMsg.receiver_id === currentUser.id)
                    ) {
                        setMessages((prev) => [...prev, newMsg])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUser.id, partner.id, supabase])

    // 3. Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim()) return
        setIsSending(true)

        // Optimistic update (optional, but let's wait for server for simplicity first or do simple append)
        // await sendMessage(partner.id, newMessage)
        // Actually for realtime it's better to fire and forget, and let subscription update UI? 
        // Or updated locally immediately. Let's send first.

        await sendMessage(partner.id, newMessage)

        setNewMessage('')
        setIsSending(false)
    }

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={partner.avatar_url} />
                    <AvatarFallback>{partner.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-sm">{partner.full_name}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-muted-foreground">Đang hoạt động</span>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${isMe
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 border-t flex gap-2">
                <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isSending}
                />
                <Button size="icon" onClick={handleSend} disabled={isSending} className="bg-teal-600 hover:bg-teal-700">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
