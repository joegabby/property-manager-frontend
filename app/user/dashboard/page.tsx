"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {  } from "@/components/user/user-layout";
import {
  Heart,
  MessageSquare,
  Search,
  MapPin,
  Eye,
  Calendar,
  Bath,
  Bed,
  Filter,
  Square,
} from "lucide-react";
import Link from "next/link";
import { getAllProperties } from "@/services/property-services";
import {
  baseMediaUrl,
  NigerianStates,
  PropertyListingTypes,
} from "@/lib/enums";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import page from "@/app/page";
import { sendInquiry } from "@/services/user-services";
import { InquiryDto } from "@/lib/user-dto";

// Mock data for user

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listingType, setlistingType] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const fetchProperties = async () => {
    const filters = {
      state: locationFilter !== "all" ? locationFilter : null,
      page,
      limit: 9,
      key: searchTerm,
      listingType: listingType !== "all" ? listingType : null,
    };
    const getProperties = await getAllProperties(filters);
    setProperties(getProperties.data.body.data.items);
    setTotalPages(getProperties.data.body.data.pagination.totalPages);
    console.log("PROPERTIES", properties);
  };
  useEffect(() => {
    fetchProperties();
  }, [locationFilter, page, listingType, searchTerm]);
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      responded: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
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

  // const filteredProperties = mockAvailableProperties.filter((property: any) => {
  //   const matchesSearch =
  //     property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     property.location.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesLocation =
  //     locationFilter === "all" || property.state === locationFilter;
  //   const matchesType = typeFilter === "all" || property.type === typeFilter;

  //   let matchesPrice = true;
  //   if (priceFilter !== "all") {
  //     const price = Number.parseInt(property.price.replace(/[$,]/g, ""));
  //     switch (priceFilter) {
  //       case "under-400k":
  //         matchesPrice = price < 400000;
  //         break;
  //       case "400k-600k":
  //         matchesPrice = price >= 400000 && price <= 600000;
  //         break;
  //       case "600k-800k":
  //         matchesPrice = price >= 600000 && price <= 800000;
  //         break;
  //       case "over-800k":
  //         matchesPrice = price > 800000;
  //         break;
  //     }
  //   }

  //   return matchesSearch && matchesLocation && matchesType && matchesPrice;
  // });

  // const savedProperties = mockAvailableProperties.filter((p) => p.isSaved);

  const handleInquiry = (property: any) => {
    setSelectedProperty(property);
    setIsInquiryOpen(true);
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const handleSendInquiry = async () => {
    setSendingInquiry(true);
    const payload: InquiryDto = {
      property_id: selectedProperty._id,
      message: inquiryMessage,
    };
    const inquiry = await sendInquiry(payload);
    if (
      inquiry.data.statusCode === 200 &&
      inquiry.data.message === "SUCCESSFUL"
    ) {
      fetchProperties();
      setSendingInquiry(false);
      setIsInquiryOpen(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Find Your Perfect Property
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover amazing properties from trusted agents
              </p>
            </div>

            {/* Quick Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location, property type, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Location</SelectItem>
                    {Object.values(NigerianStates).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-400k">Under $400K</SelectItem>
                    <SelectItem value="400k-600k">$400K - $600K</SelectItem>
                    <SelectItem value="600k-800k">$600K - $800K</SelectItem>
                    <SelectItem value="over-800k">Over $800K</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PropertyListingTypes).map((types) => (
                      <SelectItem key={types} value={types}>
                        {types}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="sqft-desc">Largest First</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <Link href={`/properties/${property._id}?from=user`}>
                <Card
                  key={property._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="relative">
                    {(() => {
                      const firstImage = property.media.find(
                        (item: any) => item.type.toLowerCase() === "image"
                      );
                      return (
                        <img
                          src={
                            `${baseMediaUrl}/images/${firstImage?.url}` ||
                            "/placeholder.svg"
                          }
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                      );
                    })()}
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                    >
                      <Heart className="h-5 w-5" />
                    </Button> */}
                    <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
                      {property.state}
                    </Badge>
                    <Badge className="absolute bottom-3 right-3 bg-primary text-primary-foreground">
                      {property.listingType}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground line-clamp-2">
                        {property.title}
                      </h3>
                      <span className="text-2xl font-bold text-primary ml-2">
                        {formatPrice(property.price)}
                      </span>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{property.address}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <p>Status:</p>
                        <span>{property.status}</span>
                      </div>
                      <Button
                        size="sm"
                        className=""
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleInquiry(property);
                        }}
                        disabled={property.hasInquired}
                      >
                        {property.hasInquired ? "Inquired" : "Inquire"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {/* Inquiry Dialog */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Inquiry</DialogTitle>
            <DialogDescription>
              Send a message to the agent about {selectedProperty?.title}
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
              <Button onClick={() => handleSendInquiry()}>
                {sendingInquiry ? "Sending..." : "Send Inquiry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
