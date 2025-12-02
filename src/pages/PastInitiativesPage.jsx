import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Loader2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { format, isSameDay, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const InitiativeCard = ({
  initiative
}) => {
  const imageContent = initiative.image_url ? <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={initiative.title} src={initiative.image_url} /> : <div className="w-full h-full bg-white flex items-center justify-center text-gray-400 text-sm">
      No Image
    </div>;
  const cardContent = <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col group border border-gray-100 hover:shadow-xl transition-all">
      <div className="relative h-56 overflow-hidden">
        {imageContent}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium text-sm">View Details &rarr;</span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{initiative.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span>{format(new Date(initiative.date), 'MMMM d, yyyy')}</span>
        </div>
        <p className="text-gray-600 flex-grow line-clamp-3">{initiative.description}</p>
      </div>
    </motion.div>;
  if (initiative.link) {
    // Check if it's an internal link
    if (initiative.link.startsWith('/')) {
      return <Link to={initiative.link} className="block h-full">
          {cardContent}
        </Link>;
    }
    // External link
    return <a href={initiative.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>;
  }
  return <div className="cursor-default h-full">
      {cardContent}
    </div>;
};

const PastInitiativesPage = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const {
    toast
  } = useToast();

  useEffect(() => {
    const fetchInitiatives = async () => {
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('initiatives').select('*').order('date', {
          ascending: false
        });
        if (error) throw error;
        setInitiatives(data || []);
      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error fetching initiatives",
          description: "Could not load initiatives. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitiatives();
  }, [toast]);

  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(initiative => {
      const matchesSearch = initiative.title?.toLowerCase().includes(searchQuery.toLowerCase()) || initiative.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = dateFilter ? isSameDay(new Date(initiative.date), parseISO(dateFilter)) : true;
      return matchesSearch && matchesDate;
    });
  }, [initiatives, searchQuery, dateFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('');
  };

  return <>
      <Helmet>
        <title>Events and Programming | Sudan Action Hub</title>
        <meta name="description" content="Explore our impactful campaigns, events, and programming dedicated to supporting Sudan. See the difference we've made together." />
        <meta name="keywords" content="Sudan initiatives, Sudan events, advocacy history, humanitarian initiatives, Sudan Action Hub, programming" />
        <link rel="canonical" href="https://sudan-action-hub.com/event-programming" />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Events and Programming</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Efforts to drive change and support Sudan across the United States.</p>
          </motion.div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search initiatives..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="w-full md:w-auto">
                <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full md:w-48" />
              </div>
              {(searchQuery || dateFilter) && <Button variant="ghost" onClick={clearFilters} className="text-gray-500 hover:text-red-500">
                  <X className="h-4 w-4 mr-2" /> Clear Filters
                </Button>}
            </div>
          </div>

          {loading ? <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div> : error ? <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              <p className="font-bold">An error occurred:</p>
              <p>{error}</p>
            </div> : filteredInitiatives.length === 0 ? <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No initiatives found matching your criteria.</p>
              <Button variant="link" onClick={clearFilters} className="mt-2 text-blue-600">
                Clear all filters
              </Button>
            </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInitiatives.map(initiative => <InitiativeCard key={initiative.id} initiative={initiative} />)}
            </div>}
        </div>
      </div>
    </>;
};
export default PastInitiativesPage;