"use client"

// import { toast } from "@/components/ui/use-toast"
import { toast } from "@/hooks/use-toast"
export default function TestPage() {
  return (
    <button
      onClick={() =>
        toast({
            variant:"default",
          title: "✅ Success",
          description: "Your property has been listed successfully!",
        })
      }
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Show Success Toast
    </button>
  )
}
