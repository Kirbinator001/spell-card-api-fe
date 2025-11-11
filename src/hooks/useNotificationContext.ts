import { useContext } from "react";
import {
  NotificationContext,
  NotificationContextType,
} from "../contexts/NotificationContext";

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
};
