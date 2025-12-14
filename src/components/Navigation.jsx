import react, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, ChevronDown, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const DropdownNavItem = ({ label, items, pathname }) => {
  const isParentActive = items.some(item => pathname.startsWith(item.path));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
            isParentActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          {label}
          <ChevronDown className={`ml-1.5 h-4 w-4 transition-transform duration-200 opacity-50`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 mt-1">
        {items.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <Link
              to={item.path}
              className={`w-full cursor-pointer ${pathname === item.path ? 'font-semibold text-blue-600 bg-blue-50' : ''}`}
            >
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null); // NEW: track open mobile accordion
  const location = useLocation();
  const { pathname } = location;
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleSub = (label) => {
    setOpenSub((prev) => (prev === label ? null : label));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Organization Directory', path: '/organization-directory' },
    {
      label: 'Reporting',
      items: [
        { name: 'News', path: '/news' },
        { name: 'Research Publications', path: '/research' },
        { name: 'Evidence Collection', path: '/evidence-collection' },
      ],
    },
    {
      label: 'Campaigns',
      items: [
        { name: 'Advocacy', path: '/advocacy' },
        // Updated humanitarian link
        { name: 'Humanitarian', path: '/humanitarian' },
        { name: 'Diaspora', path: '/diaspora' },
      ],
    },
    {
      label: 'Events',
      items: [
        { name: 'Events', path: '/event-programming' },
        { name: 'Events Calendar', path: '/events' },
      ],
    },
    {
      label: 'About',
      items: [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
              <Heart className="h-6 w-6 text-blue-600 fill-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:inline">Sudan Action Hub</span>
            <span className="text-xl font-bold text-gray-900 sm:hidden">SAH</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navItems.map((item) =>
              item.path ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <DropdownNavItem key={item.label} label={item.label} items={item.items} pathname={pathname} />
              )
            )}

            {/* Right side buttons */}
            <div className="ml-6 flex items-center space-x-3 pl-6 border-l border-gray-200 h-8">
              {user && profile?.role === 'super_admin' ? (
                <Link to="/admin/portal">
                  <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all px-6 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/donations">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all px-6">
                    Donate
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                      <User className="h-5 w-5 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b mb-1">
                      {profile?.full_name || user.email}
                    </div>
                    {profile?.role === 'super_admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/portal" className="cursor-pointer flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 overflow-y-auto max-h-[85vh]"
          >
            <div className="px-4 pt-4 pb-6 space-y-2 shadow-inner">
              {navItems.map((item) =>
                item.path ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div key={item.label} className="pt-1">
                    {/* Accordion Header */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => toggleSub(item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openSub === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {openSub === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2.5 rounded-lg text-base font-medium border-l-2 ${
                                isActive(subItem.path)
                                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                                  : 'text-gray-600 hover:text-blue-600 hover:border-gray-300'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              )}

              {/* Buttons */}
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-3">
                {user && profile?.role === 'super_admin' ? (
                  <>
                    <Link to="/admin/portal" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-lg h-12 shadow-sm flex items-center justify-center gap-2">
                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 h-12 text-base hover:bg-red-50 hover:text-red-700"
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                    >
                      <LogOut className="mr-3 h-5 w-5" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/donations" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12 shadow-sm">
                        Donate
                      </Button>
                    </Link>

                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-12 text-base border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
