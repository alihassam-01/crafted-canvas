import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, Search, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConversations, mockMessages } from '@/data/mockData';
import { Conversation, Message } from '@/types';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0] || null
  );
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
  });

  const currentUser = userData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      sender: currentUser as any, // Type mismatch between API User and Mock User, casting for now
      content: newMessage,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    // Fallback to first participant if current user is not found (e.g. mock conversation)
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  return (
    <div className="h-[calc(100vh-250px)] min-h-[500px] bg-card rounded-xl border overflow-hidden flex">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-display text-xl mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {mockConversations.map((conversation) => {
            const other = getOtherParticipant(conversation);
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  'w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left',
                  isSelected && 'bg-muted/50'
                )}
              >
                <div className="relative">
                  <img
                    src={other.avatar}
                    alt={other.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">
                      {other.firstName} {other.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="hidden md:flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={getOtherParticipant(selectedConversation).avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {getOtherParticipant(selectedConversation).firstName}{' '}
                  {getOtherParticipant(selectedConversation).lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getOtherParticipant(selectedConversation).role === 'vendor' ? 'Seller' : 'Customer'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages
                .filter(m => m.conversationId === selectedConversation.id)
                .map((message) => {
                  const isOwn = message.senderId === currentUser.id || message.senderId === '1'; // Fallback for mock data

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        isOwn ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[70%] px-4 py-2 rounded-2xl',
                          isOwn
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        )}
                      >
                        <p>{message.content}</p>
                        <p className={cn(
                          'text-xs mt-1',
                          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
