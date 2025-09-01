import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">PropertyHub</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect property owners, agents, and buyers in one comprehensive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">For Property Owners</CardTitle>
              <CardDescription>Manage your properties and connect with qualified agents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload listings, track inquiries, and manage documentation with ease
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-accent">For Agents</CardTitle>
              <CardDescription>Showcase properties and manage client relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional tools for property listings and client communication
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">For Buyers & Renters</CardTitle>
              <CardDescription>Find your perfect property with advanced search</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse listings, make inquiries, and track your applications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
