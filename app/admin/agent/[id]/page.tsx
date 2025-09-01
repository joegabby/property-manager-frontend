"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  Eye,
  EyeOff,
  Award,
  ScanFace,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import {
  getProfile,
  getProfileById,
  updateIdentificationDoc,
  updateProfilePic,
} from "@/services/user-services";
import { baseMediaUrl } from "@/lib/enums";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { approveDocument, rejectDocument } from "@/services/admin-services";

// Validation schemas
const agentProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  licenseNumber: z.string().min(5, "License number is required"),
  brokerage: z.string().min(2, "Brokerage name is required"),
  specialties: z.string().optional(),
  yearsExperience: z.string().min(1, "Years of experience is required"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AgentProfileFormData = z.infer<typeof agentProfileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AgentProfile() {
  const params = useParams();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [error, setError] = useState("");
  const [isrejectionOpen, setIsRejectionOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isapproveOpen, setIsApproveOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("It did not meet our verification requirements");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const verifiedDoc = useMemo(() => {
    if (Array.isArray(userProfile?.documents)) {
      return (
        userProfile.documents.find((doc: any) => doc.status === "APPROVED") ||
        null
      );
    }
    return null;
  }, [userProfile]);
  const pendingDoc = useMemo(() => {
    if (Array.isArray(userProfile?.documents)) {
      return (
        userProfile.documents.find((doc: any) => doc.status === "PENDING") ||
        null
      );
    }
    return null;
  }, [userProfile]);

  const handleDocumentApproval = async () => {
    setIsApproving(true);

    const profile = await approveDocument(pendingDoc._id);
    if (
      profile.data?.statusCode === 200 &&
      profile.data?.message === "SUCCESSFUL"
    ) {
      setIsApproving(false);
      setIsApproveOpen(false);
    }
  };
  const handleDocumentRejection = async () => {
    setIsRejecting(true);
    const payload = {
      document_id: pendingDoc._id,
      reason: rejectionReason,
    };
    const profile = await rejectDocument(payload);
    if (
      profile.data?.statusCode === 200 &&
      profile.data?.message === "SUCCESSFUL"
    ) {
      setIsRejecting(false);
      setIsRejectionOpen(false);
    }
  };


  const handleGetProfileById = async () => {
    if (!params.id) return;
    const profile = await getProfileById(params.id as string);
    if (
      profile.data?.statusCode === 200 &&
      profile.data?.message === "SUCCESSFUL"
    ) {
      setUserProfile(profile.data.body.data);
    }
  };
  useEffect(() => {
    handleGetProfileById();
  }, [params.id, isApproving, isRejecting]);
  // Profile form
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // trigger file input dialog
  };
  const idDocRef = useRef<HTMLInputElement | null>(null);

  const handleIdDocUpdate = () => {
    idDocRef.current?.click(); // trigger file input dialog
  };

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Prepare form data
    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const response = await updateProfilePic(formData);
      if (
        response.data.statusCode === 200 &&
        response.data.message === "SUCCESSFUL"
      ) {
        handleGetProfileById();
      }
      console.log("Upload success:", response.data);
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
    }
  };
  const handleDocumentChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;

    // Prepare form data
    const formData = new FormData();
    formData.append("identification", file);

    const response = await updateIdentificationDoc(formData);
    if (
      response?.data?.statusCode === 200 &&
      response?.data?.message === "SUCCESSFUL"
    ) {
      handleGetProfileById();
    } else if (response.response?.data) {
      setError(response.response?.data.customMessage);
    }
  };

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: AgentProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile updated",
        description: "Your agent profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Properties
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your professional profile and account settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        {/* <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList> */}

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture and Status */}
              <div className="flex flex-col justify-center items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-gray-500 m-0 my-[10px]">
                  <AvatarImage
                    src={`${baseMediaUrl}/others/${userProfile.profile_pic}`}
                  />
                  <AvatarFallback className="text-lg">SJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center items-center">
                  {userProfile._id !== user?.id ? (
                    ""
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleButtonClick}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </>
                  )}

                  <div className="flex items-center space-x-2 mt-2">
                    {userProfile.verified ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Verified User
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Unverified User
                      </Badge>
                    )}
                    {verifiedDoc ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Verified Agent
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Unverified Agent
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="flex justify-between border-b pb-1">
                  <span className="font-medium text-gray-700">First Name:</span>
                  <span>{userProfile.first_name}</span>
                </p>
                <p className="flex justify-between border-b pb-1">
                  <span className="font-medium text-gray-700">Last Name:</span>
                  <span>{userProfile.last_name}</span>
                </p>
                <p className="flex justify-between border-b pb-1">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span>{userProfile.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span>{userProfile.phone}</span>
                </p>
              </div>
              <div className=" flex flex-col items-center">
                <CardTitle>Identity Verification Document</CardTitle>
                <CardDescription className="my-[10px]">
                  {pendingDoc
                    ? "The identification document below is pending verification by the Admin"
                    : "The identification document below has been verified by the admin"}
                </CardDescription>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="my-[10px]">
                  {verifiedDoc && (
                    <div className="relative w-[500px] h-[200px]">
                      <img
                        src={`${baseMediaUrl}/identifications/${verifiedDoc.url}`}
                        alt={verifiedDoc.fileName || "Verified document"}
                        className="w-full h-full rounded-[5px] object-cover"
                      />
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-[5px]">
                        <span className="text-3xl font-extrabold text-green-800 uppercase rotate-[-15deg] tracking-widest">
                          APPROVED
                        </span>
                      </div>
                    </div>
                  )}
                  {pendingDoc && (
                    <div className="flex flex-col justify-center items-center">
                      <div className="relative w-[500px] h-[200px]">
                        <img
                          src={`${baseMediaUrl}/identifications/${pendingDoc.url}`}
                          alt={pendingDoc.fileName || "Verified document"}
                          className="w-full h-full rounded-[5px] object-cover"
                        />
                        <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-[5px]">
                          <span className="text-3xl font-extrabold text-yellow-800 uppercase rotate-[-15deg] tracking-widest">
                            PENDING
                          </span>
                        </div>
                      </div>
                      <Link
                        className="underline mt-[10px] hover:text-blue-800"
                        target="_blank"
                        href={`${baseMediaUrl}/identifications/${pendingDoc.url}`}
                      >
                        View Identification Document
                      </Link>
                      <div className="flex w-full justify-between my-[20px]">
                        <Dialog
                          open={isrejectionOpen}
                          onOpenChange={setIsRejectionOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="mb-2 bg-red-700 hover:bg-red-800">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Document</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to reject this document?
                              </DialogDescription>
                              <DialogDescription>
                                Rejecting this document will leave this agent
                                un-verified and unable to list properties on
                                this platform.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <textarea
                                id="message"
                                placeholder="I'm interested in this property. Could you provide more information?"
                                rows={4}
                                value={rejectionReason}
                                onChange={(e) =>
                                  setRejectionReason(e.target.value)
                                }
                                className="w-full border rounded p-2"
                              />
                              <Button
                                variant="outline"
                                onClick={() => setIsRejectionOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleDocumentRejection()}>
                                {isRejecting ? "Rejecting..." : "Reject"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isapproveOpen}
                          onOpenChange={setIsApproveOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="mb-2 bg-green-700 hover:bg-green-800">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Document</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to approve this document?
                              </DialogDescription>
                              <DialogDescription>
                                Approving this document will make this agent a
                                verified agent on this platform
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsApproveOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleDocumentApproval()}>
                                {isApproving ? "Approving..." : "Approve"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </div>
                {userProfile._id !== user?.id ? (
                  ""
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={idDocRef}
                      onChange={handleDocumentChange}
                      className="hidden"
                    />
                    <Button
                      onClick={handleIdDocUpdate}
                      variant="outline"
                      size="sm"
                    >
                      <ScanFace className="h-4 w-4 mr-2" />
                      Update Identification Document
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...passwordForm.register("currentPassword")}
                      error={
                        passwordForm.formState.errors.currentPassword?.message
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...passwordForm.register("newPassword")}
                      error={passwordForm.formState.errors.newPassword?.message}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...passwordForm.register("confirmPassword")}
                      error={
                        passwordForm.formState.errors.confirmPassword?.message
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
