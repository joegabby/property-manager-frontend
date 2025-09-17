"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Play,
  Globe,
} from "lucide-react";
import { getProperty } from "@/services/property-services";
import { baseMediaUrl } from "@/lib/enums";
import { formatPrice } from "@/lib/utils";
import AgentCard from "@/components/ui/agentCard";
export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>({});
  const [loadingError, setLoadingError] = useState(false);

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
  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  if (loadingError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[14px] font-bold text-foreground mb-4">
            Property Not Found
          </h1>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }
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
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>

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
          </div>
          <div className="space-y-6">
            {/* Agent Card */}
            <AgentCard property={property} onInquire={fetchProperty} />
          </div>
        </div>
      </div>
    </div>
  );
  return <>{content}</>;
}
