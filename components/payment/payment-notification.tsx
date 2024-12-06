import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type PaymentStatus = "success" | "error" | "pending";

interface PaymentNotificationProps {
  status: PaymentStatus;
  message: string;
  details?: string;
  onRetry?: () => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    title: "Payment Successful",
    className: "border-green-500 bg-green-50 text-green-900",
  },
  error: {
    icon: XCircle,
    title: "Payment Failed",
    className: "border-red-500 bg-red-50 text-red-900",
  },
  pending: {
    icon: AlertCircle,
    title: "Payment Processing",
    className: "border-yellow-500 bg-yellow-50 text-yellow-900",
  },
};

export function PaymentNotification({
  status,
  message,
  details,
  onRetry,
}: PaymentNotificationProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Alert className={config.className}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="ml-2">{config.title}</AlertTitle>
      <AlertDescription className="ml-2">
        <p className="mt-1">{message}</p>
        {details && <p className="mt-1 text-sm opacity-90">{details}</p>}
        {status === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            Try payment again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
} 