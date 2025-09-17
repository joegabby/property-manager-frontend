import { baseMediaUrl } from "@/lib/enums";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@radix-ui/react-dialog";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InquiryDto, inquirySchema } from "@/lib/user-dto";
import { sendInquiry, whatsappNotification } from "@/services/user-services";
import { formatPhoneNumber, generatePropertyInquiryMessage } from "@/lib/utils";
import { Badge } from "./badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaWhatsapp } from "react-icons/fa";
import { Form } from "./form";

export default function AgentCard({ property,onInquire }: any) {
  const user = useUser();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSendInquiry = async () => {
    setSendingInquiry(true);
    const payload: InquiryDto = {
      property_id: property._id,
      message: inquiryMessage,
    };
    const inquiry = await sendInquiry(payload);
    if (
      inquiry.data.statusCode === 200 &&
      inquiry.data.message === "SUCCESSFUL"
    ) {
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
  const verifiedDoc = useMemo(() => {
    if (Array.isArray(property.agent?.documents)) {
      return (
        property.agent?.documents.find(
          (doc: any) => doc.status === "APPROVED"
        ) || null
      );
    }
    return null;
  }, []);

  const inquiryForm = useForm<InquiryDto>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      property_id: "",
      message: "",
    },
  });
  if (!mounted) {
    // Render placeholder or null to match SSR consistently
    return null;
  }
  return (
    <>
      {mounted && property.agent?._id === user?.id ? (
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
            <CardDescription>This property was uploaded by you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-[12px] font-bold text-primary">
                  {`${property.agent?.first_name} ${property.agent?.last_name}`}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.agent?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.agent?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
            <CardDescription>
              Get in touch with the listing agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[12px] font-bold text-primary">
                      {`${property.agent?.first_name} ${property.agent?.last_name}`}
                    </span>
                  </div>
                </div> */}
            <div className="flex items-center justify-center space-x-4">
              <Avatar className="h-[100px] w-[100px] flex border-4 rounded-full border-grey-600 justify-center items-center">
                <AvatarImage
                  src={`${baseMediaUrl}/others/${property.agent?.profile_pic}`}
                  className="rounded-full"
                />
                <AvatarFallback className="font-bold flex items-center justify-center text-center text-lg">
                  {property.agent?.first_name?.charAt(0).toUpperCase()}{" "}
                  {property.agent?.last_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* <div className="text-center"> */}
            <div className="flex flex-col items-center justify-center mx-auto mb-3">
              <div className="font-bold text-[16px] mb-[10px] text-primary">
                {`${property.agent?.first_name} ${property.agent?.last_name}`}
              </div>
              {user && (
                <div>
                  {verifiedDoc ? (
                    <div className="flex flex-col items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Verified Agent
                      </Badge>
                      <Link
                        className="underline mt-[10px] hover:text-blue-800"
                        target="_blank"
                        href={`${baseMediaUrl}/identifications/${verifiedDoc?.url}`}
                      >
                        View Identification Document
                      </Link>
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Unverified Agent
                    </Badge>
                  )}
                </div>
              )}
            </div>
            {/* </div> */}
            {user ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.agent?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.agent?.email}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  {property?.hasInquired ? (
                    <>
                    <i className="text-[12px] text-primary-background">You have already Inquired!</i>
                      <Link
                        href={`https://wa.me/${property?.agent?.phone?.replace(
                          /^0/,
                          "234"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click if wrapped in a parent
                        }}
                        className="bg-green-600 rounded-[10px] p-[10px] flex items-center justify-center gap-2 text-[12px] flex items-center text-white hover:underline"
                      >
                        <FaWhatsapp size={28} />
                        <span>Follow up on WhatsApp</span>
                      </Link>
                    </>
                  ) : (
                    <Dialog
                      open={isInquiryOpen}
                      onOpenChange={setIsInquiryOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Make an Inquiry
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Inquiry</DialogTitle>
                          <DialogDescription>
                            Send a message to {property.agent?.first_name} about{" "}
                            {property.title}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...inquiryForm}>
                          <form
                            onSubmit={inquiryForm.handleSubmit(
                              handleSendInquiry
                            )}
                            className="space-y-4"
                          >
                            <div className="flex flex-col gap-4">
                              <textarea
                                id="message"
                                placeholder="I'm interested in this property. Could you provide more information?"
                                rows={4}
                                value={inquiryMessage}
                                onChange={(e) =>
                                  setInquiryMessage(e.target.value)
                                }
                                className="w-full border rounded p-2"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsInquiryOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={() => handleSendInquiry()}>
                                  {sendingInquiry
                                    ? "Sending..."
                                    : "Send Inquiry"}
                                </Button>
                              </div>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <p>Login to view agent's Profile</p>
                <Link
                  href={"/login"}
                  className="w-full mt-[10px] text-white h-10 px-3 has-[>svg]:px-2.5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-primary shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                >
                  Login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
