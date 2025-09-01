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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AgentLayout } from "@/components/agent/agent-layout";
import {
  Building,
  MessageSquare,
  FileCheck,
  Plus,
  Eye,
  Edit,
  Upload,
  DollarSign,
  Trash,
  Play,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { AddPropertyFormData, addPropertySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createProperty,
  deleteProperty,
  deletePropertyMedia,
  getPropertiesByAgentId,
  updateProperty,
} from "@/services/property-services";
import {
  baseMediaUrl,
  InquiryStages,
  NigerianStates,
  PropertyListingTypes,
  PropertyStatus,
  UserRole,
} from "@/lib/enums";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { getAgentStats, getInquiries, updateInquiry } from "@/services/user-services";
import { updateInquiryDto } from "@/lib/user-dto";

// Mock data for agent
const mockAgentStats = {
  totalProperties: 12,
  activeListings: 8,
  totalInquiries: 34,
  pendingDocuments: 3,
  monthlyViews: 1247,
  averagePrice: "$485,000",
};


export default function AgentDashboard() {
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isDeleteMediaOpen, setIsDeleteMediaOpen] = useState(false);
  const [isDeleteBoxOpen, setDeleteBoxOpen] = useState(false);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPropertyIdDelete, setSelectedPropertyIdDelete] = useState<
    string | null
  >(null);
  const [selectedPropertyUpdate, setSelectedPropertyUpdate] = useState<any>({});
  const [inquiries, setInquiries] = useState<any>([]);
  const [inquiriesPage, setinquiriesPage] = useState(1);
  const [inquiriesTotalPages, setInquiriesTotalPages] = useState<any>({});
  const [isUpdatingInquiry, setIsUpdatingInquiry] = useState(false);
  const [agentStats, setAgentStats] = useState<any>({});

  const fetchPropertiesByAgent = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("USER", user);
    const getProperties = await getPropertiesByAgentId(user.id);
    setProperties(getProperties.data.body.data.items);
    setTotalPages(getProperties.data.body.data.pagination.totalPages);
  };
  const fetchAgentStats = async () => {
    setIsDeleting(true);
    const response = await getAgentStats();
    if (response.data.statusCode === 200) {
      setAgentStats(response.data.body.data);
    }
  };
   const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const fetchInquiriesByAgent = async () => {
    const response = await getInquiries();
    setInquiries(response.data.body.data.inquiries);
    setInquiriesTotalPages(response.data.body.data?.pagination?.totalPages);

    console.log("PROPERTIES", properties);
  };
  const handleInquiryStatusUpdate = async (
    inquiryId: string,
    inquiryStatus: string
  ) => {
    setIsUpdatingInquiry(true)
    const data: updateInquiryDto = {
      inquiry_id: inquiryId,
      inquiry_state: inquiryStatus,
    };
    const response = await updateInquiry(data);
    if (
      response.data.statusCode === 200 &&
      response.data.message === "SUCCESSFUL"
    ) {
      fetchPropertiesByAgent();
      fetchInquiriesByAgent();
      setIsUpdatingInquiry(false)
    }
  };
  useEffect(() => {
    fetchAgentStats();
    fetchPropertiesByAgent();
    fetchInquiriesByAgent();
  }, [properties,page, inquiriesPage]);
  const getStatusBadge = (status: string) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      new: "bg-blue-100 text-blue-800",
      responded: "bg-gray-100 text-gray-800",
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
  const form = useForm<AddPropertyFormData>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      state: "",
      description: "",
      title: "",
      price: 0,
      address: "",
      listing_type: "",
      status: "",
    },
  });
  const { isSubmitting } = form.formState;

  const updateForm = useForm<AddPropertyFormData>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      state: "",
      description: "",
      title: "",
      price: 0,
      address: "",
      listing_type: "",
      status: "",
    },
  });

  useEffect(() => {
    if (selectedPropertyUpdate) {
      updateForm.reset({
        state: selectedPropertyUpdate.state || "",
        description: selectedPropertyUpdate.description || "",
        title: selectedPropertyUpdate.title || "",
        price: selectedPropertyUpdate.price || 0,
        address: selectedPropertyUpdate.address || "",
        listing_type: selectedPropertyUpdate.listingType || "",
        status: selectedPropertyUpdate.status || "",
      });
    }
  }, [selectedPropertyUpdate, updateForm]);

  const { isSubmitting: isSubmittingUpdateForm } = updateForm.formState;

  const handleAddProperty = async (data: AddPropertyFormData) => {
    setError("");
    console.log("DATA", data);
    const formData = new FormData();

    // append images
    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append("images", file); // 👈 must match multer field name
      });
    }

    // append video
    if (data.video && data.video.length > 0) {
      data.video.forEach((file: File) => {
        formData.append("video", file);
      });
    }
    // append any other text fields from the form
    Object.keys(data).forEach((key) => {
      if (key !== "images" && key !== "video") {
        formData.append(key, (data as any)[key]);
      }
    });
    console.log("FORM DATA", formData);
    const inquiry = await createProperty(formData);
    if (
      inquiry.data.statusCode === 200 &&
      inquiry.data.message === "SUCCESSFUL"
    ) {
      fetchPropertiesByAgent();
      setIsAddPropertyOpen(false);
    }
  };
  const handleUpdateProperty = async (data: AddPropertyFormData) => {
    setError("");
    console.log("DATA", data);
    const formData = new FormData();

    // append images
    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append("images", file); // 👈 must match multer field name
      });
    }

    // append video
    if (data.video && data.video.length > 0) {
      data.video.forEach((file: File) => {
        formData.append("video", file);
      });
    }
    // append any other text fields from the form
    Object.keys(data).forEach((key) => {
      if (key !== "images" && key !== "video") {
        formData.append(key, (data as any)[key]);
      }
    });
    console.log("FORM DATA", formData);

    const update = await updateProperty(selectedPropertyUpdate._id, formData);
    if (
      update.data?.statusCode === 200 &&
      update.data?.message === "SUCCESSFUL"
    ) {
      fetchPropertiesByAgent();
      setIsAddPropertyOpen(false);
    } else if (update.response?.data) {
      setError(update.response?.data.customMessage);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedPropertyIdDelete(id);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedPropertyIdDelete(null);
    setError("");
  };

  const handleOpenUpdateDialog = (property: any) => {
    console.log(property);
    setSelectedPropertyUpdate(property);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedPropertyUpdate({});
    setError("");
  };
  const handleDelete = async (propertyId: string) => {
    setIsDeleting(true);
    const deletedProperty = await deleteProperty(propertyId);
    if (deletedProperty.data.statusCode === 200) {
      fetchPropertiesByAgent();
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const handleDeletePropertyMedia = async (
    propertyId: string,
    mediaId: string
  ) => {
    setError("");
    setIsDeletingMedia(true);
    const deleteMedia = await deletePropertyMedia(propertyId, mediaId);
    if (
      deleteMedia.data?.statusCode === 200 &&
      deleteMedia.data?.message === "SUCCESSFUL"
    ) {
      fetchPropertiesByAgent();
      setIsDeletingMedia(false);
      setSelectedPropertyUpdate((prev: any) => ({
        ...prev,
        media: prev.media.filter((m: any) => m._id !== mediaId),
      }));
      setDeleteBoxOpen(false);
    } else if (deleteMedia.response?.data) {
      setIsDeletingMedia(false);
      setError(deleteMedia.response?.data.customMessage);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your properties and client interactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties Listed
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {agentStats.totalProperties}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              Active listings
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inquiries This Month
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {agentStats.totalInquiries}
            </div>
            {/* <p className="text-xs text-muted-foreground">This month</p> */}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Documents
            </CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAgentStats.pendingDocuments}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockAgentStats.monthlyViews}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <CardTitle className="text-sm font-medium">&#8358;</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(agentStats.totalPrice)}
            </div>
            {/* <p className="text-xs text-muted-foreground">Portfolio average</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>
                    Manage your property portfolio
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddPropertyOpen}
                  onOpenChange={setIsAddPropertyOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[75%] overflow-x-hidden overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Property</DialogTitle>
                      <DialogDescription>
                        Fill in the property details to create a new listing
                      </DialogDescription>
                    </DialogHeader>
                    {/* <pre>{JSON.stringify(form.watch(), null, 2)}</pre> */}

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleAddProperty)}
                        className="space-y-4"
                      >
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Property Title</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          placeholder="Enter property title"
                                          className=""
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type="number"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
                                          } // 👈 cast to number
                                          value={field.value ?? ""}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value} // 👈 not defaultValue
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select State" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Object.values(NigerianStates).map(
                                              (state) => (
                                                <SelectItem
                                                  key={state}
                                                  value={state}
                                                >
                                                  {state}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="listing_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select Listing Type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {Object.values(
                                              PropertyListingTypes
                                            ).map((listType) => (
                                              <SelectItem
                                                key={listType}
                                                value={listType}
                                              >
                                                {listType}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Textarea
                                        placeholder="Property description"
                                        rows={4}
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Property Address</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Enter property address"
                                        className=""
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Property Status</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select Listing Type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {Object.values(PropertyStatus).map(
                                            (status) => (
                                              <SelectItem
                                                key={status}
                                                value={status}
                                              >
                                                {status}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="images"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Upload Images (Max 5)</FormLabel>
                                  <FormControl>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => {
                                        const input =
                                          e.target as HTMLInputElement;
                                        const files = Array.from(
                                          input.files || []
                                        );

                                        if (files.length > 5) {
                                          alert(
                                            "You can only upload up to 5 images."
                                          );
                                          // clear input value
                                          input.value = "";
                                          // also clear react-hook-form state
                                          field.onChange([]);
                                          return;
                                        }

                                        field.onChange(files);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="video"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Upload Video</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        field.onChange(file ? [file] : []);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddPropertyOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {isSubmitting
                                ? "Adding Property..."
                                : "Add Property"}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property: any) => (
                    <TableRow key={property._id}>
                      <TableCell className="font-medium">
                        {property.title}
                      </TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>{property.state}</TableCell>
                      <TableCell>{property.listingType}</TableCell>
                      <TableCell>
                        {getStatusBadge(property.status.toLowerCase())}
                      </TableCell>
                      <TableCell>{property.inquiryCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/properties/${property._id}?from=agent`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Dialog
                            open={selectedPropertyUpdate._id === property._id}
                            onOpenChange={(isOpen) =>
                              isOpen
                                ? handleOpenUpdateDialog(property)
                                : handleCloseUpdateDialog()
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[75%] overflow-x-hidden overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Edit Property: {property.title}
                                </DialogTitle>
                                <DialogDescription>
                                  Fill in the appropriate details for this
                                  property listing
                                </DialogDescription>
                              </DialogHeader>
                              {/* <pre>{JSON.stringify(updateForm.watch(), null, 2)}</pre> */}

                              <Form {...updateForm}>
                                <form
                                  onSubmit={updateForm.handleSubmit(
                                    handleUpdateProperty
                                  )}
                                  className="space-y-4"
                                >
                                  {error && (
                                    <Alert variant="destructive">
                                      <AlertDescription>
                                        {error}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="title"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Property Title
                                              </FormLabel>
                                              <FormControl>
                                                <div className="relative">
                                                  <Input
                                                    placeholder="Enter property title"
                                                    className=""
                                                    {...field}
                                                  />
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="price"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Price</FormLabel>
                                              <FormControl>
                                                <div className="relative">
                                                  <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                      field.onChange(
                                                        Number(e.target.value)
                                                      )
                                                    } // 👈 cast to number
                                                    value={field.value ?? ""}
                                                  />
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="state"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>State</FormLabel>
                                              <FormControl>
                                                <div className="relative">
                                                  <Select
                                                    onValueChange={
                                                      field.onChange
                                                    }
                                                    value={field.value} // 👈 not defaultValue
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select State" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {Object.values(
                                                        NigerianStates
                                                      ).map((state) => (
                                                        <SelectItem
                                                          key={state}
                                                          value={state}
                                                        >
                                                          {state}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="listing_type"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Property Type
                                              </FormLabel>
                                              <FormControl>
                                                <div className="relative">
                                                  <Select
                                                    onValueChange={
                                                      field.onChange
                                                    }
                                                    value={field.value}
                                                  >
                                                    <FormControl>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select Listing Type" />
                                                      </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                      {Object.values(
                                                        PropertyListingTypes
                                                      ).map((listType) => (
                                                        <SelectItem
                                                          key={listType}
                                                          value={listType}
                                                        >
                                                          {listType}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <FormField
                                        control={updateForm.control}
                                        name="description"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                              <div className="relative">
                                                <Textarea
                                                  placeholder="Property description"
                                                  rows={4}
                                                  {...field}
                                                />
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <FormField
                                        control={updateForm.control}
                                        name="address"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Property Address
                                            </FormLabel>
                                            <FormControl>
                                              <div className="relative">
                                                <Input
                                                  placeholder="Enter property address"
                                                  className=""
                                                  {...field}
                                                />
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <FormField
                                        control={updateForm.control}
                                        name="status"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Property Status
                                            </FormLabel>
                                            <FormControl>
                                              <div className="relative">
                                                <Select
                                                  onValueChange={field.onChange}
                                                  value={field.value}
                                                >
                                                  <FormControl>
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select Listing Type" />
                                                    </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                    {Object.values(
                                                      PropertyStatus
                                                    ).map((status) => (
                                                      <SelectItem
                                                        key={status}
                                                        value={status}
                                                      >
                                                        {status}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <FormField
                                        control={updateForm.control}
                                        name="images"
                                        render={({ field }) => (
                                          <FormItem>
                                            <div className="!flex justify-between w-full">
                                              <FormLabel>
                                                Upload Images (Max 5)
                                              </FormLabel>
                                              <Dialog
                                                open={isDeleteMediaOpen}
                                                onOpenChange={
                                                  setIsDeleteMediaOpen
                                                }
                                              >
                                                <DialogTrigger asChild>
                                                  <p className="underline text-red-400">
                                                    Delete Media Files
                                                  </p>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[75%] overflow-x-hidden overflow-y-auto">
                                                  <DialogHeader>
                                                    <DialogTitle>
                                                      Delete Media Files for:
                                                      {
                                                        selectedPropertyUpdate.title
                                                      }
                                                    </DialogTitle>
                                                    {error && (
                                                      <Alert variant="destructive">
                                                        <AlertDescription>
                                                          {error}
                                                        </AlertDescription>
                                                      </Alert>
                                                    )}
                                                  </DialogHeader>
                                                  <div>
                                                    {selectedPropertyUpdate?.media?.map(
                                                      (media: any) => {
                                                        return (
                                                          <div
                                                            key={media._id}
                                                            className="p-[5px] my-[5px] rounded-[5px] border border-grey-300 flex justify-between items-center"
                                                          >
                                                            <div>
                                                              {media.type.toLowerCase() ===
                                                              "image" ? (
                                                                <img
                                                                  src={
                                                                    `${baseMediaUrl}/images/${media?.url}` ||
                                                                    "/placeholder.svg"
                                                                  }
                                                                  alt={
                                                                    selectedPropertyUpdate.title
                                                                  }
                                                                  className="w-[90px] h-[90px] object-cover"
                                                                />
                                                              ) : (
                                                                <div className="relative">
                                                                  <video
                                                                    src={
                                                                      media?.url
                                                                        ? `${baseMediaUrl}/videos/${media?.url}`
                                                                        : "/placeholder.svg"
                                                                    }
                                                                    className="w-[90px] h-[90px]"
                                                                    poster="/video-thumbnail.png"
                                                                  />

                                                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                    <Play className="h-4 w-4 text-white" />
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </div>
                                                            <p>{media.type}</p>
                                                            <Dialog
                                                              open={
                                                                isDeleteBoxOpen
                                                              }
                                                              onOpenChange={
                                                                setDeleteBoxOpen
                                                              }
                                                            >
                                                              <DialogTrigger
                                                                asChild
                                                              >
                                                                <Button
                                                                  variant="outline"
                                                                  size="sm"
                                                                  className="bg-red-500"
                                                                >
                                                                  <Trash className="h-4 w-4 text-white" />
                                                                </Button>
                                                              </DialogTrigger>
                                                              <DialogContent className="max-w-2xl max-h-[75%] overflow-x-hidden overflow-y-auto">
                                                                <DialogHeader>
                                                                  <DialogTitle>
                                                                    Are you sure
                                                                    you want to
                                                                    delete this
                                                                    media file?
                                                                  </DialogTitle>
                                                                </DialogHeader>

                                                                <div className="flex justify-end gap-2">
                                                                  <Button
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                      setDeleteBoxOpen(
                                                                        false
                                                                      )
                                                                    }
                                                                  >
                                                                    Cancel
                                                                  </Button>
                                                                  <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-red-500"
                                                                    onClick={() =>
                                                                      handleDeletePropertyMedia(
                                                                        selectedPropertyUpdate._id,
                                                                        media._id
                                                                      )
                                                                    }
                                                                  >
                                                                    {isDeletingMedia
                                                                      ? "Deleting..."
                                                                      : "Delete"}
                                                                  </Button>
                                                                </div>
                                                              </DialogContent>
                                                            </Dialog>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                </DialogContent>
                                              </Dialog>
                                            </div>

                                            <FormControl>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                  const input =
                                                    e.target as HTMLInputElement;
                                                  const files = Array.from(
                                                    input.files || []
                                                  );

                                                  if (files.length > 5) {
                                                    alert(
                                                      "You can only upload up to 5 images."
                                                    );
                                                    // clear input value
                                                    input.value = "";
                                                    // also clear react-hook-updateForm state
                                                    field.onChange([]);
                                                    return;
                                                  }

                                                  field.onChange(files);
                                                }}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <FormField
                                        control={updateForm.control}
                                        name="video"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Upload Video</FormLabel>
                                            <FormControl>
                                              <Input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => {
                                                  const file =
                                                    e.target.files?.[0];
                                                  field.onChange(
                                                    file ? [file] : []
                                                  );
                                                }}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleCloseUpdateDialog()
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button type="submit">
                                        {isSubmittingUpdateForm
                                          ? "Updating Property..."
                                          : "Update Property"}
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={selectedPropertyIdDelete === property._id}
                            onOpenChange={(isOpen) =>
                              isOpen
                                ? handleOpenDeleteDialog(property._id)
                                : handleCloseDeleteDialog()
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-500"
                              >
                                <Trash className="h-4 w-4 text-white" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Property?</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this property:{" "}
                                  {property.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={handleCloseDeleteDialog}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-500"
                                  onClick={() => handleDelete(property._id)}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
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
          </Card>
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Inquiries</CardTitle>
              <CardDescription>
                View and respond to client inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inquiries.map((inquiry: any) => (
                  <Card key={inquiry._id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {inquiry.property.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          From: {inquiry.user.first_name}{" "}
                          {inquiry.user.last_name} • {inquiry.createdAt}
                        </p>
                      </div>
                      <div className="relative">
                        <Select
                          onValueChange={(newStatus) =>
                            handleInquiryStatusUpdate(inquiry._id, newStatus)
                          }
                          defaultValue={isUpdatingInquiry ? "Updating..." : inquiry.status} // 👈 not defaultValue
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(InquiryStages).map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {isUpdatingInquiry ? "Updating..." : stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {inquiry.message && (
                      <p className="text-sm text-foreground mb-3">
                        {inquiry.message}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        <span className="mr-4">
                          📧{" "}
                          <Link href={`mailto:${inquiry.user.email}`}>
                            {inquiry.user.email}
                          </Link>{" "}
                        </span>
                        <span>
                          📞{" "}
                          <Link href={`tel:${inquiry.user.phone}`}>
                            {inquiry.user.phone}
                          </Link>{" "}
                        </span>
                      </div>
                      {/* <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {inquiry.status === "new" && (
                          <Button size="sm">Respond</Button>
                        )}
                      </div> */}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>

            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      inquiriesPage > 1 && setinquiriesPage(inquiriesPage - 1)
                    }
                  />
                </PaginationItem>
                {/* Page Numbers */}
                {[...Array(inquiriesTotalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={inquiriesPage === i + 1}
                      onClick={() => setinquiriesPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      inquiriesPage < inquiriesTotalPages &&
                      setinquiriesPage(inquiriesPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
