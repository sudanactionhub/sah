import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, ChevronLeft, ChevronRight, Filter, Globe, Search, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format as formatBase, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, addDays, subDays, addWeeks, subWeeks, isAfter, isBefore, startOfDay } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';

const EVENT_TYPES = {
  'Press Interviews': { color: 'bg-blue-500', text: 'text-blue-600', hover: 'hover:bg-blue-600', border: 'border-blue-200' },
  'Protests': { color: 'bg-red-500', text: 'text-red-600', hover: 'hover:bg-red-600', border: 'border-red-200' },
  'Fundraisers': { color: 'bg-green-500', text: 'text-green-600', hover: 'hover:bg-green-600', border: 'border-green-200' },
  'Workshops & Teach-Ins': { color: 'bg-orange-500', text: 'text-orange-600', hover: 'hover:bg-orange-600', border: 'border-orange-200' },
  'General Advocacy': { color: 'bg-yellow-500', text: 'text-yellow-600', hover: 'hover:bg-yellow-600', border: 'border-yellow-200' },
};

const DEFAULT_THEME = { color: 'bg-gray-500', text: 'text-gray-600', hover: 'hover:bg-gray-600', border: 'border-gray-200' };

const commonTimezones = [
    'UTC',
    'America/New_York', // ET
    'America/Chicago', // CT
    'America/Denver', // MT
    'America/Los_Angeles', // PT
    'Europe/London', // GMT/BST
    'Europe/Berlin', // CET/CEST
    'Asia/Dubai', // GST
    'Asia/Tokyo', // JST
];

const CalendarHeader = ({ currentMonth, prevMonth, nextMonth, setDate, view, setView }) => {
  const onPrev = () => {
    if (view === 'month') prevMonth();
    if (view === 'week') setDate(date => subWeeks(date, 1));
    if (view === 'day') setDate(date => subDays(date, 1));
  };
  const onNext = () => {
    if (view === 'month') nextMonth();
    if (view === 'week') setDate(date => addWeeks(date, 1));
    if (view === 'day') setDate(date => addDays(date, 1));
  };

  const getHeaderText = () => {
    if (view === 'month') return formatBase(currentMonth, 'MMMM yyyy');
    if (view === 'week') {
      const start = startOfWeek(currentMonth);
      const end = endOfWeek(currentMonth);
      return `${formatBase(start, 'MMM d')} - ${formatBase(end, 'MMM d, yyyy')}`;
    }
    if (view === 'day') return formatBase(currentMonth, 'MMMM d, yyyy');
    return 'Events List';
  };

  if (view === 'list') return null;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Button onClick={() => setDate(new Date())} variant="outline">Today</Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onPrev}><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={onNext}><ChevronRight className="h-5 w-5" /></Button>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{getHeaderText()}</h2>
      </div>
    </div>
  );
};

const MonthView = ({ date, events, onEventClick, timezone }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
        {dayNames.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {days.map((day) => {
          const dayEvents = events.filter(e => isSameDay(toZonedTime(new Date(e.event_date), timezone), day));
          return (
            <div
              key={day.toString()}
              className={`border-b border-r border-gray-200 p-2 h-32 md:h-40 overflow-auto ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'bg-white'} ${isSameDay(day, toZonedTime(new Date(), timezone)) ? 'bg-blue-50' : ''}`}
            >
              <div className={`font-medium ${isSameDay(day, toZonedTime(new Date(), timezone)) ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>{formatBase(day, 'd')}</div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map(event => {
                   const theme = EVENT_TYPES[event.event_type] || DEFAULT_THEME;
                   return (
                    <div key={event.id} onClick={() => onEventClick(event)} className="flex items-center text-xs p-1 rounded-md cursor-pointer hover:bg-gray-100">
                      <span className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${theme.color}`}></span>
                      <span className="truncate font-medium">{event.title} {event.location && `(${event.location.split('/')[0].trim()})`}</span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && <div className="text-xs text-gray-500 mt-1">+{dayEvents.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const WeekView = ({ date, events, onEventClick, timezone }) => {
    const weekStart = startOfWeek(date);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const todayInTz = toZonedTime(new Date(), timezone);

    return (
        <div className="flex border-t border-gray-200">
            <div className="w-16 flex-shrink-0">
                {hours.map(hour => (
                    <div key={hour} className="h-16 text-xs text-right pr-2 text-gray-500 border-b border-gray-200 flex items-center justify-end">{hour}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-grow">
                {days.map((day) => (
                    <div key={day.toString()} className="border-l border-gray-200 relative">
                        <div className={`text-center py-2 border-b border-gray-200 ${isSameDay(day, todayInTz) ? 'bg-blue-50' : ''}`}>
                            <div className="font-semibold text-gray-700">{formatBase(day, 'E')}</div>
                            <div className={`text-lg font-bold ${isSameDay(day, todayInTz) ? 'text-blue-600' : 'text-gray-900'}`}>{formatBase(day, 'd')}</div>
                        </div>
                        <div className="relative">
                          {hours.map(hour => <div key={hour} className="h-16 border-b border-gray-200"></div>)}
                          {events.filter(e => isSameDay(toZonedTime(new Date(e.event_date), timezone), day)).map(event => {
                                const eventDateInTz = toZonedTime(new Date(event.event_date), timezone);
                                const top = (eventDateInTz.getHours() + eventDateInTz.getMinutes() / 60) * 4;
                                const theme = EVENT_TYPES[event.event_type] || DEFAULT_THEME;
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => onEventClick(event)}
                                        className={`absolute w-full p-2 text-white text-xs rounded-lg cursor-pointer ${theme.color}`}
                                        style={{ top: `${top}rem`, left: '0.25rem', right: '0.25rem', zIndex: 10 }}
                                    >
                                        <p className="font-bold truncate">{event.title}</p>
                                        <p className="truncate">{format(eventDateInTz, 'p', { timeZone: timezone })} {event.location && `(${event.location.split('/')[0].trim()})`}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DayView = ({ date, events, onEventClick, timezone }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const dayEvents = events.filter(e => isSameDay(toZonedTime(new Date(e.event_date), timezone), date));

    return (
        <div className="flex border-t border-gray-200">
            <div className="w-20 flex-shrink-0">
                {hours.map(hour => <div key={hour} className="h-16 text-xs text-right pr-2 text-gray-500 border-b border-gray-200 flex items-center justify-end">{hour}</div>)}
            </div>
            <div className="flex-grow border-l border-gray-200 relative">
                {hours.map(hour => <div key={hour} className="h-16 border-b border-gray-200"></div>)}
                {dayEvents.map(event => {
                    const eventDateInTz = toZonedTime(new Date(event.event_date), timezone);
                    const theme = EVENT_TYPES[event.event_type] || DEFAULT_THEME;
                    // Calculate event duration in hours for height
                    const startHour = eventDateInTz.getHours() + eventDateInTz.getMinutes() / 60;
                    const endHour = event.end_date ? 
                                    toZonedTime(new Date(event.end_date), timezone).getHours() + toZonedTime(new Date(event.end_date), timezone).getMinutes() / 60 : 
                                    startHour + 1; // Default to 1 hour if no end date
                    const durationInHours = endHour - startHour;

                    const top = startHour * 4; // 16px per hour * 4 = 64px, so 4rem per hour
                    const height = durationInHours * 4;

                    return (
                        <div
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className={`absolute w-full p-2 text-white rounded-lg cursor-pointer ${theme.color}`}
                            style={{ top: `${top}rem`, left: '0.5rem', right: '0.5rem', height: `${height}rem`, zIndex: 10 }}
                        >
                            <p className="font-bold">{event.title}</p>
                            <p>{format(eventDateInTz, 'p', { timeZone: timezone })} {event.end_date && `- ${format(toZonedTime(new Date(event.end_date), timezone), 'p', { timeZone: timezone })}`}</p>
                            <p className="text-xs">{event.location && `- ${event.location}`}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ListView = ({ events, onEventClick, timezone }) => {
  const [showPast, setShowPast] = useState(false);
  const today = startOfDay(new Date());

  const sortedEvents = useMemo(() => {
    const upcoming = events.filter(e => !isBefore(new Date(e.event_date), today));
    const past = events.filter(e => isBefore(new Date(e.event_date), today));
    
    // Sort upcoming ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    // Sort past descending (most recent first)
    past.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return showPast ? past : upcoming;
  }, [events, showPast, today]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{showPast ? 'Past Events' : 'Upcoming Events'}</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowPast(!showPast)}
          className="flex items-center gap-2"
        >
          {showPast ? (
            <>View Upcoming <ChevronRight className="h-4 w-4" /></>
          ) : (
            <><ChevronLeft className="h-4 w-4" /> View Past Events</>
          )}
        </Button>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No {showPast ? 'past' : 'upcoming'} events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedEvents.map(event => {
            const theme = EVENT_TYPES[event.event_type] || DEFAULT_THEME;
            const eventDate = toZonedTime(new Date(event.event_date), timezone);
            const endDate = event.end_date ? toZonedTime(new Date(event.end_date), timezone) : null;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${theme.border.replace('bg-', 'border-')}`}
                style={{ borderLeftColor: theme.color.replace('bg-', '') }} // Fallback if tailwind class fails
                onClick={() => onEventClick(event)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${theme.color}`}>
                        {event.event_type}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(eventDate, 'MMM d, yyyy', { timeZone: timezone })}
                        {endDate && endDate.toDateString() !== eventDate.toDateString() && (
                           <> - {format(endDate, 'MMM d, yyyy', { timeZone: timezone })}</>
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className={`h-4 w-4 mr-1 ${theme.text}`} />
                        {format(eventDate, 'p', { timeZone: timezone })}
                        {event.end_date && (
                           <> - {format(toZonedTime(new Date(event.end_date), timezone), 'p', { timeZone: timezone })}</>
                        )}
                      </span>
                      {event.location && (
                        <span className="flex items-center">
                          <MapPin className={`h-4 w-4 mr-1 ${theme.text}`} />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button size="sm" variant="ghost" className={`${theme.text} hover:bg-gray-100`}>
                      Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};


const EventsPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(Object.keys(EVENT_TYPES));
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setAllEvents(data || []);
      
      // Extract unique locations
      const locations = new Set();
      data?.forEach(event => {
        if (event.location) {
          // Split by slash and trim whitespace
          const locs = event.location.split('/').map(l => l.trim());
          locs.forEach(l => {
            if (l) locations.add(l);
          });
        }
      });
      setAvailableLocations(Array.from(locations).sort());
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Type filter
      if (!activeFilters.includes(event.event_type)) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(query);
        const matchesDesc = event.description?.toLowerCase().includes(query);
        const matchesLoc = event.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      // Location filter
      if (locationFilter.length > 0) {
        if (!event.location) return false;
        const eventLocs = event.location.split('/').map(l => l.trim());
        const hasMatchingLocation = eventLocs.some(loc => locationFilter.includes(loc));
        if (!hasMatchingLocation) return false;
      }

      return true;
    });
  }, [allEvents, activeFilters, searchQuery, locationFilter]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleLocationFilter = (loc) => {
    setLocationFilter(prev => 
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const renderView = () => {
    switch (view) {
      case 'list':
        return <ListView events={filteredEvents} onEventClick={handleEventClick} timezone={timezone} />;
      case 'week':
        return <WeekView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} timezone={timezone} />;
      case 'day':
        return <DayView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} timezone={timezone} />;
      case 'month':
      default:
        return <MonthView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} timezone={timezone} />;
    }
  };
  
  const selectedTimezoneLabel = useMemo(() => {
    return `${timezone.replace(/_/g, ' ')} (${format(new Date(), 'z', { timeZone: timezone })})`;
  }, [timezone]);

  const selectedEventTheme = selectedEvent ? (EVENT_TYPES[selectedEvent.event_type] || DEFAULT_THEME) : DEFAULT_THEME;

  return (
    <>
      <Helmet>
        <title>Events Calendar for Sudan | Sudan Action Hub</title>
        <meta name="description" content="View our interactive calendar for upcoming events, including charity galas, fundraisers, advocacy rallies, and community gatherings to support Sudan." />
        <meta name="keywords" content="Sudan events, Sudan fundraisers, Sudan protest, advocacy events, charity gala, community gatherings" />
        <link rel="canonical" href="https://sudan-action-hub.com/events" />
        {/* Removed placeholder image as per request. Ideally, these should be representative images for SEO. */}
        {/* <meta property="og:image" content="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=630&fit=crop" /> */}
        <meta property="og:url" content="https://sudan-action-hub.com/events" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events Calendar for Sudan | Sudan Action Hub" />
        <meta name="twitter:description" content="Join us at our events and help make a difference for Sudan. View our full calendar of fundraisers, rallies, and more." />
        {/* Removed placeholder image as per request. Ideally, these should be representative images for SEO. */}
        {/* <meta name="twitter:image" content="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=630&fit=crop" /> */}
      </Helmet>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Calendar className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">Events Calendar</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us at our events and help make a difference for Sudan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:max-w-[90rem]">
        
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          
          {/* View Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <Button variant={view === 'month' ? 'white' : 'ghost'} size="sm" onClick={() => setView('month')} className={view === 'month' ? 'bg-white shadow-sm' : ''}>Month</Button>
            <Button variant={view === 'week' ? 'white' : 'ghost'} size="sm" onClick={() => setView('week')} className={view === 'week' ? 'bg-white shadow-sm' : ''}>Week</Button>
            <Button variant={view === 'day' ? 'white' : 'ghost'} size="sm" onClick={() => setView('day')} className={view === 'day' ? 'bg-white shadow-sm' : ''}>Day</Button>
            <Button variant={view === 'list' ? 'white' : 'ghost'} size="sm" onClick={() => setView('list')} className={view === 'list' ? 'bg-white shadow-sm' : ''}>
              <List className="h-4 w-4 mr-1" /> List
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search events..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto"><Globe className="mr-2 h-4 w-4" /> Timezone</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                        <DropdownMenuLabel>Select Timezone</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={timezone} onValueChange={setTimezone}>
                            {commonTimezones.map(tz => (
                                <DropdownMenuRadioItem key={tz} value={tz}>
                                    {tz.replace(/_/g, ' ')} ({format(new Date(), 'z', { timeZone: tz })})
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Filter className="mr-2 h-4 w-4" /> 
                          Filters
                          {(activeFilters.length !== Object.keys(EVENT_TYPES).length || locationFilter.length > 0) && (
                            <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 max-h-96 overflow-y-auto">
                        <div className="font-semibold px-2 py-1.5 text-sm">Event Type</div>
                        {Object.entries(EVENT_TYPES).map(([type, theme]) => (
                            <DropdownMenuItem key={type} onSelect={(e) => e.preventDefault()}>
                                <div className="flex items-center space-x-2 w-full" onClick={() => toggleFilter(type)}>
                                    <Checkbox id={`type-${type}`} checked={activeFilters.includes(type)} onCheckedChange={() => {}}/>
                                    <Label htmlFor={`type-${type}`} className="flex-grow cursor-pointer text-sm">{type}</Label>
                                    <span className={`w-2 h-2 rounded-full ${theme.color}`}></span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        
                        <DropdownMenuSeparator className="my-2" />
                        <div className="font-semibold px-2 py-1.5 text-sm">Location</div>
                        {availableLocations.length === 0 ? (
                          <div className="px-2 py-1 text-xs text-gray-500">No locations found</div>
                        ) : (
                          availableLocations.map(loc => (
                            <DropdownMenuItem key={loc} onSelect={(e) => e.preventDefault()}>
                                <div className="flex items-center space-x-2 w-full" onClick={() => toggleLocationFilter(loc)}>
                                    <Checkbox id={`loc-${loc}`} checked={locationFilter.includes(loc)} onCheckedChange={() => {}}/>
                                    <Label htmlFor={`loc-${loc}`} className="flex-grow cursor-pointer text-sm truncate">{loc}</Label>
                                </div>
                            </DropdownMenuItem>
                          ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </div>
        </div>

        <CalendarHeader
          currentMonth={currentDate}
          prevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
          nextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
          setDate={setCurrentDate}
          view={view}
          setView={setView}
        />
        
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-600">Loading calendar...</p></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderView()}</motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center mt-2">
                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedEventTheme.color}`}></span>
                    {selectedEvent.event_type}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="flex items-start text-gray-700">
                    <Calendar className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${selectedEventTheme.text}`} />
                    <span>
                      {format(toZonedTime(new Date(selectedEvent.event_date), timezone), 'EEEE, MMMM d, yyyy', { timeZone: timezone })}
                      {selectedEvent.end_date && (
                        <> - <br/>{format(toZonedTime(new Date(selectedEvent.end_date), timezone), 'EEEE, MMMM d, yyyy', { timeZone: timezone })}</>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <Clock className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${selectedEventTheme.text}`} />
                    <span>
                      {format(toZonedTime(new Date(selectedEvent.event_date), timezone), 'p (zzzz)', { timeZone: timezone })}
                      {selectedEvent.end_date && (
                           <> - {format(toZonedTime(new Date(selectedEvent.end_date), timezone), 'p (zzzz)', { timeZone: timezone })}</>
                        )}
                    </span>
                  </div>
                  {selectedEvent.address && (
  <div className="flex items-start text-gray-700">
    <MapPin className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${selectedEventTheme.text}`} />
    <span> {selectedEvent.address}</span>
  </div>
)}
         <div className="flex items-start text-gray-700">
                    <MapPin className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${selectedEventTheme.text}`} />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <p>{selectedEvent.description}</p>
                  </div>
                   {selectedEvent.registration_url && (
                    <Button
                      className={`w-full mt-4 text-white ${selectedEventTheme.color} ${selectedEventTheme.hover}`}
                      onClick={() => {
                        if (selectedEvent.registration_url.startsWith('/')) {
                          navigate(selectedEvent.registration_url);
                        } else {
                          window.open(selectedEvent.registration_url, '_blank');
                        }
                      }}
                    >
                      Learn More <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventsPage;