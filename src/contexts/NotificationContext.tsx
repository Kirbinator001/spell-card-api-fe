import { createContext } from "react";

export type SeverityType = "success" | "error" | "warning" | "info";

export type NotificationContextType = {
  open: boolean;
  message: string;
  severity: SeverityType;
  showNotification: (message: string, severity: SeverityType) => void;
  hideNotification: () => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);