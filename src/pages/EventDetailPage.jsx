import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const Gallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Event Gallery</h3>
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
              idx === currentIndex ? 'border-blue-600' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Fetch event details AND the linked event_pages data
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_pages (
              unique_title,
              unique_description,
              button_text,
              button_link,
              gallery_urls
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Event not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist or has been removed."}</p>
          <Link to="/events">
            <Button>Back to Calendar</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine which data to display (prefer event_pages data if available)
  const customData = Array.isArray(event.event_pages) ? event.event_pages[0] : event.event_pages;

  const displayTitle = customData?.unique_title || event.title;
  const displayDescription = customData?.unique_description || event.description;
  const displayButtonText = customData?.button_text || "Register / Join Now";
  const displayButtonLink = customData?.button_link || event.registration_url;
  const galleryImages = customData?.gallery_urls || [];

  const eventDate = new Date(event.event_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const heroImageSrc = event.image_url;

  return (
    <>
      <Helmet>
        <title>{displayTitle} | Sudan Action Hub</title>
        <meta name="description" content={displayDescription?.substring(0, 160)} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Hero Section */}
        <div className="relative h-64 md:h-96 bg-gray-900">
          {heroImageSrc ? (
            <img 
              src={heroImageSrc} 
              alt={displayTitle}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-white opacity-60 flex items-center justify-center text-gray-400">
              No Hero Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
            <Link to="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Calendar
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold mb-3">
                {event.event_type}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{displayTitle}</h1>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {displayDescription}
                </div>
              </div>

              {/* Gallery Section */}
              <Gallery images={galleryImages} />
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Date</p>
                      <p className="text-gray-600">
                        {format(eventDate, 'EEEE, MMMM d, yyyy')}
                        {endDate && endDate.toDateString() !== eventDate.toDateString() && (
                          <> - <br/>{format(endDate, 'EEEE, MMMM d, yyyy')}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Time</p>
                      <p className="text-gray-600">
                        {format(eventDate, 'p')}
                        {event.end_time && (
                           <> - {format(new Date(event.end_time), 'p')}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">{event.location || 'TBA'}</p>
                    </div>
                  </div>
                </div>

                {displayButtonLink && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(displayButtonLink, '_blank')}
                    >
                      {displayButtonText} <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share Event</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}>
                    <Share2 className="h-4 w-4 mr-2" /> Copy Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;