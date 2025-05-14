
import { useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  participantIds: string[];
  participantNames?: string[];
}

export default function MessageThread({
  messages,
  currentUserId,
  participantIds,
  participantNames = []
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Faire défiler jusqu'au dernier message lors du chargement ou de nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Obtenir le nom d'un participant à partir de son ID
  const getParticipantName = (participantId: string) => {
    const index = participantIds.indexOf(participantId);
    return index !== -1 && participantNames[index] 
      ? participantNames[index] 
      : "Utilisateur";
  };
  
  // Obtenir la première lettre du nom d'un participant
  const getParticipantInitial = (participantId: string) => {
    return getParticipantName(participantId).charAt(0).toUpperCase();
  };

  // Grouper les messages par date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  // Formater la date d'un groupe de messages
  const formatGroupDate = (dateKey: string) => {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Aujourd'hui";
    } else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Hier";
    } else {
      return format(date, "EEEE d MMMM yyyy", { locale: fr });
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-6">
      {Object.keys(messageGroups).length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            Aucun message dans cette conversation
          </p>
        </div>
      )}
      
      {Object.entries(messageGroups).map(([dateKey, groupMessages]) => (
        <div key={dateKey} className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-px flex-grow bg-border"></div>
            <span className="px-2 text-xs text-muted-foreground bg-card">
              {formatGroupDate(dateKey)}
            </span>
            <div className="h-px flex-grow bg-border"></div>
          </div>
          
          {groupMessages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <div>{getParticipantInitial(message.senderId)}</div>
                    </Avatar>
                  )}
                  
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                      
                      {message.attachmentUrl && (
                        <div className="mt-2">
                          <a
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 break-all"
                          >
                            {message.attachmentUrl.split("/").pop()}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                      {format(new Date(message.createdAt), "HH:mm")}
                      {message.status === "read" && isCurrentUser && (
                        <span className="ml-1">• Lu</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
