import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) return "234" + cleaned.slice(1);
  if (cleaned.startsWith("234")) return cleaned;

  return cleaned;
}

export function generatePropertyInquiryMessage(
  agentName: string,
  title: string,
  address: string,
  price: number,
  status: string
): string {
  return `Hello ${agentName},

I would like to make an inquiry about a property with the following details:

- Title: ${title}
- Address: ${address}
- Price: ₦${price.toLocaleString()}
- Status: ${status}

Could you please provide more information and let me know the next steps for viewing or securing this property?

Thank you.`;
}
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM do, yyyy");
}
