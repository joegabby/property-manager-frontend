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
import {} from "@/components/admin/admin-layout";
import {
  Users,
  Building,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { getAdminStats, getAllAgents } from "@/services/admin-services";
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
import { formatDate } from "@/lib/utils";
import { DocumentVerificationStages } from "@/lib/enums";
import PreloaderSpinner from "@/components/ui/preloader";

// Mock data
const mockStats = {
  totalUsers: 1247,
  totalAgents: 89,
  totalProperties: 456,
  pendingDocuments: 23,
  totalInquiries: 178,
  monthlyGrowth: 12.5,
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agents, setAgents] = useState<any>([]);
  const [totalAgentsPages, setTotalAgentsPages] = useState(1);
  const [queryCount, setQueryCount] = useState(1);
  const [agentPage, setAgentPage] = useState(1);
  const [adminStats, setAdminStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllAgents = async () => {
    setIsLoading(true);

    const filters = {
      // state: locationFilter !== "all" ? locationFilter : null,
      page: agentPage,
      limit: 10,
      key: searchTerm,
      status: statusFilter,
      // listingType: listingType !== "all" ? listingType : null,
    };
    const response = await getAllAgents(filters);
    setAgents(response.data.body.data.agents);
    setTotalAgentsPages(response.data.body.data.pagination.totalPages);
    setQueryCount(response.data.body.data.pagination.totalItems);
    
    setIsLoading(false);
  };
  const fetchAdminStats = async () => {
    // setIsDeleting(true);
    const response = await getAdminStats();
    if (response.data.statusCode === 200) {
      setAdminStats(response.data.body.data);
    }
  };
  useEffect(() => {
    fetchAllAgents();
    fetchAdminStats();
  }, [searchTerm, statusFilter, agentPage]);
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
                {adminStats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered on Platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {adminStats.verifiedAgents}
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
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {adminStats.totalProperties}
              </div>
              <p className="text-xs text-muted-foreground">
                Listed on platform
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Management</CardTitle>
                <CardDescription>Manage platform agents</CardDescription>
                <p className="text-sm font-medium">
                  Total registered agents: {adminStats.totalAgents}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <Input
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:max-w-sm border border-muted-foreground/50"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="sm:w-[180px] border border-muted-foreground/50">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.values(DocumentVerificationStages).map(
                        (stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        )
                      )}
                      {/* <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <p className="text-sm font-medium">
                    Found {queryCount} agent(s)
                  </p>
                </div>
                {isLoading ? (
                  <PreloaderSpinner />
                ) : (
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
                      {agents.map((user: any) => {
                        const verifiedDoc =
                          Array.isArray(user?.documents) &&
                          user.documents.find(
                            (doc: any) => doc.status === "APPROVED"
                          );
                        const pendingDoc =
                          Array.isArray(user?.documents) &&
                          user.documents.find(
                            (doc: any) => doc.status === "PENDING"
                          );
                        return (
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
                              {verifiedDoc
                                ? getStatusBadge("approved")
                                : pendingDoc
                                ? getStatusBadge("pending")
                                : getStatusBadge("rejected")}
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
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
        </Tabs>
      </div>
    </>
  );
}
