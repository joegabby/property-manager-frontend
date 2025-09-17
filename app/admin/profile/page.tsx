"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getProfile,
  updateIdentificationDoc,
  updateProfilePic,
} from "@/services/user-services";
import { baseMediaUrl } from "@/lib/enums";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [error, setError] = useState("");

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

  const handleGetProfile = async () => {
    const profile = await getProfile();
    if (
      profile.data?.statusCode === 200 &&
      profile.data?.message === "SUCCESSFUL"
    ) {
      setUserProfile(profile.data.body.data);
    }
  };
  useEffect(() => {
    handleGetProfile();
    console.log("DOC", verifiedDoc);
  }, []);
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
        handleGetProfile();
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
      handleGetProfile();
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile
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
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture and Status */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`${baseMediaUrl}/others/${userProfile.profile_pic}`}
                  />
                  <AvatarFallback className="text-lg">{userProfile.first_name?.charAt(0).toUpperCase()} {userProfile.last_name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
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
                    {/* {userProfile.role === "AGENT" &&
                      (verifiedDoc ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 flex items-center"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Verified Agent
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 flex items-center"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Unverified Agent
                        </Badge>
                      ))} */}
                  </div>
                </div>
              </div>
              {/* {userProfile.role === "AGENT" && (
                <div>
                  <CardTitle>Identity Verification Document</CardTitle>
                  <CardDescription className="my-[10px]">
                    {pendingDoc
                      ? "The identification document below is pending verification by the Admin"
                      : "The identification document below has been verified by the admin"}
                  </CardDescription>
                  <input
                    type="file"
                    accept="image/*"
                    ref={idDocRef}
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
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
                            PENDING
                          </span>
                        </div>
                      </div>
                    )}
                    {pendingDoc && (
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
                    )}
                  </div>
                  <Button
                    onClick={handleIdDocUpdate}
                    variant="outline"
                    size="sm"
                  >
                    <ScanFace className="h-4 w-4 mr-2" />
                    Update Identification Document
                  </Button>
                </div>
              )} */}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
