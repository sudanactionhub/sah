import react from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Facebook, Twitter, Instagram, Linkedin, MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

const Footer = () => {
  return (
    <footer className="flex bg-black text-gray-300">
      <div className="max-w-5xl justify-between  mx-auto  px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-5 md:grid-cols-[35%_1%_15%_15%_15%] justify-between gap-8 block">
          <div className="flex items-start space-x-2  mb-2 mr-2 ">

            <p className="text-5 text-white font-semibold pl-8">
              Sudan Action Hub is a registered  501(c)(3) nonprofit dedicated to human rights advocacy and humanitarian support for Sudanese communities in need.
            </p>
          </div>
          <div>
                     
          </div>

          <div>
            <span className="text-gray-100 font-semibold mb-2 block">Quick Links</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-400 transition-colors">Home</Link></li>
              {/*<li><Link to="/news" className="hover:text-red-400 transition-colors">News</Link></li>
              */}
              <li><Link to="/research" className="hover:text-red-400 transition-colors">Research</Link></li>
              <li><Link to="/evidence-collection" className="hover:text-red-400 transition-colors">Evidence Collection</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-gray-100 font-semibold mb-2 block">Get Involved</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/JoinUs" className="hover:text-red-400 transition-colors">Join Our Team</Link></li>
              <li><Link to="/advocacy" className="hover:text-red-400 transition-colors">Advocacy</Link></li>
              <li><Link to="/events" className="hover:text-red-400 transition-colors">Events</Link></li>
             {/* <li><Link to="/humanitarian" className="hover:text-red-400 transition-colors">Humanitarian Aid</Link></li>
             */}
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold mb-2 block">Connect</span>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Contact Us</Link></li>
             <li><Link to="/Donate"  className="hover:text-red-400 transition-colors">Donate</Link></li>
          
            </ul>
            <div className="flex float-bottom justify-left space-x-2 mt-4 pt-2 pb-2 ">
              <a href="mailto:admin@sudanhub.org" className="hover:text-green-700 transition-colors pr-1">
                <MailIcon className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/sudanactionhub/" className="hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588099731002" className="hover:text-blue-400 transition-colors">
                <Facebook className="h-5" />
              </a>
              
              
            
             {/* } <a href="" className="hover:text-red-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
             
              <a href="#" className="hover:text-red-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              */}
            </div>
          </div>
        </div>

        <div >
          <div className="flex justify-center  floact-center border-t border-gray-800 mt-2 block" >

            <a aria-label="Sudan Action Hub" href="https://app.candid.org/profile/16526276/sudan-action-hub-41-2854524/" 
                target="_blank"> <img alt="Sudan Action Hub Platinum Seal Candid Transparency" src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16526276/svg" 
                className = "float-center h-30 py-8 pl-8 pr-8"/> 
              </a>
              
              {/* <span className="text-lg font-bold text-white">Sudan Action Hub</span>
              */}
             

          <img src = "https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/sign/sah_logo/SAHLogoTransparent_White.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mODU5YWMwYy1lOGI0LTQ5Y2MtODExMC0yMjUwNjM3ZDU1OTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzYWhfbG9nby9TQUhMb2dvVHJhbnNwYXJlbnRfV2hpdGUucG5nIiwiaWF0IjoxNzcyMTU5MDA2LCJleHAiOjIwODc1MTkwMDZ9.FI6s3PSsUB6Tdx7H1v0p4mb1XUg0Gufb5oI0_apf6E0"
                 alt="Sudan Action Hub Logo" className="float-center h-40 pt-2" />
           
           </div>
           <div className='flex justify-center justify-center text-sm block"'>
          <p>&copy; 2026 Sudan Action Hub. All rights reserved.  </p>
          <a href="/privacypolicy" className="hover:text-red-400 text-right transition-colors underline" >
                Privacy Policy</a>
                </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;