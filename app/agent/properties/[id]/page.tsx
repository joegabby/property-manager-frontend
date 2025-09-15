"use client";
import { use, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { propertyInquirySchema, type PropertyInquiryFormData } from "@/lib/validations"
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Car,
  PawPrint,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Play,
  School,
  ShoppingCart,
  Coffee,
  Hospital,
  Globe,
} from "lucide-react";
import { getProperty } from "@/services/property-services";
import { InquiryDto, inquirySchema } from "@/lib/user-dto";
import { sendInquiry, whatsappNotification } from "@/services/user-services";
import { baseMediaUrl } from "@/lib/enums";
import { UserLayout } from "@/components/user/user-layout";
import { AgentLayout } from "@/components/agent/agent-layout";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  formatPhoneNumber,
  formatPrice,
  generatePropertyInquiryMessage,
} from "@/lib/utils";
export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>({});
  const [loadingError, setLoadingError] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const verifiedDoc = useMemo(() => {
    if (Array.isArray(property.agent?.documents)) {
      return (
        property.agent?.documents.find(
          (doc: any) => doc.status === "APPROVED"
        ) || null
      );
    }
    return null;
  }, [property]);
  useEffect(() => {
    setUserLoggedIn(!!localStorage.getItem("token"));

    const fetchProperty = async () => {
      if (!params.id) return;
      try {
        const getOneProperty = await getProperty(params.id as string);
        const propertyData = getOneProperty?.data?.body?.data;

        if (!propertyData) {
          setLoadingError(true);
        } else {
          setProperty(propertyData);
          setLoadingError(false);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setLoadingError(true);
      }
    };

    fetchProperty();
  }, [params.id]);
  const inquiryForm = useForm<InquiryDto>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      property_id: "",
      message: "",
    },
  });

  if (loadingError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Property Not Found
          </h1>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onInquirySubmit = (data: InquiryDto) => {
    console.log("Inquiry submitted:", data);
    setIsInquiryOpen(false);
    inquiryForm.reset();
  };

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
  const mediaItems = property?.media ?? [];
  console.log(mediaItems);
  const totalItems = mediaItems.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalItems);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const content = (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                {property?.media?.[currentImageIndex]?.type?.toLowerCase() ===
                "video" ? (
                  <div className="relative w-full h-96 bg-black flex items-center justify-center">
                    <video
                      src={
                        property?.media?.[currentImageIndex]?.url
                          ? `${baseMediaUrl}/videos/${property.media[currentImageIndex].url}`
                          : "/placeholder.svg"
                      }
                      className="w-full h-full"
                      controls
                      poster="/video-thumbnail.png"
                    />
                  </div>
                ) : (
                  <img
                    src={
                      property?.media?.[currentImageIndex]?.url
                        ? `${baseMediaUrl}/images/${property.media[currentImageIndex].url}`
                        : "/placeholder.svg"
                    }
                    alt={
                      property?.title
                        ? `${property.title} - Image ${currentImageIndex + 1}`
                        : `Image ${currentImageIndex + 1}`
                    }
                    className="w-full h-96 object-cover"
                  />
                )}

                {/* Navigation Arrows */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Action Buttons */}
                {/* <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 hover:bg-white"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div> */}

                {/* Status Badge */}
                <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
                  {property.status}
                </Badge>

                {/* Media Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {totalItems}
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {mediaItems.map((_: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
                  {property.media?.map((mediaItem: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                        index === currentImageIndex
                          ? "border-primary scale-105"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={
                          mediaItem.type.toLowerCase() === "video"
                            ? `/placeholder.svg`
                            : `${baseMediaUrl}/images/${mediaItem.url}` ||
                              "/placeholder.svg"
                        }
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {mediaItem.type.toLowerCase() === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">
                      {property.title}
                    </CardTitle>

                    <div className="mt-[20px] flex gap-2">
                      <Badge className="bg-secondary/30 text-primary-background">
                        {property.propertyType}
                      </Badge>
                      <Badge className="bg-primary/30 text-primary-background">
                        {property.propertySubType}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Listed Price
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-muted-foreground mb-2">
                  <Globe className="h-5 w-5 mr-2" />
                  <span>{property.state}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address}</span>
                </div>
                {/* <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div> */}
              </CardContent>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-backgorund" />
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{property.bedrooms} x</div>
                      <div className="text-sm text-muted-foreground">
                        Bedrooms
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-backgorund" />
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{property.baths} x</div>
                      <div className="text-sm text-muted-foreground">
                        Bathrooms
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature: any, index: any) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="justify-center py-2"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* <Card>
              <CardHeader>
                <CardTitle>Nearby Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.nearbyAmenities.map((amenity: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="text-primary">
                        {getAmenityIcon(amenity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{amenity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {amenity.distance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Additional Details */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Parking</div>
                      <div className="text-sm text-muted-foreground">
                        {property.parking}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PawPrint className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Pet Policy</div>
                      <div className="text-sm text-muted-foreground">
                        {property.petPolicy}
                      </div>
                    </div>
                  </div>
                  {property.hoa && property.hoa !== "N/A" && (
                    <div>
                      <div className="font-medium">HOA Fees</div>
                      <div className="text-sm text-muted-foreground">
                        {property.hoa}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">Property Tax</div>
                    <div className="text-sm text-muted-foreground">
                      {property.propertyTax}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* {similarProperties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Properties</CardTitle>
                  <CardDescription>
                    Other {property.type.toLowerCase()}s you might like
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarProperties.map((similar) => (
                      <Link key={similar.id} href={`/properties/${similar.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            <img
                              src={similar.images[0] || "/placeholder.svg"}
                              alt={similar.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">
                              {similar.title}
                            </h3>
                            <p className="text-2xl font-bold text-primary mb-2">
                              {formatPrice(similar.price)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{similar.bedrooms} bed</span>
                              <span>{similar.bathrooms} bath</span>
                              <span>{similar.sqft.toLocaleString()} sqft</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            {property.agent?._id === user?.id ? (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Agent</CardTitle>
                  <CardDescription>
                    This property was uploaded by you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-primary">
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
                    <span className="text-xl font-bold text-primary">
                      {`${property.agent?.first_name} ${property.agent?.last_name}`}
                    </span>
                  </div>
                </div> */}
                  <div className="flex items-center justify-center space-x-4">
                    <Avatar className="h-[100px] w-[100px] flex border-4 rounded-full border-grey-600">
                      <AvatarImage
                        src={`${baseMediaUrl}/others/${property.agent?.profile_pic}`}
                        className="rounded-full"
                      />
                      <AvatarFallback className="text-lg">
                        {property.agent?.first_name?.charAt(0).toUpperCase()}{" "}
                        {property.agent?.last_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* <div className="text-center"> */}
                  <div className="flex flex-col items-center justify-center mx-auto mb-3">
                    <div className="text-xl text-primary">
                      {`${property.agent?.first_name} ${property.agent?.last_name}`}
                    </div>
                    {userLoggedIn && (
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
                  {userLoggedIn ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {property.agent?.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {property.agent?.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        {/* <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Agent
                    </Button> */}
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
                                Send a message to {property.agent?.first_name}{" "}
                                about {property.title}
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...inquiryForm}>
                              <form
                                onSubmit={inquiryForm.handleSubmit(
                                  handleSendInquiry
                                )}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  {/* <FormField
                                control={inquiryForm.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="I'm interested in this property. Could you provide more information?"
                                        rows={4}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              /> */}
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

            {/* Quick Stats */}
            {/* <Card>
                <CardHeader>
                  <CardTitle>Property Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Price per Sq Ft
                    </span>
                    <span className="font-medium">
                      {formatPrice(Math.round(property.price / property.sqft))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        property.status === "available"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {property.status === "available" ? "Available" : "Sold"}
                    </Badge>
                  </div>
                </CardContent>
              </Card> */}
          </div>
        </div>
      </div>
    </div>
  );

  // if (searchParams.get("from") === "agent") {
  //   return <AgentLayout>{content}</AgentLayout>;
  // }
  // if (searchParams.get("from") === "user") {
  //   return <UserLayout>{content}</UserLayout>;
  // }

  return <>{content}</>;
}
