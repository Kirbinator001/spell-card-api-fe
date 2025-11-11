import { ReactNode, useState } from "react";
import { NotificationContext, SeverityType } from "./NotificationContext";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info" as SeverityType);

  const showNotification = (
    message: string,
    severity: SeverityType,
  ) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  };

  const hideNotification = () => {
    setOpen(false);
  };

  const value = {
    open,
    message,
    severity,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
