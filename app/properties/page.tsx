// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Search, MapPin, Bed, Bath, Square, Heart, Filter, Calendar, Eye, MessageSquare } from "lucide-react"
// import { DialogHeader } from "@/components/ui/dialog"
// import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
// import { NigerianStates, PropertyListingTypes, baseMediaUrl } from "@/lib/enums"
// import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
// import { Label } from "recharts"
// import page from "../page"

// // Mock property data
// const mockProperties = [
//   {
//     id: 1,
//     title: "Modern Downtown Apartment",
//     price: 450000,
//     location: "Downtown",
//     type: "Apartment",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1200,
//     agent: {
//       name: "Sarah Johnson",
//       phone: "(555) 123-4567",
//       email: "sarah@propertyhub.com",
//     },
//     images: ["/modern-apartment-living.png"],
//     description: "Stunning modern apartment in the heart of downtown with city views and premium amenities.",
//     features: ["City Views", "Modern Kitchen", "In-unit Laundry", "Gym Access", "Rooftop Terrace"],
//     yearBuilt: 2020,
//     parking: "1 Space",
//     petPolicy: "Cats Allowed",
//     status: "available",
//   },
//   {
//     id: 2,
//     title: "Suburban Family Home",
//     price: 650000,
//     location: "Suburbs",
//     type: "House",
//     bedrooms: 4,
//     bathrooms: 3,
//     sqft: 2400,
//     agent: {
//       name: "Mike Chen",
//       phone: "(555) 987-6543",
//       email: "mike@propertyhub.com",
//     },
//     images: ["/suburban-house.png"],
//     description: "Spacious family home in quiet suburban neighborhood with large backyard and excellent schools.",
//     features: ["Large Backyard", "Updated Kitchen", "Master Suite", "2-Car Garage", "Near Schools"],
//     yearBuilt: 2015,
//     parking: "2-Car Garage",
//     petPolicy: "Pets Welcome",
//     status: "available",
//   },
//   {
//     id: 3,
//     title: "Luxury Condo",
//     price: 850000,
//     location: "Uptown",
//     type: "Condo",
//     bedrooms: 3,
//     bathrooms: 2,
//     sqft: 1800,
//     agent: {
//       name: "Lisa Park",
//       phone: "(555) 456-7890",
//       email: "lisa@propertyhub.com",
//     },
//     images: ["/luxury-condo-interior.png"],
//     description: "Elegant luxury condo with premium finishes and stunning views of the city skyline.",
//     features: ["City Skyline Views", "Premium Finishes", "Concierge Service", "Pool & Spa", "Wine Storage"],
//     yearBuilt: 2018,
//     parking: "2 Spaces",
//     petPolicy: "No Pets",
//     status: "available",
//   },
//   {
//     id: 4,
//     title: "Cozy Studio Apartment",
//     price: 320000,
//     location: "Midtown",
//     type: "Studio",
//     bedrooms: 1,
//     bathrooms: 1,
//     sqft: 600,
//     agent: {
//       name: "David Kim",
//       phone: "(555) 234-5678",
//       email: "david@propertyhub.com",
//     },
//     images: ["/cozy-studio-apartment.png"],
//     description: "Perfect starter home or investment property in vibrant Midtown location.",
//     features: ["Open Floor Plan", "Modern Appliances", "Walk to Transit", "Hardwood Floors", "Storage"],
//     yearBuilt: 2019,
//     parking: "Street Parking",
//     petPolicy: "Small Pets OK",
//     status: "available",
//   },
//   {
//     id: 5,
//     title: "Waterfront Townhouse",
//     price: 750000,
//     location: "Waterfront",
//     type: "Townhouse",
//     bedrooms: 3,
//     bathrooms: 3,
//     sqft: 2000,
//     agent: {
//       name: "Emma Wilson",
//       phone: "(555) 345-6789",
//       email: "emma@propertyhub.com",
//     },
//     images: ["/waterfront-townhouse.png"],
//     description: "Beautiful waterfront townhouse with private dock and stunning water views.",
//     features: ["Water Views", "Private Dock", "Fireplace", "Deck", "Marina Access"],
//     yearBuilt: 2017,
//     parking: "2 Spaces + Boat Slip",
//     petPolicy: "Pets Welcome",
//     status: "available",
//   },
//   {
//     id: 6,
//     title: "Historic Loft",
//     price: 580000,
//     location: "Arts District",
//     type: "Loft",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1500,
//     agent: {
//       name: "James Brown",
//       phone: "(555) 567-8901",
//       email: "james@propertyhub.com",
//     },
//     images: ["/historic-loft.png"],
//     description: "Unique historic loft in the trendy Arts District with exposed brick and high ceilings.",
//     features: ["Exposed Brick", "High Ceilings", "Artist Studios Nearby", "Historic Character", "Skylights"],
//     yearBuilt: 1925,
//     parking: "1 Space",
//     petPolicy: "Cats Only",
//     status: "available",
//   },
// ]
// const mockAvailableProperties = [
//   {
//     id: 1,
//     title: "Modern Downtown Apartment",
//     price: "$450,000",
//     location: "Downtown",
//     type: "Apartment",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1200,
//     agent: "Sarah Johnson",
//     image: "/modern-apartment-living.png",
//     isSaved: true,
//     hasInquired: true,
//   },
//   {
//     id: 2,
//     title: "Suburban Family Home",
//     price: "$650,000",
//     location: "Suburbs",
//     type: "House",
//     bedrooms: 4,
//     bathrooms: 3,
//     sqft: 2400,
//     agent: "Mike Chen",
//     image: "/suburban-house.png",
//     isSaved: false,
//     hasInquired: false,
//   },
//   {
//     id: 3,
//     title: "Luxury Condo",
//     price: "$850,000",
//     location: "Uptown",
//     type: "Condo",
//     bedrooms: 3,
//     bathrooms: 2,
//     sqft: 1800,
//     agent: "Lisa Park",
//     image: "/luxury-condo-interior.png",
//     isSaved: true,
//     hasInquired: false,
//   },
//   {
//     id: 4,
//     title: "Cozy Studio Apartment",
//     price: "$320,000",
//     location: "Midtown",
//     type: "Studio",
//     bedrooms: 1,
//     bathrooms: 1,
//     sqft: 600,
//     agent: "David Kim",
//     image: "/cozy-studio-apartment.png",
//     isSaved: false,
//     hasInquired: false,
//   },
//   {
//     id: 5,
//     title: "Waterfront Townhouse",
//     price: "$750,000",
//     location: "Waterfront",
//     type: "Townhouse",
//     bedrooms: 3,
//     bathrooms: 3,
//     sqft: 2000,
//     agent: "Emma Wilson",
//     image: "/waterfront-townhouse.png",
//     isSaved: false,
//     hasInquired: true,
//   },
//   {
//     id: 6,
//     title: "Historic Loft",
//     price: "$580,000",
//     location: "Arts District",
//     type: "Loft",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1500,
//     agent: "James Brown",
//     image: "/historic-loft.png",
//     isSaved: true,
//     hasInquired: false,
//   },
// ];

// const mockUserInquiries = [
//   {
//     id: 1,
//     property: "Modern Downtown Apartment",
//     agent: "Sarah Johnson",
//     message:
//       "I'm interested in scheduling a viewing. Is this property still available?",
//     date: "2024-02-15",
//     status: "responded",
//     response:
//       "Yes, it's still available! I can schedule a viewing for this weekend.",
//   },
//   {
//     id: 2,
//     property: "Waterfront Townhouse",
//     agent: "Emma Wilson",
//     message: "What are the HOA fees for this property?",
//     date: "2024-02-14",
//     status: "pending",
//     response: "",
//   },
//   {
//     id: 3,
//     property: "Luxury Condo",
//     agent: "Lisa Park",
//     message: "Is the seller open to negotiations on the price?",
//     date: "2024-02-13",
//     status: "responded",
//     response:
//       "The seller is open to reasonable offers. Let's discuss your budget.",
//   },
//   {
//     id: 4,
//     property: "Historic Loft",
//     agent: "James Brown",
//     message: "Can you provide more details about the building amenities?",
//     date: "2024-02-12",
//     status: "pending",
//     response: "",
//   },
// ];
// const mockUserStats = {
//   savedProperties: 8,
//   totalInquiries: 12,
//   viewedProperties: 45,
//   recentViews: 7,
// };
// export default function PropertiesPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [locationFilter, setLocationFilter] = useState("all")
//   const [priceFilter, setPriceFilter] = useState("all")
//   const [typeFilter, setTypeFilter] = useState("all")
//   const [bedroomFilter, setBedroomFilter] = useState("all")
//   const [sortBy, setSortBy] = useState("price-asc")

//   const filteredProperties = mockProperties.filter((property) => {
//     const matchesSearch =
//       property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.description.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesLocation = locationFilter === "all" || property.location === locationFilter
//     const matchesType = typeFilter === "all" || property.type === typeFilter
//     const matchesBedrooms = bedroomFilter === "all" || property.bedrooms.toString() === bedroomFilter

//     let matchesPrice = true
//     if (priceFilter !== "all") {
//       switch (priceFilter) {
//         case "under-400k":
//           matchesPrice = property.price < 400000
//           break
//         case "400k-600k":
//           matchesPrice = property.price >= 400000 && property.price <= 600000
//           break
//         case "600k-800k":
//           matchesPrice = property.price >= 600000 && property.price <= 800000
//           break
//         case "over-800k":
//           matchesPrice = property.price > 800000
//           break
//       }
//     }

//     return matchesSearch && matchesLocation && matchesType && matchesBedrooms && matchesPrice
//   })

//   const sortedProperties = [...filteredProperties].sort((a, b) => {
//     switch (sortBy) {
//       case "price-asc":
//         return a.price - b.price
//       case "price-desc":
//         return b.price - a.price
//       case "sqft-desc":
//         return b.sqft - a.sqft
//       case "newest":
//         return b.yearBuilt - a.yearBuilt
//       default:
//         return 0
//     }
//   })

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price)
//   }

//   return (
//     // <div className="min-h-screen bg-background">
//     //   {/* Header */}
//     //   <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
//     //     <div className="container mx-auto px-4">
//     //       <div className="text-center mb-8">
//     //         <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Property</h1>
//     //         <p className="text-xl text-muted-foreground">Discover amazing properties from trusted agents</p>
//     //       </div>

//     //       {/* Quick Search */}
//     //       <div className="max-w-2xl mx-auto">
//     //         <div className="relative">
//     //           <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
//     //           <Input
//     //             placeholder="Search by location, property type, or keywords..."
//     //             value={searchTerm}
//     //             onChange={(e) => setSearchTerm(e.target.value)}
//     //             className="pl-12 h-12 text-lg"
//     //           />
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   <div className="container mx-auto px-4 py-8">
//     //     {/* Filters */}
//     //     <Card className="mb-8">
//     //       <CardContent className="p-6">
//     //         <div className="flex items-center gap-2 mb-4">
//     //           <Filter className="h-5 w-5 text-muted-foreground" />
//     //           <h2 className="text-lg font-semibold">Filters</h2>
//     //         </div>
//     //         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
//     //           <Select value={locationFilter} onValueChange={setLocationFilter}>
//     //             <SelectTrigger>
//     //               <SelectValue placeholder="Location" />
//     //             </SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="all">All Locations</SelectItem>
//     //               <SelectItem value="Downtown">Downtown</SelectItem>
//     //               <SelectItem value="Suburbs">Suburbs</SelectItem>
//     //               <SelectItem value="Uptown">Uptown</SelectItem>
//     //               <SelectItem value="Midtown">Midtown</SelectItem>
//     //               <SelectItem value="Waterfront">Waterfront</SelectItem>
//     //               <SelectItem value="Arts District">Arts District</SelectItem>
//     //             </SelectContent>
//     //           </Select>

//     //           <Select value={priceFilter} onValueChange={setPriceFilter}>
//     //             <SelectTrigger>
//     //               <SelectValue placeholder="Price Range" />
//     //             </SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="all">All Prices</SelectItem>
//     //               <SelectItem value="under-400k">Under $400K</SelectItem>
//     //               <SelectItem value="400k-600k">$400K - $600K</SelectItem>
//     //               <SelectItem value="600k-800k">$600K - $800K</SelectItem>
//     //               <SelectItem value="over-800k">Over $800K</SelectItem>
//     //             </SelectContent>
//     //           </Select>

//     //           <Select value={typeFilter} onValueChange={setTypeFilter}>
//     //             <SelectTrigger>
//     //               <SelectValue placeholder="Property Type" />
//     //             </SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="all">All Types</SelectItem>
//     //               <SelectItem value="Apartment">Apartment</SelectItem>
//     //               <SelectItem value="House">House</SelectItem>
//     //               <SelectItem value="Condo">Condo</SelectItem>
//     //               <SelectItem value="Studio">Studio</SelectItem>
//     //               <SelectItem value="Townhouse">Townhouse</SelectItem>
//     //               <SelectItem value="Loft">Loft</SelectItem>
//     //             </SelectContent>
//     //           </Select>

//     //           <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
//     //             <SelectTrigger>
//     //               <SelectValue placeholder="Bedrooms" />
//     //             </SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="all">Any Bedrooms</SelectItem>
//     //               <SelectItem value="1">1 Bedroom</SelectItem>
//     //               <SelectItem value="2">2 Bedrooms</SelectItem>
//     //               <SelectItem value="3">3 Bedrooms</SelectItem>
//     //               <SelectItem value="4">4+ Bedrooms</SelectItem>
//     //             </SelectContent>
//     //           </Select>

//     //           <Select value={sortBy} onValueChange={setSortBy}>
//     //             <SelectTrigger>
//     //               <SelectValue placeholder="Sort By" />
//     //             </SelectTrigger>
//     //             <SelectContent>
//     //               <SelectItem value="price-asc">Price: Low to High</SelectItem>
//     //               <SelectItem value="price-desc">Price: High to Low</SelectItem>
//     //               <SelectItem value="sqft-desc">Largest First</SelectItem>
//     //               <SelectItem value="newest">Newest First</SelectItem>
//     //             </SelectContent>
//     //           </Select>

//     //           <div className="flex items-center">
//     //             <span className="text-sm text-muted-foreground">{sortedProperties.length} properties found</span>
//     //           </div>
//     //         </div>
//     //       </CardContent>
//     //     </Card>

//     //     {/* Property Grid */}
//     //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//     //       {sortedProperties.map((property) => (
//     //         <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
//     //           <div className="relative">
//     //             <img
//     //               src={property.images[0] || "/placeholder.svg"}
//     //               alt={property.title}
//     //               className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//     //             />
//     //             <Button
//     //               variant="ghost"
//     //               size="icon"
//     //               className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
//     //             >
//     //               <Heart className="h-5 w-5" />
//     //             </Button>
//     //             <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
//     //               {property.status === "available" ? "Available" : "Sold"}
//     //             </Badge>
//     //           </div>

//     //           <CardContent className="p-6">
//     //             <div className="flex justify-between items-start mb-3">
//     //               <h3 className="text-xl font-bold text-foreground line-clamp-2">{property.title}</h3>
//     //               <span className="text-2xl font-bold text-primary ml-2">{formatPrice(property.price)}</span>
//     //             </div>

//     //             <div className="flex items-center text-muted-foreground mb-4">
//     //               <MapPin className="h-4 w-4 mr-2" />
//     //               <span>{property.location}</span>
//     //             </div>

//     //             <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
//     //               <div className="flex items-center gap-1">
//     //                 <Bed className="h-4 w-4" />
//     //                 <span>{property.bedrooms} bed</span>
//     //               </div>
//     //               <div className="flex items-center gap-1">
//     //                 <Bath className="h-4 w-4" />
//     //                 <span>{property.bathrooms} bath</span>
//     //               </div>
//     //               <div className="flex items-center gap-1">
//     //                 <Square className="h-4 w-4" />
//     //                 <span>{property.sqft.toLocaleString()} sqft</span>
//     //               </div>
//     //             </div>

//     //             <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.description}</p>

//     //             <div className="flex items-center justify-between">
//     //               <div className="text-sm text-muted-foreground">Agent: {property.agent.name}</div>
//     //               <Link href={`/properties/${property.id}`}>
//     //                 <Button>View Details</Button>
//     //               </Link>
//     //             </div>
//     //           </CardContent>
//     //         </Card>
//     //       ))}
//     //     </div>

//     //     {sortedProperties.length === 0 && (
//     //       <div className="text-center py-12">
//     //         <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
//     //         <p className="text-muted-foreground">Try adjusting your search criteria</p>
//     //       </div>
//     //     )}
//     //   </div>
//     // </div>
//     <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
//           <p className="text-muted-foreground">Find your perfect property</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Saved Properties
//               </CardTitle>
//               <Heart className="h-4 w-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">
//                 {mockUserStats.savedProperties}
//               </div>
//               <p className="text-xs text-muted-foreground">In your favorites</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Inquiries
//               </CardTitle>
//               <MessageSquare className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">
//                 {mockUserStats.totalInquiries}
//               </div>
//               <p className="text-xs text-muted-foreground">Sent to agents</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Properties Viewed
//               </CardTitle>
//               <Eye className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">
//                 {mockUserStats.viewedProperties}
//               </div>
//               <p className="text-xs text-muted-foreground">All time</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Recent Views
//               </CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-primary">
//                 {mockUserStats.recentViews}
//               </div>
//               <p className="text-xs text-muted-foreground">This week</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content Tabs */}
//         <Tabs defaultValue="browse" className="space-y-4">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="browse">Browse Properties</TabsTrigger>
//             {/* <TabsTrigger value="saved">Saved Properties</TabsTrigger> */}
//             <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
//           </TabsList>

//           {/* Browse Properties Tab */}
//           <TabsContent value="browse" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Available Properties</CardTitle>
//                 <CardDescription>Discover your next home</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Search and Filters */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search properties..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                   <Select
//                     value={locationFilter}
//                     onValueChange={setLocationFilter}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Location" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Locations</SelectItem>
//                       {Object.values(NigerianStates).map((state) => (
//                         <SelectItem key={state} value={state}>
//                           {state}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select value={priceFilter} onValueChange={setPriceFilter}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Price Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Prices</SelectItem>
//                       <SelectItem value="under-400k">Under $400K</SelectItem>
//                       <SelectItem value="400k-600k">$400K - $600K</SelectItem>
//                       <SelectItem value="600k-800k">$600K - $800K</SelectItem>
//                       <SelectItem value="over-800k">Over $800K</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select value={listingType} onValueChange={setlistingType}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Property Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Listing Types</SelectItem>
//                       {Object.values(PropertyListingTypes).map((types) => (
//                         <SelectItem key={types} value={types}>
//                           {types}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Property Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {properties.map((property: any) => (
//                     <Card
//                       key={property._id}
//                       className="overflow-hidden hover:shadow-lg transition-shadow"
//                     >
//                       <div className="relative">
//                         {(() => {
//                           const firstImage = property.media.find(
//                             (item: any) => item.type === "Image"
//                           );
//                           return (
//                             <img
//                               src={
//                                 `${baseMediaUrl}/images/${firstImage?.url}` ||
//                                 "/placeholder.svg"
//                               }
//                               alt={property.title}
//                               className="w-full h-48 object-cover"
//                             />
//                           );
//                         })()}

//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className={`absolute top-2 right-2 ${
//                             property.isSaved ? "text-red-500" : "text-white"
//                           } hover:text-red-500`}
//                         >
//                           <Heart
//                             className={`h-5 w-5 ${
//                               property.isSaved ? "fill-current" : ""
//                             }`}
//                           />
//                         </Button>
//                       </div>
//                       <CardContent className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-lg">
//                             {property.title}
//                           </h3>
//                           <span className="text-lg font-bold text-primary">
//                             {property.price}
//                           </span>
//                         </div>
//                         <div className="flex items-center text-muted-foreground mb-2">
//                           <MapPin className="h-4 w-4 mr-1" />
//                           <span className="text-sm">{property.address}</span>
//                         </div>
//                         {/* <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
//                           <span>{property.bedrooms} bed</span>
//                           <span>{property.bathrooms} bath</span>
//                           <span>{property.sqft} sqft</span>
//                         </div> */}
//                         <p className="text-sm text-muted-foreground mb-3">
//                           Agent:{" "}
//                           {`${property.agent.first_name} ${property.agent.last_name}`}
//                         </p>
//                         <div className="flex gap-2">
//                           {/* <Button
//                             variant="outline"
//                             size="sm"
//                             className="flex-1 bg-transparent"
//                           >
//                             View Details
//                           </Button> */}
//                           <Link href={`/properties/${property._id}`}>
//                             <Button>View Details</Button>
//                           </Link>
//                           <Button
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => handleInquiry(property)}
//                             disabled={property.hasInquired}
//                           >
//                             {property.hasInquired ? "Inquired" : "Inquire"}
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//               <Pagination>
//                 <PaginationContent>
//                   {/* Previous */}
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => page > 1 && setPage(page - 1)}
//                     />
//                   </PaginationItem>

//                   {/* Page Numbers */}
//                   {[...Array(totalPages)].map((_, i) => (
//                     <PaginationItem key={i}>
//                       <PaginationLink
//                         isActive={page === i + 1}
//                         onClick={() => setPage(i + 1)}
//                       >
//                         {i + 1}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}

//                   {/* Next */}
//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => page < totalPages && setPage(page + 1)}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </Card>
//           </TabsContent>

//           {/* Saved Properties Tab */}
//           {/* <TabsContent value="saved" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Saved Properties</CardTitle>
//                 <CardDescription>Your favorite properties</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {savedProperties.map((property) => (
//                     <Card
//                       key={property.id}
//                       className="overflow-hidden hover:shadow-lg transition-shadow"
//                     >
//                       <div className="relative">
//                         <img
//                           src={property.image || "/placeholder.svg"}
//                           alt={property.title}
//                           className="w-full h-48 object-cover"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="absolute top-2 right-2 text-red-500 hover:text-red-600"
//                         >
//                           <Heart className="h-5 w-5 fill-current" />
//                         </Button>
//                       </div>
//                       <CardContent className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-lg">
//                             {property.title}
//                           </h3>
//                           <span className="text-lg font-bold text-primary">
//                             {property.price}
//                           </span>
//                         </div>
//                         <div className="flex items-center text-muted-foreground mb-2">
//                           <MapPin className="h-4 w-4 mr-1" />
//                           <span className="text-sm">{property.location}</span>
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
//                           <span>{property.bedrooms} bed</span>
//                           <span>{property.bathrooms} bath</span>
//                           <span>{property.sqft} sqft</span>
//                         </div>
//                         <div className="flex gap-2">
//                           {/* <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                             View Details
//                           </Button> */}

//                           {/* <Link href={`/properties/${property.id}`}>
//                             <Button>View Details</Button>
//                           </Link>
//                           <Button
//                             size="sm"
//                             className="flex-1"
//                             onClick={() => handleInquiry(property)}
//                             disabled={property.hasInquired}
//                           >
//                             {property.hasInquired ? "Inquired" : "Inquire"}
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent> */} 

//           {/* Inquiries Tab */}
//           <TabsContent value="inquiries" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>My Inquiries</CardTitle>
//                 <CardDescription>
//                   Track your property inquiries and responses
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {mockUserInquiries.map((inquiry) => (
//                     <Card key={inquiry.id} className="p-4">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h4 className="font-medium text-foreground">
//                             {inquiry.property}
//                           </h4>
//                           <p className="text-sm text-muted-foreground">
//                             To: {inquiry.agent} • {inquiry.date}
//                           </p>
//                         </div>
//                         {getStatusBadge(inquiry.status)}
//                       </div>
//                       <div className="space-y-3">
//                         <div>
//                           <p className="text-sm font-medium text-foreground mb-1">
//                             Your Message:
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {inquiry.message}
//                           </p>
//                         </div>
//                         {inquiry.response && (
//                           <div>
//                             <p className="text-sm font-medium text-foreground mb-1">
//                               Agent Response:
//                             </p>
//                             <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
//                               {inquiry.response}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         {/* Inquiry Dialog */}
//         <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Send Inquiry</DialogTitle>
//               <DialogDescription>
//                 Send a message to the agent about {selectedProperty?.title}
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="message">Your Message</Label>
//                 <textarea
//                   id="message"
//                   placeholder="I'm interested in this property. Could you provide more information?"
//                   rows={4}
//                   value={inquiryMessage}
//                   onChange={(e) => setInquiryMessage(e.target.value)}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
//               <div className="flex justify-end gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsInquiryOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={() => handleSendInquiry()}>
//                   Send Inquiry
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//   )
// }
