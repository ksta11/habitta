import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { updatePushTokenIfChanged } from "../libs/notifications/api-service";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationAsync";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  const handleNotificationNavigation = (notificationData: any) => {
      const { type, action, propertyTitle, applicantName } = notificationData || {};
      
      console.log('🔔 Navigating based on notification:', { type, action, propertyTitle, applicantName });
      
      // Priorizar action sobre type (más específico)
      switch(action) {
        case 'open_app':
          router.push('/');
          break;
          
        case 'view_applications':
          if (type === 'user_notification') {
            router.push('/(user)/(applications)');
          } else if (type === 'owner_notification') {
            router.push('/(owner)/(applications)');
          }
          break;

        case 'view_properties':
          router.push('/(owner)/(properties)');
          break;
        
        default:
          router.push('/');
      
      }
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => {
        setExpoPushToken(token);
        // Verificar si el token cambió y actualizarlo si es necesario
        if (token) {
          updatePushTokenIfChanged(token).catch(error => {
            console.error('❌ Error al verificar cambio de push token:', error);
          });
        }
      },
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
        const notificationData = response.notification.request.content.data;
        handleNotificationNavigation(notificationData);
      });

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};