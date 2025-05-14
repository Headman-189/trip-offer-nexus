
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Conversation, Message as MessageType } from "@/types";
import { Send, Search } from "lucide-react";
import ConversationList from "@/components/messaging/ConversationList";
import MessageThread from "@/components/messaging/MessageThread";
import { Skeleton } from "@/components/ui/skeleton";

export default function Messages() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { 
    getUserConversations, 
    getConversationMessages,
    sendMessage,
    markMessagesAsRead
  } = useData();
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userConversations = await getUserConversations(currentUser.id);
        setConversations(userConversations);
        setFilteredConversations(userConversations);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos conversations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [currentUser, getUserConversations, toast]);
  
  useEffect(() => {
    // Filtrer les conversations en fonction de la recherche et de l'onglet actif
    if (conversations.length === 0) return;
    
    let filtered = [...conversations];
    
    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.participantNames?.some(name => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || 
        (conv.lastMessageContent && 
         conv.lastMessageContent.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filtre par onglet
    if (activeTab === "unread") {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }
    
    setFilteredConversations(filtered);
  }, [searchQuery, activeTab, conversations]);
  
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }
      
      try {
        const conversationMessages = await getConversationMessages(selectedConversation.id);
        setMessages(conversationMessages);
        
        // Marquer les messages comme lus
        if (selectedConversation.unreadCount > 0 && currentUser) {
          await markMessagesAsRead(selectedConversation.id, currentUser.id);
          
          // Mettre à jour la conversation dans la liste
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === selectedConversation.id 
                ? { ...conv, unreadCount: 0 }
                : conv
            )
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des messages", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les messages",
          variant: "destructive"
        });
      }
    };
    
    loadMessages();
  }, [selectedConversation, getConversationMessages, toast, currentUser, markMessagesAsRead]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const recipientId = selectedConversation.participantIds.find(id => id !== currentUser.id);
      if (!recipientId) return;
      
      await sendMessage({
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        recipientId,
        content: newMessage
      });
      
      // Réinitialiser le champ de message
      setNewMessage("");
      
      // Recharger les messages
      const updatedMessages = await getConversationMessages(selectedConversation.id);
      setMessages(updatedMessages);
      
      // Mettre à jour la conversation dans la liste
      const updatedConversations = await getUserConversations(currentUser.id);
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">
            Vous devez être connecté pour accéder à la messagerie
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messagerie</h1>
          <p className="text-muted-foreground">
            Communiquez avec les agences de voyage et les clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Liste des conversations */}
          <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col bg-card">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Non lus
                    {conversations.reduce((count, conv) => count + conv.unreadCount, 0) > 0 && (
                      <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                        {conversations.reduce((count, conv) => count + conv.unreadCount, 0)}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-grow overflow-y-auto">
              {loading ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[70%]" />
                        <Skeleton className="h-3 w-[90%]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ConversationList
                  conversations={filteredConversations}
                  currentUserId={currentUser.id}
                  selectedConversationId={selectedConversation?.id}
                  onSelectConversation={setSelectedConversation}
                />
              )}
              
              {!loading && filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || activeTab === "unread"
                      ? "Aucune conversation ne correspond à vos critères"
                      : "Vous n'avez pas encore de conversation"}
                  </p>
                  
                  {(searchQuery || activeTab === "unread") && filteredConversations.length === 0 && conversations.length > 0 && (
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery("");
                        setActiveTab("all");
                      }}
                    >
                      Afficher toutes les conversations
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Conversation active */}
          <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col bg-card">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <div>
                        {selectedConversation.participantNames
                          ?.find((_, i) => selectedConversation.participantIds[i] !== currentUser.id)
                          ?.charAt(0) || "?"}
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedConversation.participantNames
                          ?.find((_, i) => selectedConversation.participantIds[i] !== currentUser.id) || "Conversation"}
                      </h3>
                    </div>
                  </div>
                </div>
                
                <MessageThread
                  messages={messages}
                  currentUserId={currentUser.id}
                  participantNames={selectedConversation.participantNames || []}
                  participantIds={selectedConversation.participantIds}
                />
                
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendingMessage}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || sendingMessage}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Envoyer</span>
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="mb-4 bg-muted rounded-full p-4">
                  <Send className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucune conversation sélectionnée</h3>
                <p className="text-muted-foreground">
                  Sélectionnez une conversation ou démarrez une nouvelle discussion avec une agence
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
