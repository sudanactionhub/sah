import react from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Facebook, Twitter, Instagram, Linkedin, MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[40%_20%_20%_20%] gap-8">
          <div className="mr-16 " >
            <div className="flex items-center space-x-2 pading-right-20 mb-4 ">
              <img src = "https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/sign/sah_logo/SAHLogoTransparent_White.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mODU5YWMwYy1lOGI0LTQ5Y2MtODExMC0yMjUwNjM3ZDU1OTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzYWhfbG9nby9TQUhMb2dvVHJhbnNwYXJlbnRfV2hpdGUucG5nIiwiaWF0IjoxNzcyMTU5MDA2LCJleHAiOjIwODc1MTkwMDZ9.FI6s3PSsUB6Tdx7H1v0p4mb1XUg0Gufb5oI0_apf6E0"
                 alt="Sudan Action Hub Logo" className="h-20" />
              {/* <span className="text-lg font-bold text-white">Sudan Action Hub</span>
              */}
            </div>
            <p className="text-sm mr-16">
              Sudan Action Hub is a registered  501(c)(3) nonprofit dedicated to human rights advocacy and humanitarian support for Sudanese communities in need.
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Quick Links</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              {/*<li><Link to="/news" className="hover:text-green-400 transition-colors">News</Link></li>
              */}
              <li><Link to="/research" className="hover:text-green-400 transition-colors">Research</Link></li>
              <li><Link to="/evidence-collection" className="hover:text-green-400 transition-colors">Evidence Collection</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Get Involved</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/JoinUs" className="hover:text-green-400 transition-colors">Join Our Team</Link></li>
              <li><Link to="/advocacy" className="hover:text-green-400 transition-colors">Advocacy</Link></li>
              <li><Link to="/events" className="hover:text-green-400 transition-colors">Events</Link></li>
             {/* <li><Link to="/humanitarian" className="hover:text-green-400 transition-colors">Humanitarian Aid</Link></li>
             */}
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Connect</span>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
             <li><Link to="/Donate"  className="hover:text-green-400 transition-colors">Donate</Link></li>
          
            </ul>
            <div className="flex space-x-2 ">
              <a href="mailto:admin@sudanhub.org" className="hover:text-green-400 transition-colors">
                <MailIcon className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/sudanactionhub/" className="hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588099731002" className="hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              
              
            
             {/* } <a href="" className="hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
             
              <a href="#" className="hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              */}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2026 Sudan Action Hub. All rights reserved.</p>
          <a href="/privacypolicy" className="hover:text-green-400 text-right transition-colors">
                Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;