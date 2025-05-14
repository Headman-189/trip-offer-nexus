
import { Avatar } from "@/components/ui/avatar";
import { Conversation } from "@/types";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation
}: ConversationListProps) {
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Hier";
    } else {
      return format(date, "dd/MM/yyyy", { locale: fr });
    }
  };
  
  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const otherParticipantName = conversation.participantNames
          ?.find((_, i) => conversation.participantIds[i] !== currentUserId) || "Utilisateur";
        const otherParticipantInitial = otherParticipantName.charAt(0).toUpperCase();
        
        return (
          <div
            key={conversation.id}
            className={`p-4 cursor-pointer hover:bg-muted/40 transition-colors ${
              selectedConversationId === conversation.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <div>{otherParticipantInitial}</div>
                </Avatar>
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">
                    {otherParticipantName}
                  </span>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  )}
                </div>
                {conversation.lastMessageContent && (
                  <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-medium" : "text-muted-foreground"}`}>
                    {conversation.lastMessageContent}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
