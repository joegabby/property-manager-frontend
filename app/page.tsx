"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Star,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { getAllProperties } from "@/services/property-services";
import {
  baseMediaUrl,
  NigerianStates,
  PropertyListingTypes,
  PropertyType,
} from "@/lib/enums";
import { PriceRangeSlider } from "@/components/ui/min-max-slider";
import { formatPrice } from "@/lib/utils";
import { InquiryDto } from "@/lib/user-dto";
import { sendInquiry } from "@/services/user-services";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [properties, setProperties] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listingType, setListingType] = useState("");
  const [listingStatus, setListingStatus] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const router = useRouter();

  const fetchProperties = async () => {
    const filters = {
      state: locationFilter !== "all" ? locationFilter : null,
      page,
      limit: 9,
      key: searchTerm,
      listingType: listingType !== "all" ? listingType : null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    const getProperties = await getAllProperties(filters);
    setProperties(getProperties.data.body.data.items);
    setTotalPages(getProperties.data.body.data.pagination.totalPages);
    console.log("PROPERTIES", properties);
  };
  useEffect(() => {
    setUserLoggedIn(!!localStorage.getItem("token"));
    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams();

    if (locationFilter && locationFilter !== "all") {
      query.set("state", locationFilter);
    }

    if (listingType && listingType !== "all") {
      query.set("listingType", listingType);
    }

    if (priceRange[0]) {
      query.set("minPrice", String(priceRange[0]));
    }

    if (priceRange[1]) {
      query.set("maxPrice", String(priceRange[1]));
    }

    if (searchTerm.trim()) {
      query.set("key", searchTerm.trim());
    }

    // Always reset to first page when performing a new search
    query.set("page", "1");

    router.push(`/properties?${query.toString()}`);
  };

  const handleInquiry = (property: any) => {
    setSelectedProperty(property);
    setIsInquiryOpen(true);
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
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/luxury-condo-interior.png')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white py-[100px] px-[20px] max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Find Your Perfect
            <span className="text-secondary block">Property</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            Discover exceptional properties with our comprehensive platform
            connecting owners, agents, and buyers
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative border border-muted-foreground/50 rounded-[10px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-[20px] w-5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by keywords..."
                  className="pl-10 border-0 bg-muted/50 text-muted-foreground"
                />
              </div>
              <div className="relative border border-muted-foreground/50 rounded-[10px]">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full h-[20px] border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
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
              </div>
            </div>
            <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative border border-muted-foreground/50 rounded-[10px]">
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="w-full h-[20px] border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                    <SelectValue placeholder="Listing Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {Object.values(PropertyListingTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative border border-muted-foreground/50 rounded-[10px]">
                <Select value={listingStatus} onValueChange={setListingStatus}>
                  <SelectTrigger className="w-full h-[20px] border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.values(PropertyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="mt-[20px]">
                <PriceRangeSlider
                  min={0}
                  max={1000000}
                  step={25000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="lg:col-span-2"
                />
              </div>

              <Button
                onClick={handleSearch}
                size="lg"
                className="h-12 bg-primary hover:bg-primary/90"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {/* <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              <Link href="/properties">Browse All Properties</Link>
            </Button> */}
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="text-lg px-8 border-white/30 text-white hover:bg-secondary/20"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties available
              for sale and rent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {properties.slice(0, 6).map((property: any) => (
              // <Card
              //   key={property._id}
              //   className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card"
              // >
              //   <div className="relative overflow-hidden">
              //     {(() => {
              //       const firstImage = property.media.find(
              //         (item: any) => item.type.toLowerCase() === "image"
              //       );
              //       return (
              //         <img
              //           src={
              //             `${baseMediaUrl}/images/${firstImage?.url}` ||
              //             "/placeholder.svg"
              //           }
              //           alt={property.title}
              //           className="w-full h-48 object-cover"
              //         />
              //       );
              //     })()}
              //     {/* <img
              //       src={property.image || "/placeholder.svg"}
              //       alt={property.title}
              //       className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              //     /> */}
              //     <div className="absolute top-4 left-4">
              //       <Badge
              //         variant="secondary"
              //         className="bg-secondary text-secondary-foreground"
              //       >
              //         {property.type}
              //       </Badge>
              //     </div>
              //     <Button
              //       variant="ghost"
              //       size="icon"
              //       className="absolute top-4 right-4 bg-white/80 hover:bg-white text-foreground"
              //     >
              //       <Heart className="h-5 w-5" />
              //     </Button>
              //     <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
              //       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              //       <span className="text-sm font-medium">
              //         {property.rating}
              //       </span>
              //     </div>
              //   </div>

              //   <CardContent className="p-6">
              //     <div className="flex items-center text-muted-foreground text-sm mb-2">
              //       <MapPin className="h-4 w-4 mr-1" />
              //       {property.location}
              //     </div>

              //     <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
              //       {property.title}
              //     </h3>

              //     <div className="flex items-center justify-between mb-4">
              //       <span className="text-2xl font-bold text-primary">
              //         {formatPrice(property.price)}
              //       </span>
              //     </div>

              //     <div className="flex items-center space-x-4 text-muted-foreground text-sm mb-4">
              //       <div className="flex items-center">
              //         <Bed className="h-4 w-4 mr-1" />
              //         {property.bedrooms} bed
              //       </div>
              //       <div className="flex items-center">
              //         <Bath className="h-4 w-4 mr-1" />
              //         {property.bathrooms} bath
              //       </div>
              //       <div className="flex items-center">
              //         <Square className="h-4 w-4 mr-1" />
              //         {property.sqft} sqft
              //       </div>
              //     </div>

              //     <div className="flex items-center justify-between">
              //       <span className="text-sm text-muted-foreground">
              //         Agent: {property.agent.first_name}
              //       </span>
              //       <Button
              //         asChild
              //         size="sm"
              //         className="bg-primary hover:bg-primary/90"
              //       >
              //         <Link href={`/properties/${property.id}`}>
              //           View Details
              //         </Link>
              //       </Button>
              //     </div>
              //   </CardContent>
              // </Card>
              <Link
                key={property._id}
                href={`/properties/${property._id}`}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
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
                    <Badge className="absolute top-3 right-3 bg-secondary/50 text-primary-foreground">
                      {property.status}
                    </Badge>
                    <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
                      {property.state}
                    </Badge>
                    <Badge className="absolute bottom-3 right-3 bg-primary text-primary-foreground">
                      {property.listingType}
                    </Badge>
                  </div>

                  <CardContent className="">
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
                        <p className="text-sm text-muted-foreground/70">
                          Agent:{" "}
                        </p>
                        <span className="text-sm text-muted-foreground/70">
                          {property.agent?.first_name}{" "}
                          {property.agent?.last_name}
                        </span>
                      </div>
                      {userLoggedIn && (
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
                    <Button
                      variant="outline"
                      onClick={() => setIsInquiryOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => handleSendInquiry()}>
                      {sendingInquiry ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
            >
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Castle and Castle Properties?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive solutions for all your property needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-card p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                For Property Owners
              </h3>
              <p className="text-muted-foreground mb-6">
                Manage your properties efficiently and connect with qualified
                agents and potential buyers
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/register?role=owner">Get Started</Link>
              </Button>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-card p-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                For Agents
              </h3>
              <p className="text-muted-foreground mb-6">
                Professional tools for showcasing properties and managing client
                relationships effectively
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/register?role=agent">Join as Agent</Link>
              </Button>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-card p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                For Buyers & Renters
              </h3>
              <p className="text-muted-foreground mb-6">
                Find your perfect property with advanced search tools and direct
                agent communication
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
