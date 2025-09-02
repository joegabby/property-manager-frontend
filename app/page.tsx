"use client"
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
import { baseMediaUrl } from "@/lib/enums";

export default function HomePage() {
  const featuredProperties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: "$2,500/month",
      location: "Downtown District",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      image: "/modern-apartment-living.png",
      type: "For Rent",
      rating: 4.8,
      agent: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Luxury Family Home",
      price: "$850,000",
      location: "Suburban Heights",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      image: "/suburban-house.png",
      type: "For Sale",
      rating: 4.9,
      agent: "Michael Chen",
    },
    {
      id: 3,
      title: "Waterfront Condo",
      price: "$3,200/month",
      location: "Marina Bay",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      image: "/luxury-condo-interior.png",
      type: "For Rent",
      rating: 4.7,
      agent: "Emily Rodriguez",
    },
  ];
  const [properties, setProperties] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listingType, setlistingType] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search properties..."
                  className="pl-10 h-12 border-0 bg-muted/50"
                />
              </div>
              <Select>
                <SelectTrigger className="h-12 border-0 bg-muted/50">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-12 border-0 bg-muted/50">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500k">$0 - $500k</SelectItem>
                  <SelectItem value="500k-1m">$500k - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m+">$2M+</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              <Link href="/properties">Browse All Properties</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/register">List Your Property</Link>
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
            {properties.map((property: any) => (
              <Card
                key={property._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card"
              >
                <div className="relative overflow-hidden">
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
                  {/* <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  /> */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      {property.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-foreground"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {property.rating}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>

                  <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {property.price}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-muted-foreground text-sm mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} bath
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.sqft} sqft
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Agent: {property.agent.first_name}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Link href={`/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              Why Choose PropertyHub?
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
