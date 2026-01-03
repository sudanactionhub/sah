import react from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">Sudan Hub</span>
            </div>
            <p className="text-sm">
              Sudan Hub mobilizes information, networks, and practical tools to connect individuals, grassroots groups, NGOs, researchers, and donors so that global connection, safe collaboration, and life-saving assistance can be scaled effectively.
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-3 ml-5 block">Quick Links</span>
            <ul className="space-y-2 text-sm mb-4 ml-5">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/organization-directory" className="hover:text-blue-400 transition-colors">Organization Directory</Link></li>
              <li><Link to="/events" className="hover:text-blue-400 transition-colors">Events</Link></li>
            </ul>
          </div>

         <div>
           <ul className="space-y-2 text-sm mb-3">
              <li><Link to="/contact" className="text-white font-semibold mb-3 block">Connect</Link></li>
            </ul>
            <div>
            <p className="space-y-2 text-sm mb-3">
              admin@sudanaction.org
            </p>
             <p className="space-y-2 text-sm mb-3">
              +1 (202) 998-2209
            </p>
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