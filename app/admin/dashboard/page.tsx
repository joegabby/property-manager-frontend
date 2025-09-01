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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  } from "@/components/admin/admin-layout";
import {
  Users,
  Building,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getAllAgents } from "@/services/admin-services";
import page from "@/app/page";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import Link from "next/link";

// Mock data
const mockStats = {
  totalUsers: 1247,
  totalAgents: 89,
  totalProperties: 456,
  pendingDocuments: 23,
  totalInquiries: 178,
  monthlyGrowth: 12.5,
};

const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "agent",
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "owner",
    status: "pending",
    joinDate: "2024-02-01",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "buyer",
    status: "active",
    joinDate: "2024-02-05",
  },
];

const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    agent: "Sarah Johnson",
    price: "$450,000",
    status: "approved",
    location: "Downtown",
    type: "Apartment",
  },
  {
    id: 2,
    title: "Suburban Family Home",
    agent: "Mike Chen",
    price: "$650,000",
    status: "pending",
    location: "Suburbs",
    type: "House",
  },
  {
    id: 3,
    title: "Luxury Condo",
    agent: "Lisa Park",
    price: "$850,000",
    status: "approved",
    location: "Uptown",
    type: "Condo",
  },
  {
    id: 4,
    name: "Commercial Office Space",
    agent: "David Kim",
    price: "$1,200,000",
    status: "rejected",
    location: "Business District",
    type: "Commercial",
  },
];

const mockDocuments = [
  {
    id: 1,
    property: "Modern Downtown Apartment",
    agent: "Sarah Johnson",
    type: "Property Deed",
    status: "pending",
    uploadDate: "2024-02-10",
  },
  {
    id: 2,
    property: "Suburban Family Home",
    agent: "Mike Chen",
    type: "Insurance Certificate",
    status: "approved",
    uploadDate: "2024-02-08",
  },
  {
    id: 3,
    property: "Luxury Condo",
    agent: "Lisa Park",
    type: "Property Inspection",
    status: "pending",
    uploadDate: "2024-02-12",
  },
  {
    id: 4,
    property: "Commercial Office Space",
    agent: "David Kim",
    type: "Zoning Permit",
    status: "rejected",
    uploadDate: "2024-02-05",
  },
];

const mockInquiries = [
  {
    id: 1,
    property: "Modern Downtown Apartment",
    inquirer: "John Smith",
    agent: "Sarah Johnson",
    status: "pending",
    date: "2024-02-15",
  },
  {
    id: 2,
    property: "Suburban Family Home",
    inquirer: "Emily Davis",
    agent: "Mike Chen",
    status: "responded",
    date: "2024-02-14",
  },
  {
    id: 3,
    property: "Luxury Condo",
    inquirer: "Robert Brown",
    agent: "Lisa Park",
    status: "pending",
    date: "2024-02-13",
  },
  {
    id: 4,
    property: "Commercial Office Space",
    inquirer: "Tech Startup Inc",
    agent: "David Kim",
    status: "closed",
    date: "2024-02-10",
  },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agents, setAgents] = useState<any>([]);
  const [totalAgentsPages, setTotalAgentsPages] = useState(1);
  const [agentPage, setAgentPage] = useState(1);

  const fetchAllAgents = async () => {
    const filters = {
      // state: locationFilter !== "all" ? locationFilter : null,
      page: agentPage,
      limit: 10,
      // key: searchTerm,
      // listingType: listingType !== "all" ? listingType : null,
    };
    const response = await getAllAgents(filters);
    setAgents(response.data.body.data.agents);
    setTotalAgentsPages(response.data.body.data.pagination.totalPages);
  };
  useEffect(() => {
    fetchAllAgents();
  }, [agentPage]);
  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      responded: "default",
      closed: "outline",
    } as const;

    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      responded: "bg-blue-100 text-blue-800",
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, properties, and platform operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                +{mockStats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockStats.totalAgents}
              </div>
              <p className="text-xs text-muted-foreground">
                Verified professionals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockStats.totalProperties}
              </div>
              <p className="text-xs text-muted-foreground">
                Listed on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Documents
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockStats.pendingDocuments}
              </div>
              <p className="text-xs text-muted-foreground">Require review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inquiries
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockStats.totalInquiries}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{mockStats.monthlyGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly growth rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage platform users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:max-w-sm"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((user: any) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {`${user?.first_name} ${user?.last_name}`}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">
                          {user.role}
                        </TableCell>
                        {/* <TableCell>{getStatusBadge(${user.status ? "active":"un"}}</TableCell> */}
                        <TableCell>
                          {user.verified
                            ? getStatusBadge("approved")
                            : getStatusBadge("pending")}
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`./agent/${user._id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>

                            {/* <Button variant="outline" size="sm">
                              Suspend
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <Pagination>
                <PaginationContent>
                  {/* Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        agentPage > 1 && setAgentPage(agentPage - 1)
                      }
                    />
                  </PaginationItem>
                  {/* Page Numbers */}
                  {[...Array(totalAgentsPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={agentPage === i + 1}
                        onClick={() => setAgentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        agentPage < totalAgentsPages &&
                        setAgentPage(agentPage + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  Review and manage property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.title}
                        </TableCell>
                        <TableCell>{property.agent}</TableCell>
                        <TableCell>{property.price}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>
                  Review and approve property documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.property}
                        </TableCell>
                        <TableCell>{doc.agent}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                            {doc.status === "pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button variant="destructive" size="sm">
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inquiry Management</CardTitle>
                <CardDescription>
                  Monitor property inquiries and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Inquirer</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">
                          {inquiry.property}
                        </TableCell>
                        <TableCell>{inquiry.inquirer}</TableCell>
                        <TableCell>{inquiry.agent}</TableCell>
                        <TableCell>{inquiry.date}</TableCell>
                        <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
