"use client";

import { useEffect, useRef, useState } from "react";
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
  X,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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
  PropertyType,
  PropertyTypeToSubtypes,
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
import {
  getAgentStats,
  getInquiries,
  updateInquiry,
} from "@/services/user-services";
import { updateInquiryDto } from "@/lib/user-dto";
import { formatDate, formatPrice } from "@/lib/utils";
import PreloaderSpinner from "@/components/ui/preloader";
import { validateImageQuality } from "@/components/ui/validateImageQuality";

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
  const [isLoading, setIsLoading] = useState(false);
  const [agentStats, setAgentStats] = useState<any>({});
  const [selectedMediaDelete, setSelectedMediaDelete] = useState<any>({});
  const [queryCount, setQueryCount] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [inquiriesCount, setInquiriesCount] = useState();
  const [inquiriesStatus, setInquiriesStatus] = useState("");

  const fetchPropertiesByAgent = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("USER", user);
    setIsLoading(true);
    const filters = {
      state: locationFilter !== "all" ? locationFilter : null,
      page: page,
      limit: 10,
      key: searchTerm,
      status: statusFilter,
      listingType: listingType !== "all" ? listingType : null,
    };
    const getProperties = await getPropertiesByAgentId(user.id, filters);
    setProperties(getProperties.data.body.data.items);
    setTotalPages(getProperties.data.body.data.pagination.totalPages);
    setQueryCount(getProperties.data.body.data.pagination.totalItems);
    setIsLoading(false);
  };
  const fetchAgentStats = async () => {
    // setIsDeleting(true);
    const response = await getAgentStats();
    if (response.data.statusCode === 200) {
      setAgentStats(response.data.body.data);
    }
  };

  const fetchInquiriesByAgent = async () => {
    setIsLoading(true);

    const filters = {
      status: inquiriesStatus,
      page: inquiriesPage,
    };
    const response = await getInquiries(filters);
    setInquiries(response.data.body.data.inquiries);
    setInquiriesTotalPages(response.data.body.data?.pagination?.totalPages);
    setInquiriesCount(response.data.body.data?.pagination?.totalItems);
    setIsLoading(false);

    console.log("PROPERTIES", properties);
  };
  const handleInquiryStatusUpdate = async (
    inquiryId: string,
    inquiryStatus: string
  ) => {
    setIsUpdatingInquiry(true);
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
      setIsUpdatingInquiry(false);
    }
  };
  // useEffect(() => {
  //   fetchAgentStats();
  //   fetchPropertiesByAgent();
  //   fetchInquiriesByAgent();
  // }, [properties, page, inquiriesPage]);
  useEffect(() => {
    fetchAgentStats(); // run only once on mount
  }, [properties]);

  useEffect(() => {
    fetchPropertiesByAgent();
  }, [page, locationFilter, searchTerm, statusFilter, listingType]);

  useEffect(() => {
    fetchInquiriesByAgent();
  }, [inquiriesPage, inquiriesStatus]);
  const getStatusBadge = (status: string) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      sold: "bg-red-100 text-red-800",
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
      price: undefined,
      address: "",
      listing_type: "",
      status: "",
      propertyType: "",
      propertySubType: "",
      bedrooms: undefined,
      baths: undefined,
    },
  });
  const { isSubmitting } = form.formState;

  const updateForm = useForm<AddPropertyFormData>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      state: "",
      description: "",
      title: "",
      price: undefined,
      address: "",
      listing_type: "",
      status: "",
      propertySubType: "",
      propertyType: "",
      bedrooms: undefined,
      baths: undefined,
    },
  });

  useEffect(() => {
    if (selectedPropertyUpdate) {
      updateForm.reset({
        state: selectedPropertyUpdate.state || "",
        description: selectedPropertyUpdate.description || "",
        title: selectedPropertyUpdate.title || "",
        price: selectedPropertyUpdate.price || undefined,
        address: selectedPropertyUpdate.address || "",
        listing_type: selectedPropertyUpdate.listingType || "",
        status: selectedPropertyUpdate.status || "",
        baths: selectedPropertyUpdate.baths || "",
        bedrooms: selectedPropertyUpdate.bedrooms || "",
        propertyType: selectedPropertyUpdate.propertyType || "",
        propertySubType: selectedPropertyUpdate.propertySubType || "",
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
    if (data.videos && data.videos.length > 0) {
      data.videos.forEach((file: File) => {
        formData.append("videos", file);
      });
    }
    // append any other text fields from the form
    Object.keys(data).forEach((key) => {
      if (key !== "images" && key !== "videos") {
        formData.append(key, (data as any)[key]);
      }
    });
    console.log("FORM DATA", formData);
    const response = await createProperty(formData);
    if (
      response.data?.statusCode === 200 &&
      response.data?.message === "SUCCESSFUL"
    ) {
      fetchPropertiesByAgent();
      setIsAddPropertyOpen(false);
    } else {
      console.log("ERR", response);
      const resErr =
        response?.response?.data.customMessage ||
        response?.response?.data.error;
      setError(resErr);
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
    if (data.videos && data.videos.length > 0) {
      data.videos.forEach((file: File) => {
        formData.append("videos", file);
      });
    }
    // append any other text fields from the form
    Object.keys(data).forEach((key) => {
      if (key !== "images" && key !== "videos") {
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
      handleCloseUpdateDialog();
    } else {
      const resErr =
        update?.response?.data.customMessage || update?.response?.data.error;
      setError(resErr);
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
            <div className="text-[14px] font-bold text-primary">
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
            <div className="text-[14px] font-bold text-primary">
              {agentStats.totalInquiries}
            </div>
            {/* <p className="text-xs text-muted-foreground">This month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Portfolio Price
            </CardTitle>
            <CardTitle className="text-sm font-medium">&#8358;</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[14px] font-bold text-primary">
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
                                          type="text" // text so commas show
                                          inputMode="numeric" // brings up numeric keyboard on mobile
                                          min={1}
                                          {...field}
                                          onChange={(e) => {
                                            // Strip everything that is not a digit
                                            const rawValue =
                                              e.target.value.replace(/\D/g, "");

                                            // Only update if it’s a number
                                            field.onChange(
                                              rawValue === ""
                                                ? undefined
                                                : Number(rawValue)
                                            );
                                          }}
                                          value={
                                            field.value !== undefined &&
                                            field.value !== null
                                              ? Number(
                                                  field.value
                                                ).toLocaleString()
                                              : ""
                                          }
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
                                    <FormLabel>Property Listing Type</FormLabel>
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
                          <div className="grid grid-cols-3 gap-4 justify-center">
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
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Property Status" />
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
                                name="propertyType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Select
                                          onValueChange={(val) => {
                                            field.onChange(val);
                                            form.setValue(
                                              "propertySubType",
                                              ""
                                            ); // reset subtype when type changes
                                          }}
                                          value={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Property Type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {Object.values(PropertyType).map(
                                              (type) => (
                                                <SelectItem
                                                  key={type}
                                                  value={type}
                                                >
                                                  {type}
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
                                name="propertySubType"
                                render={({ field }) => {
                                  const selectedType = form.watch(
                                    "propertyType"
                                  ) as PropertyType | undefined;
                                  const subtypeOptions =
                                    selectedType &&
                                    PropertyTypeToSubtypes[selectedType]
                                      ? PropertyTypeToSubtypes[selectedType]
                                      : [];

                                  return (
                                    <FormItem>
                                      <FormLabel>Property Subtype</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Property Sub-Type" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {subtypeOptions.length > 0 ? (
                                                subtypeOptions.map(
                                                  (subtype: string) => (
                                                    <SelectItem
                                                      key={subtype}
                                                      value={subtype}
                                                    >
                                                      {subtype}
                                                    </SelectItem>
                                                  )
                                                )
                                              ) : (
                                                <SelectItem
                                                  value="__no_subtypes__"
                                                  disabled
                                                >
                                                  No subtypes available
                                                </SelectItem>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="bedrooms"
                                render={({ field }) => {
                                  const [custom, setCustom] = useState(false);

                                  return (
                                    <FormItem>
                                      <FormLabel>Bedrooms</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          {custom ? (
                                            <div className="flex items-center gap-2">
                                              <Input
                                                type="number"
                                                placeholder="Enter custom number"
                                                value={field.value ?? ""} // stays blank if cleared
                                                min={0}
                                                onChange={(e) =>
                                                  field.onChange(
                                                    e.target.value === ""
                                                      ? ""
                                                      : Number(e.target.value)
                                                  )
                                                }
                                              />
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setCustom(false);
                                                  field.onChange(""); // reset value when canceling
                                                }}
                                                className="p-1 rounded hover:bg-gray-200"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          ) : (
                                            <Select
                                              onValueChange={(val) =>
                                                val === "custom"
                                                  ? setCustom(true)
                                                  : field.onChange(Number(val))
                                              }
                                              value={
                                                field.value
                                                  ? String(field.value)
                                                  : ""
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Number of bedrooms" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {[1, 2, 3, 4, 5, 6].map(
                                                  (num) => (
                                                    <SelectItem
                                                      key={num}
                                                      value={String(num)}
                                                    >
                                                      {num}
                                                    </SelectItem>
                                                  )
                                                )}
                                                <SelectItem value="custom">
                                                  Custom
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="baths"
                                render={({ field }) => {
                                  const [custom, setCustom] = useState(false);

                                  return (
                                    <FormItem>
                                      <FormLabel>Bathrooms</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          {custom ? (
                                            <div className="flex items-center gap-2">
                                              <Input
                                                type="number"
                                                placeholder="Enter custom number"
                                                value={field.value ?? ""}
                                                min={0}
                                                onChange={(e) =>
                                                  field.onChange(
                                                    e.target.value === ""
                                                      ? ""
                                                      : Number(e.target.value)
                                                  )
                                                }
                                              />
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setCustom(false);
                                                  field.onChange("");
                                                }}
                                                className="p-1 rounded hover:bg-gray-200"
                                              >
                                                <X className="w-4 h-4" />
                                              </button>
                                            </div>
                                          ) : (
                                            <Select
                                              onValueChange={(val) =>
                                                val === "custom"
                                                  ? setCustom(true)
                                                  : field.onChange(Number(val))
                                              }
                                              value={
                                                field.value
                                                  ? String(field.value)
                                                  : ""
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Number of bathrooms" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {[1, 2, 3, 4, 5, 6].map(
                                                  (num) => (
                                                    <SelectItem
                                                      key={num}
                                                      value={String(num)}
                                                    >
                                                      {num}
                                                    </SelectItem>
                                                  )
                                                )}
                                                <SelectItem value="custom">
                                                  Custom
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="images"
                              render={({ field }) => {
                                const [previews, setPreviews] = useState<
                                  { file: File; valid: boolean }[]
                                >([]);
                                const fileInputRef =
                                  useRef<HTMLInputElement | null>(null);

                                const handleFilesChange = async (
                                  files: FileList | null
                                ) => {
                                  if (!files) return;

                                  const fileArray = await Promise.all(
                                    Array.from(files).map(async (file) => {
                                      const isValid =
                                        await validateImageQuality(
                                          file,
                                          800,
                                          600,
                                          100
                                        );
                                      return { file, valid: isValid };
                                    })
                                  );

                                  // merge with existing previews
                                  const updated = [...previews, ...fileArray];
                                  setPreviews(updated);

                                  // only pass valid images to form field
                                  field.onChange(
                                    updated
                                      .filter((f) => f.valid)
                                      .map((f) => f.file)
                                  );
                                };

                                const removeFile = (index: number) => {
                                  const updated = previews.filter(
                                    (_, i) => i !== index
                                  );
                                  setPreviews(updated);

                                  // update form with only valid images
                                  field.onChange(
                                    updated
                                      .filter((f) => f.valid)
                                      .map((f) => f.file)
                                  );
                                };

                                return (
                                  <FormItem>
                                    <FormLabel>Upload Images</FormLabel>
                                    <FormControl>
                                      <div className="space-y-4">
                                        {/* Hidden file input */}
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          ref={fileInputRef}
                                          className="hidden"
                                          onChange={(e) =>
                                            handleFilesChange(e.target.files)
                                          }
                                        />

                                        {/* Preview grid */}
                                        <div className="grid grid-cols-3 gap-3">
                                          {/* Add button */}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              fileInputRef.current?.click()
                                            }
                                            className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md w-[150px] h-[100px] hover:bg-gray-100"
                                          >
                                            <Plus
                                              size={28}
                                              className="text-gray-500"
                                            />
                                          </button>

                                          {/* Image previews */}
                                          {previews.map(
                                            ({ file, valid }, idx) => {
                                              const objectUrl =
                                                URL.createObjectURL(file);
                                              return (
                                                <div
                                                  key={idx}
                                                  className={`relative group rounded-md ${
                                                    valid
                                                      ? "border border-dashed border-foreground"
                                                      : "border-2 border-red-500"
                                                  }`}
                                                >
                                                  <img
                                                    src={objectUrl}
                                                    alt={file.name}
                                                    className="object-cover rounded-md w-[150px] h-[100px]"
                                                  />

                                                  {/* Remove button */}
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeFile(idx)
                                                    }
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                                  >
                                                    <X size={14} />
                                                  </button>

                                                  {/* Low quality label */}
                                                  {!valid && (
                                                    <p className="absolute bottom-1 left-1 text-xs text-red-600 bg-white/70 px-1 rounded">
                                                      Low quality
                                                    </p>
                                                  )}
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="videos"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Upload Video</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      accept="video/*"
                                      multiple
                                      onChange={(e) => {
                                        const files = e.target.files
                                          ? Array.from(e.target.files)
                                          : [];
                                        field.onChange(files);
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
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <Input
                  placeholder="Search by title,address or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sm:max-w-[200px] border border-muted-foreground/50"
                />
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-full sm:max-w-[180px] border border-muted-foreground/50">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {Object.values(NigerianStates).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="w-full sm:w-[180px] border border-muted-foreground/50">
                    <SelectValue placeholder="Filter by listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Listing Types</SelectItem>
                    {Object.values(PropertyListingTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toLowerCase().charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border border-muted-foreground/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.values(PropertyStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.toLowerCase().charAt(0).toUpperCase() +
                          status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium">
                  Found {queryCount} properties
                </p>
              </div>
              {isLoading ? (
                <PreloaderSpinner />
              ) : (
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
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell>{property.state}</TableCell>
                        <TableCell>
                          {" "}
                          {property.listingType.charAt(0).toUpperCase() +
                            property.listingType.slice(1).toLowerCase()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(property.status.toLowerCase())}
                        </TableCell>
                        <TableCell>{property.inquiryCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/agent/properties/${property._id}`}>
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
                                                      type="text" // text so commas show
                                                      inputMode="numeric" // brings up numeric keyboard on mobile
                                                      min={1}
                                                      {...field}
                                                      onChange={(e) => {
                                                        // Strip everything that is not a digit
                                                        const rawValue =
                                                          e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                          );

                                                        // Only update if it’s a number
                                                        field.onChange(
                                                          rawValue === ""
                                                            ? undefined
                                                            : Number(rawValue)
                                                        );
                                                      }}
                                                      value={
                                                        field.value !==
                                                          undefined &&
                                                        field.value !== null
                                                          ? Number(
                                                              field.value
                                                            ).toLocaleString()
                                                          : ""
                                                      }
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
                                                  Property Listing Type
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
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <FormField
                                            control={updateForm.control}
                                            name="bedrooms"
                                            render={({ field }) => {
                                              const [custom, setCustom] =
                                                useState(false);

                                              return (
                                                <FormItem>
                                                  <FormLabel>
                                                    Bedrooms
                                                  </FormLabel>
                                                  <FormControl>
                                                    <div className="relative">
                                                      {custom ? (
                                                        <div className="flex items-center gap-2">
                                                          <Input
                                                            type="number"
                                                            placeholder="Enter custom number"
                                                            value={
                                                              field.value ?? ""
                                                            } // stays blank if cleared
                                                            min={0}
                                                            onChange={(e) =>
                                                              field.onChange(
                                                                e.target
                                                                  .value === ""
                                                                  ? ""
                                                                  : Number(
                                                                      e.target
                                                                        .value
                                                                    )
                                                              )
                                                            }
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              setCustom(false);
                                                              field.onChange(
                                                                ""
                                                              ); // reset value when canceling
                                                            }}
                                                            className="p-1 rounded hover:bg-gray-200"
                                                          >
                                                            <X className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        <Select
                                                          onValueChange={(
                                                            val
                                                          ) =>
                                                            val === "custom"
                                                              ? setCustom(true)
                                                              : field.onChange(
                                                                  Number(val)
                                                                )
                                                          }
                                                          value={
                                                            field.value
                                                              ? String(
                                                                  field.value
                                                                )
                                                              : ""
                                                          }
                                                        >
                                                          <SelectTrigger>
                                                            <SelectValue placeholder="Number of bedrooms" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {[
                                                              1, 2, 3, 4, 5, 6,
                                                            ].map((num) => (
                                                              <SelectItem
                                                                key={num}
                                                                value={String(
                                                                  num
                                                                )}
                                                              >
                                                                {num}
                                                              </SelectItem>
                                                            ))}
                                                            <SelectItem value="custom">
                                                              Custom
                                                            </SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      )}
                                                    </div>
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              );
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <FormField
                                            control={updateForm.control}
                                            name="baths"
                                            render={({ field }) => {
                                              const [custom, setCustom] =
                                                useState(false);

                                              return (
                                                <FormItem>
                                                  <FormLabel>
                                                    Bathrooms
                                                  </FormLabel>
                                                  <FormControl>
                                                    <div className="relative">
                                                      {custom ? (
                                                        <div className="flex items-center gap-2">
                                                          <Input
                                                            type="number"
                                                            placeholder="Enter custom number"
                                                            value={
                                                              field.value ?? ""
                                                            } // stays blank if cleared
                                                            min={0}
                                                            onChange={(e) =>
                                                              field.onChange(
                                                                e.target
                                                                  .value === ""
                                                                  ? ""
                                                                  : Number(
                                                                      e.target
                                                                        .value
                                                                    )
                                                              )
                                                            }
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={() => {
                                                              setCustom(false);
                                                              field.onChange(
                                                                ""
                                                              ); // reset value when canceling
                                                            }}
                                                            className="p-1 rounded hover:bg-gray-200"
                                                          >
                                                            <X className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        <Select
                                                          onValueChange={(
                                                            val
                                                          ) =>
                                                            val === "custom"
                                                              ? setCustom(true)
                                                              : field.onChange(
                                                                  Number(val)
                                                                )
                                                          }
                                                          value={
                                                            field.value
                                                              ? String(
                                                                  field.value
                                                                )
                                                              : ""
                                                          }
                                                        >
                                                          <SelectTrigger>
                                                            <SelectValue placeholder="Number of bathrooms" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            {[
                                                              1, 2, 3, 4, 5, 6,
                                                            ].map((num) => (
                                                              <SelectItem
                                                                key={num}
                                                                value={String(
                                                                  num
                                                                )}
                                                              >
                                                                {num}
                                                              </SelectItem>
                                                            ))}
                                                            <SelectItem value="custom">
                                                              Custom
                                                            </SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      )}
                                                    </div>
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              );
                                            }}
                                          />
                                        </div>
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
                                      <div className="grid grid-cols-3 gap-4 justify-center">
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
                                            name="propertyType"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Property Type
                                                </FormLabel>
                                                <FormControl>
                                                  <Select
                                                    onValueChange={(val) => {
                                                      field.onChange(val);
                                                      updateForm.setValue(
                                                        "propertySubType",
                                                        ""
                                                      ); // reset subtype
                                                    }}
                                                    value={field.value}
                                                  >
                                                    <SelectTrigger className="w-full">
                                                      <SelectValue placeholder="Property Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {Object.values(
                                                        PropertyType
                                                      ).map((type) => (
                                                        <SelectItem
                                                          key={type}
                                                          value={type}
                                                        >
                                                          {type}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <FormField
                                            control={updateForm.control}
                                            name="propertySubType"
                                            render={({ field }) => {
                                              const selectedType =
                                                updateForm.watch(
                                                  "propertyType"
                                                ) as PropertyType | undefined;

                                              const subtypeOptions =
                                                selectedType &&
                                                PropertyTypeToSubtypes[
                                                  selectedType
                                                ]
                                                  ? PropertyTypeToSubtypes[
                                                      selectedType
                                                    ]
                                                  : [];

                                              return (
                                                <FormItem>
                                                  <FormLabel>
                                                    Property Subtype
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Select
                                                      onValueChange={
                                                        field.onChange
                                                      }
                                                      value={field.value}
                                                    >
                                                      <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Property Sub-Type" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {subtypeOptions.length >
                                                        0 ? (
                                                          subtypeOptions.map(
                                                            (subtype) => (
                                                              <SelectItem
                                                                key={subtype}
                                                                value={subtype}
                                                              >
                                                                {subtype}
                                                              </SelectItem>
                                                            )
                                                          )
                                                        ) : (
                                                          <SelectItem
                                                            value="__no_subtypes__"
                                                            disabled
                                                          >
                                                            No subtypes
                                                            available
                                                          </SelectItem>
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="images"
                                          render={({ field }) => {
                                            const [previews, setPreviews] =
                                              useState<
                                                { file: File; valid: boolean }[]
                                              >([]);
                                            const fileInputRef =
                                              useRef<HTMLInputElement | null>(
                                                null
                                              );

                                            const handleFilesChange = async (
                                              files: FileList | null
                                            ) => {
                                              if (!files) return;

                                              const fileArray =
                                                await Promise.all(
                                                  Array.from(files).map(
                                                    async (file) => {
                                                      const isValid =
                                                        await validateImageQuality(
                                                          file,
                                                          800,
                                                          600,
                                                          100
                                                        );
                                                      return {
                                                        file,
                                                        valid: isValid,
                                                      };
                                                    }
                                                  )
                                                );

                                              const updated = [
                                                ...previews,
                                                ...fileArray,
                                              ];
                                              setPreviews(updated);

                                              // only send valid files to form state
                                              field.onChange(
                                                updated
                                                  .filter((f) => f.valid)
                                                  .map((f) => f.file)
                                              );
                                            };

                                            const removeFile = (
                                              index: number
                                            ) => {
                                              const updated = previews.filter(
                                                (_, i) => i !== index
                                              );
                                              setPreviews(updated);
                                              field.onChange(
                                                updated
                                                  .filter((f) => f.valid)
                                                  .map((f) => f.file)
                                              );
                                            };

                                            return (
                                              <FormItem>
                                                <div className="flex justify-between w-full">
                                                  <FormLabel>
                                                    Upload Images
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
                                                          Delete Media Files
                                                          for:
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
                                                                <p>
                                                                  {media.type}
                                                                </p>
                                                                <Dialog
                                                                  // open={
                                                                  //   isDeleteBoxOpen
                                                                  // }
                                                                  // onOpenChange={
                                                                  //   setDeleteBoxOpen
                                                                  // }
                                                                  open={
                                                                    selectedMediaDelete._id ===
                                                                    media._id
                                                                  }
                                                                  onOpenChange={(
                                                                    isOpen
                                                                  ) =>
                                                                    isOpen
                                                                      ? setSelectedMediaDelete(
                                                                          media
                                                                        )
                                                                      : setSelectedMediaDelete(
                                                                          {}
                                                                        )
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
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        media
                                                                        file?
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
                                                                            selectedMediaDelete._id
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

                                                {/* Hidden input inside FormControl */}
                                                <FormControl>
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={(e) =>
                                                      handleFilesChange(
                                                        e.target.files
                                                      )
                                                    }
                                                  />
                                                </FormControl>

                                                {/* Previews + Add Button outside FormControl */}
                                                <div className="grid grid-cols-3 gap-3 mt-3">
                                                  {/* Plus button */}
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      fileInputRef.current?.click()
                                                    }
                                                    className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md w-[150px] h-[100px] hover:bg-gray-100"
                                                  >
                                                    <Plus
                                                      size={28}
                                                      className="text-gray-500"
                                                    />
                                                  </button>

                                                  {/* Preview images */}
                                                  {previews.map(
                                                    ({ file, valid }, idx) => {
                                                      const objectUrl =
                                                        URL.createObjectURL(
                                                          file
                                                        );
                                                      return (
                                                        <div
                                                          key={idx}
                                                          className={`relative group rounded-md ${
                                                            valid
                                                              ? "border border-dashed border-foreground"
                                                              : "border-2 border-red-500"
                                                          }`}
                                                        >
                                                          <img
                                                            src={objectUrl}
                                                            alt={file.name}
                                                            className="object-cover rounded-md w-[150px] h-[100px]"
                                                          />
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              removeFile(idx)
                                                            }
                                                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                                          >
                                                            <X size={14} />
                                                          </button>
                                                          {!valid && (
                                                            <p className="absolute bottom-1 left-1 text-xs text-red-600 bg-white/70 px-1 rounded">
                                                              Low quality
                                                            </p>
                                                          )}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>

                                                <FormMessage />
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <FormField
                                          control={updateForm.control}
                                          name="videos"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Upload Video
                                              </FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="file"
                                                  accept="video/*"
                                                  multiple
                                                  onChange={(e) => {
                                                    const files = e.target.files
                                                      ? Array.from(
                                                          e.target.files
                                                        )
                                                      : [];
                                                    field.onChange(files);
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
                                    Are you sure you want to delete this
                                    property: {property.title}
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
              )}
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
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <Select
                  value={inquiriesStatus}
                  onValueChange={setInquiriesStatus}
                >
                  <SelectTrigger className="w-full sm:max-w-[180px] border border-muted-foreground/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.values(InquiryStages).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage.toLowerCase().charAt(0).toUpperCase() +
                          stage.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium">
                  Found {inquiriesCount} inquiries
                </p>
              </div>
              {isLoading ? (
                <PreloaderSpinner />
              ) : (
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
                            {inquiry.user.last_name} •{" "}
                            {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                        <div className="relative">
                          <Select
                            onValueChange={(newStatus) =>
                              handleInquiryStatusUpdate(inquiry._id, newStatus)
                            }
                            defaultValue={
                              isUpdatingInquiry ? "Updating..." : inquiry.status
                            } // 👈 not defaultValue
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(InquiryStages).map((stage) => (
                                <SelectItem key={stage} value={stage}>
                                  {isUpdatingInquiry
                                    ? "Updating..."
                                    : stage
                                        .toLowerCase()
                                        .charAt(0)
                                        .toUpperCase() +
                                      stage.slice(1).toLowerCase()}
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
                        <div className="gap-4 flex justify-between items-center text-xs text-muted-foreground">
                          <span className="gap-2 flex justify-between items-center">
                            <Mail size={18} />
                            <Link href={`mailto:${inquiry.user.email}`}>
                              {inquiry.user.email}
                            </Link>{" "}
                          </span>|
                          <span className="gap-2 flex justify-between items-center">
                            <Phone size={18} />
                            <Link href={`tel:${inquiry.user.phone}`}>
                              {inquiry.user.phone}
                            </Link>{" "}
                          </span>|
                          <span className="gap-2 flex justify-between items-center">
                            <Link
                              href={`https://wa.me/${inquiry.user.phone.replace(
                                /^0/,
                                "234"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gap-2 flex justify-between items-center"
                            >
                              <MessageCircle size={18} />
                              Chat on WhatsApp
                            </Link>
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
              )}
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
