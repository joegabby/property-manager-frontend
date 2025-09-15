import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      {/* <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-secondary-foreground mb-4">Subscribe To Our Newsletter</h3>
            <p className="text-secondary-foreground/80 mb-6">
              Get the latest property updates, market insights, and exclusive deals delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-white text-foreground" />
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8" />
              <span className="text-2xl font-bold">Castle and Castle Properties</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your trusted partner in finding the perfect property. Connecting property owners, agents, and buyers
              seamlessly.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-secondary transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-secondary transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-secondary transition-colors">
                  Agent Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Property Types</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=apartment" className="hover:text-secondary transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="hover:text-secondary transition-colors">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=condo" className="hover:text-secondary transition-colors">
                  Condos
                </Link>
              </li>
              <li>
                <Link href="/properties?type=townhouse" className="hover:text-secondary transition-colors">
                  Townhouses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="hover:text-secondary transition-colors">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-secondary" />
                <span>favorcharles001@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+234 813 000 6860</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>123 Property Street, Real Estate City, RC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-primary-foreground/80">© 2025 Castle and Castle Properties. All rights reserved.</p>
            {/* <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-secondary transition-colors">
                Cookie Policy
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
