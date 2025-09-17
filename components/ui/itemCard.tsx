import { MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { baseMediaUrl } from "@/lib/enums";
import {
  formatPhoneNumber,
  formatPrice,
  generatePropertyInquiryMessage,
} from "@/lib/utils";
import { useState } from "react";
import { InquiryDto } from "@/lib/user-dto";
import { sendInquiry, whatsappNotification } from "@/services/user-services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { FaWhatsapp } from "react-icons/fa";

// Types (adjust as needed to your schema)
export default function ItemCard({ property , onInquire}: any) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const user = useUser();
  const handleSendInquiry = async (propertyId: string) => {
    setSendingInquiry(true);
    const payload: InquiryDto = {
      property_id: propertyId,
      message: inquiryMessage,
    };
    const inquiry = await sendInquiry(payload);
    if (
      inquiry.data.statusCode === 200 &&
      inquiry.data.message === "SUCCESSFUL"
    ) {
      // fetchProperties({});
      setSendingInquiry(false);
      setIsInquiryOpen(false);
      onInquire()
      const agentName = `${property.agent?.first_name} ${property.agent?.last_name}`;
      // const rootDomain = window.location.origin;
      // const propertyLink = `${rootDomain}/properties/${property._id}`
      whatsappNotification(
        generatePropertyInquiryMessage(
          agentName,
          property.title,
          property.address,
          property.price,
          property.status
        ),
        formatPhoneNumber(property.agent?.phone)
      );
    }
  };
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow   -800",
      available: "bg-secondary/50 text-primary-foreground",
      sold: "bg-red-500/70 text-primary-foreground",
    } as const;

    return (
      <Badge
        className={
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  return (
    <>
      <Link href={`properties/${property._id}`}>
        <Card className="pt-0 overflow-hidden hover:shadow-lg transition-shadow group">
          <div className="relative">
            {(() => {
              const firstImage = property.media.find(
                (item: any) => item.type.toLowerCase() === "image"
              );
              return (
                <img
                  src={
                    firstImage
                      ? `${baseMediaUrl}/images/${firstImage.url}`
                      : "/placeholder.svg"
                  }
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              );
            })()}
            <p className="absolute top-3 right-3">
              {getStatusBadge(property.status.toLowerCase())}
            </p>

            <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
              {property.state}
            </Badge>
            <Badge className="absolute bottom-3 right-3 bg-primary text-primary-foreground">
              {property.listingType}
            </Badge>
          </div>

          <CardContent>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[12px] font-bold text-foreground line-clamp-2">
                {property.title}
              </h3>
              <span className="text-[14px] font-bold text-primary ml-2">
                {formatPrice(property.price)}
              </span>
            </div>

            <div className="text-[12px] flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{property.address}</span>
            </div>
             <div className="flex items-center justify-between">
            <div className="flex items-center text-muted-foreground">
              <p className="mr-[5px] text-sm text-muted-foreground/70">By:</p>
              <span className="text-sm text-muted-foreground/70">
                {property.agent?.first_name} {property.agent?.last_name}
              </span>
            </div>
            {user &&
              (property.hasInquired && property?.agent?.phone ? (
                <Link
                  href={`https://wa.me/${property?.agent?.phone.replace(
                    /^0/,
                    "234"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click if wrapped in a parent
                  }}
                  className="gap-2 text-[12px] flex items-center text-green-600 hover:underline"
                >
                  <FaWhatsapp size={28} />
                  {/* <span>Follow up on WhatsApp</span> */}
                </Link>
                
              ) : (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault(); // stop link navigation
                    e.stopPropagation(); // stop bubbling to parent
                    setIsInquiryOpen(true);
                  }}
                  disabled={property.hasInquired}
                >
                  {property.hasInquired ? "Inquired" : "Inquire"}
                </Button>
              ))}
          </div>
          </CardContent>
         
        </Card>
      </Link>

      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Inquiry</DialogTitle>
            <DialogDescription>
              Send a message to the agent about {property?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <textarea
                id="message"
                placeholder="I'm interested in this property. Could you provide more information?"
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsInquiryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSendInquiry(property._id)}>
                {sendingInquiry ? "Sending..." : "Send Inquiry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
