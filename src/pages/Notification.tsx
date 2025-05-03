
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

export default function Notification() {
  const { id } = useParams<{ id: string }>();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const redirectToTarget = async () => {
        try {
          // Marque la notification comme lue
          await markNotificationAsRead(id);
          
          // Redirige vers la page appropriée en fonction du type de notification
          const notification = getUserNotifications().find(n => n.id === id);
          
          if (notification) {
            if (notification.relatedRequestId) {
              if (notification.userRole === 'client') {
                navigate(`/request/${notification.relatedRequestId}`);
              } else {
                navigate(`/agency/request/${notification.relatedRequestId}`);
              }
            } else if (notification.relatedOfferId) {
              navigate('/my-offers');
            } else {
              // Par défaut, retourner au tableau de bord
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error("Error processing notification:", error);
          navigate('/dashboard');
        }
      };
      
      redirectToTarget();
    }
  }, [id, navigate]);
  
  // Cette page ne devrait jamais être rendue car elle redirige immédiatement
  return null;
}
