import react from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">Sudan Action Hub</span>
            </div>
            <p className="text-sm">
              Dedicated to documenting human rights violations and supporting humanitarian efforts in Sudan.
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Quick Links</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/news" className="hover:text-blue-400 transition-colors">News</Link></li>
              <li><Link to="/research" className="hover:text-blue-400 transition-colors">Research</Link></li>
              <li><Link to="/evidence-collection" className="hover:text-blue-400 transition-colors">Evidence Collection</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Get Involved</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/advocacy" className="hover:text-blue-400 transition-colors">Advocacy</Link></li>
              <li><Link to="/events" className="hover:text-blue-400 transition-colors">Events</Link></li>
              <li><Link to="/humanitarian" className="hover:text-blue-400 transition-colors">Humanitarian Aid</Link></li>
              <li><Link to="/donations" className="hover:text-blue-400 transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Connect</span>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 Sudan Action Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;