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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import {} from "@/components/user/user-layout";
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
  ArrowLeft,
  Home,
} from "lucide-react";
import Link from "next/link";
import { getAllProperties } from "@/services/property-services";
import {
  baseMediaUrl,
  NigerianStates,
  PropertyListingTypes,
  PropertyType,
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
import { formatPrice } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PriceRangeSlider } from "@/components/ui/min-max-slider";
import PreloaderSpinner from "@/components/ui/preloader";

// Mock data for user

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listingType, setListingType] = useState("");
  const [bedroomCount, setBedroomCount] = useState("0");
  const [bathroomCount, setBathroomCount] = useState("0");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProperties = async (filters: any) => {
    // const filters = {
    //   state: locationFilter !== "all" ? locationFilter : null,
    //   page,
    //   limit: 9,
    //   key: searchTerm,
    //   listingType: listingType !== "all" ? listingType : null,
    //   minPrice: priceRange[0],
    //   maxPrice: priceRange[1],
    // };
    setIsLoading(true)
    const getProperties = await getAllProperties(filters);
    setProperties(getProperties.data.body.data.items);
    setTotalPages(getProperties.data.body.data.pagination.totalPages);
    setIsLoading(false)
    console.log("PROPERTIES", properties);
  };

  // 1️⃣ Read from URL when page loads or query changes
  useEffect(() => {
    const state = searchParams.get("state") || "all";
    const listingTypeParam = searchParams.get("listingType") || "all";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 0;
    const key = searchParams.get("key") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    setLocationFilter(state);
    setListingType(listingTypeParam);
    // setPriceRange([minPrice, maxPrice]);
    setSearchTerm(key);
    setPage(pageParam);
    setUserLoggedIn(!!localStorage.getItem("token"));

    // Fetch each time query params change
    fetchProperties({
      state: state !== "all" ? state : null,
      listingType: listingTypeParam !== "all" ? listingTypeParam : null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      key: key || null,
      page: pageParam,
      orderBy: sortBy,
      bedrooms: bedroomCount,
      bathrooms: bathroomCount,
      limit: 9,
    });
  }, [searchParams]);

  // 2️⃣ Update URL when user changes a filter
  const updateQuery = (
    updates: Record<string, string | number | null>,
    resetPage: boolean = true
  ) => {
    const query = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === 0 || value === "") {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    if (resetPage) {
      query.set("page", "1"); // only reset if explicitly needed
    }

    router.push(`/user/properties?${query.toString()}`, { scroll: false });
  };

  // Example handlers
  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    updateQuery({ state: value }, true);
  };

  const handleListingTypeChange = (value: string) => {
    setListingType(value);
    updateQuery({ listingType: value });
  };
  const handlePageUpdate = (index: any) => {
    const newPage = index + 1;
    setPage(newPage);
    updateQuery({ page: newPage }, false);
  };
  const handlePageNext = () => {
    const newPage = page + 1;
    setPage(newPage);
    updateQuery({ page: newPage }, false);
  };
  const handlePagePrev = () => {
    const newPage = page - 1;
    setPage(newPage);
    updateQuery({ page: newPage }, false);
  };

  // const handlePriceChange = (min: number, max: number) => {
  //   setPriceRange([min, max]);
  //   updateQuery({ minPrice: min, maxPrice: max });
  // };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    updateQuery({ key: value });
  };
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
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
      fetchProperties({});
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
            {/* <Link
              href={"/"}
              className="h-8 px-3 has-[>svg]:px-2.5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home Page
            </Link> */}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    updateQuery({ key: value }, true);
                  }}
                  className="pl-12 h-12 text-lg border border-muted-foreground/50 bg-muted/50 text-muted-foreground"
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
              <div className="mb-[20px] grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"> */}
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    State
                  </p>
                  <Select
                    value={locationFilter}
                    onValueChange={(value) => handleLocationChange(value)}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
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
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Property Type
                  </p>
                  <Select
                    value={typeFilter}
                    onValueChange={(val) => {
                      setTypeFilter(val);
                      updateQuery({ listingType: val });
                    }}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>

                      {Object.values(PropertyType).map((types) => (
                        <SelectItem key={types} value={types}>
                          {types}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Listing Type
                  </p>
                  <Select
                    value={typeFilter}
                    onValueChange={(val) => {
                      setTypeFilter(val);
                      updateQuery({ listingType: val });
                    }}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>

                      {Object.values(PropertyListingTypes).map((types) => (
                        <SelectItem key={types} value={types}>
                          {types}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Order
                  </p>
                  <Select
                    value={sortBy}
                    onValueChange={(val) => {
                      setSortBy(val);
                      updateQuery({ orderBy: val });
                    }}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pAsc">Price: Low to High</SelectItem>
                      <SelectItem value="pDesc">Price: High to Low</SelectItem>
                      <SelectItem value="dAsc">Oldest First</SelectItem>
                      <SelectItem value="dDesc">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                <PriceRangeSlider
                  min={0}
                  max={1000000}
                  step={25000}
                  value={priceRange}
                  onValueChange={(val) => {
                    setPriceRange([val[0], val[1]]);
                    updateQuery({ minPrice: val[0], maxPrice: val[1] });
                  }}
                  className="lg:col-span-2"
                />
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Bedrooms
                  </p>
                  <Select
                    value={bedroomCount}
                    onValueChange={(value) => {
                      setBedroomCount(value);
                      updateQuery({ bedrooms: value });
                    }}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Default</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="items-center justify-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Bathrooms
                  </p>
                  <Select
                    value={bathroomCount}
                    onValueChange={(value) => {
                      setBathroomCount(value);
                      updateQuery({ bathrooms: value });
                    }}
                  >
                    <SelectTrigger className="w-full border border-muted-foreground/50 bg-muted/50 text-muted-foreground">
                      <SelectValue placeholder="Bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Default</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Grid */}
          {isLoading ? (
                <PreloaderSpinner />
              ) :(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <Link key={property._id} href={`/properties/${property._id}`}>
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
                    <p className="absolute top-3 right-3 ">
                      {getStatusBadge(property.status.toLowerCase())}
                    </p>

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
          </div>)
          }

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
                onClick={() => page > 1 && handlePagePrev()}
                className={`${page <= 1 && "hidden"}`}
              />
            </PaginationItem>
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageUpdate(i)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && handlePageNext()}
                className={`${page >= totalPages && "hidden"}`}
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
