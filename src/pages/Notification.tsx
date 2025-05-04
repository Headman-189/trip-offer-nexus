
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Notification() {
  const { id } = useParams<{ id: string }>();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleNotification = async () => {
      if (!id || !currentUser) {
        console.log("Notification ID missing or user not logged in, redirecting to dashboard");
        navigate("/dashboard");
        return;
      }
      
      try {
        console.log(`Processing notification: ${id}`);
        // Marque la notification comme lue
        await markNotificationAsRead(id);
        
        // Redirige vers la page appropriée en fonction du type de notification
        const allNotifications = getUserNotifications();
        const notification = allNotifications.find(n => n.id === id);
        
        console.log("Found notification:", notification);
        
        if (notification) {
          if (notification.relatedRequestId) {
            if (currentUser.role === 'client') {
              console.log(`Redirecting client to request: ${notification.relatedRequestId}`);
              navigate(`/request/${notification.relatedRequestId}`);
            } else {
              console.log(`Redirecting agency to request: ${notification.relatedRequestId}`);
              navigate(`/agency/request/${notification.relatedRequestId}`);
            }
          } else if (notification.relatedOfferId) {
            console.log("Redirecting to my offers");
            navigate('/my-offers');
          } else {
            // Par défaut, retourner au tableau de bord
            console.log("No specific redirect target, going to dashboard");
            navigate('/dashboard');
          }
        } else {
          console.log("Notification not found, going to dashboard");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error processing notification:", error);
        navigate('/dashboard');
      }
    };
    
    handleNotification();
  }, [id, navigate, markNotificationAsRead, getUserNotifications, currentUser]);
  
  // Cette page ne devrait jamais être rendue car elle redirige immédiatement
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3">Redirection en cours...</span>
    </div>
  );
}
