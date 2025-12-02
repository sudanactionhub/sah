import react, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, ExternalLink, Plus, Edit2, Trash2 } from 'lucide-react';
import NewsEditor from '@/components/admin/NewsEditor';
import EventEditor from '@/components/admin/EventEditor';
import ResearchEditor from '@/components/admin/ResearchEditor';
import { getNews, getEvents, getResearch } from '@/api/AdminApi';

const InternalAdminDashboard = () => {
  const [orgRequests, setOrgRequests] = useState([]);
  const [verifRequests, setVerifRequests] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [research, setResearch] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [showNewsEditor, setShowNewsEditor] = useState(false);
  const [showEventEditor, setShowEventEditor] = useState(false);
  const [showResearchEditor, setShowResearchEditor] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    // Helper to timeout slow requests
    const fetchWithTimeout = (p, ms = 10000, label = 'request') => {
      return Promise.race([
        p,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms))
      ]);
    };

    try {
      console.debug('[admin] fetchData start');
      // Fetch organization requests
      const orgStart = Date.now();
      const { data: orgs, error: orgErr } = await fetchWithTimeout(
        supabase.from('organization_requests').select('*').eq('status', 'pending'),
        10000,
        'organization_requests'
      );
      console.debug('[admin] organization_requests took', Date.now() - orgStart, 'ms');
      if (orgErr) console.error('orgReq error', orgErr);
      setOrgRequests(orgs || []);

      // Fetch verification requests
      const verifStart = Date.now();
      const { data: verifs, error } = await fetchWithTimeout(
        supabase
          .from('verification_requests')
          .select(`
          *,
          user_profiles:user_id (full_name, role),
          organizations:organization_id (name)
        `)
          .eq('status', 'pending'),
        10000,
        'verification_requests'
      );
      console.debug('[admin] verification_requests took', Date.now() - verifStart, 'ms');
      if (error) console.error(error);
      setVerifRequests(verifs || []);

      // Fetch content - each with timeout and error handling
      try {
        const newsStart = Date.now();
        const newsList = await fetchWithTimeout(getNews({ status: 'published' }), 10000, 'getNews');
        console.debug('[admin] getNews took', Date.now() - newsStart, 'ms');
        setNews(newsList || []);
      } catch (newsErr) {
        console.warn('Failed to load news:', newsErr);
        setNews([]);
      }

      try {
        const eventsStart = Date.now();
        const eventsList = await fetchWithTimeout(getEvents(), 10000, 'getEvents');
        console.debug('[admin] getEvents took', Date.now() - eventsStart, 'ms');
        setEvents(eventsList || []);
      } catch (eventsErr) {
        console.warn('Failed to load events:', eventsErr);
        setEvents([]);
      }

      try {
        const researchStart = Date.now();
        const researchList = await fetchWithTimeout(getResearch(), 10000, 'getResearch');
        console.debug('[admin] getResearch took', Date.now() - researchStart, 'ms');
        setResearch(researchList || []);
      } catch (researchErr) {
        console.warn('Failed to load research:', researchErr);
        setResearch([]);
      }

      console.debug('[admin] fetchData end');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOrgAction = async (id, action, data) => {
    try {
      if (action === 'approve') {
        // 1. Create actual organization
        const { data: newOrg, error: createError } = await supabase
          .from('organizations')
          .insert([{
            name: data.name,
            description_english: data.description,
            email: data.email,
            website: data.website,
            email_domains: data.email_domains,
            status: 'Active',
            type: 'NGO', // Default
            visibility: 'Public'
          }])
          .select()
          .single();

        if (createError) throw createError;

        // 2. Update request status
        await supabase.from('organization_requests').update({ status: 'approved' }).eq('id', id);
      } else {
        await supabase.from('organization_requests').update({ status: 'rejected' }).eq('id', id);
      }
      
      toast({ title: `Request ${action}d` });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleVerifAction = async (requestId, userId, action) => {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      // Update verification request
      await supabase.from('verification_requests').update({ status }).eq('id', requestId);
      
      // Update user profile
      await supabase.from('user_profiles').update({ status }).eq('id', userId);

      toast({ title: `User ${action}d` });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleRefreshAndClose = () => {
    setShowNewsEditor(false);
    setShowEventEditor(false);
    setShowResearchEditor(false);
    setSelectedNews(null);
    setSelectedEvent(null);
    setSelectedResearch(null);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">Super Admin</Badge>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests">Requests ({orgRequests.length + verifRequests.length})</TabsTrigger>
            <TabsTrigger value="news">News ({news.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="research">Research ({research.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* REQUESTS TAB */}
          <TabsContent value="requests" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Organization Requests</h2>
              <div className="grid gap-4">
                {orgRequests.length === 0 && <p className="text-gray-500">No pending organization requests.</p>}
                {orgRequests.map(req => (
                  <Card key={req.id}>
                    <CardContent className="pt-6 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{req.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                        <div className="text-sm space-y-1">
                          <p><strong>Email:</strong> {req.email}</p>
                          <p><strong>Website:</strong> {req.website}</p>
                          <p><strong>Domains:</strong> {req.email_domains}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleOrgAction(req.id, 'reject')}>
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOrgAction(req.id, 'approve', req)}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">User Verification Requests</h2>
              <div className="grid gap-4">
                {verifRequests.length === 0 && <p className="text-gray-500">No pending user verifications.</p>}
                {verifRequests.map(req => (
                  <Card key={req.id}>
                    <CardContent className="pt-6 flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{req.user?.full_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Claiming affiliation with: <strong>{req.organizations?.name}</strong></p>
                        <div className="mb-4">
                          <a href={req.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-sm">
                            <ExternalLink className="h-4 w-4 mr-1" /> View Proof Document
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleVerifAction(req.id, req.user_id, 'reject')}>
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerifAction(req.id, req.user_id, 'approve')}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* NEWS TAB */}
          <TabsContent value="news" className="space-y-6">
            {!showNewsEditor ? (
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setSelectedNews(null);
                    setShowNewsEditor(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create News Article
                </Button>

                <div className="grid gap-4">
                  {news.length === 0 && <p className="text-gray-500">No news articles yet.</p>}
                  {news.map(item => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
                            <div className="mt-2 flex gap-2 items-center">
                              <Badge>{item.status}</Badge>
                              <span className="text-xs text-gray-500">{new Date(item.published_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedNews(item);
                                setShowNewsEditor(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <NewsEditor
                news={selectedNews}
                onSave={handleRefreshAndClose}
                onCancel={() => {
                  setShowNewsEditor(false);
                  setSelectedNews(null);
                }}
                onDelete={handleRefreshAndClose}
              />
            )}
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-6">
            {!showEventEditor ? (
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setSelectedEvent(null);
                    setShowEventEditor(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>

                <div className="grid gap-4">
                  {events.length === 0 && <p className="text-gray-500">No events yet.</p>}
                  {events.map(item => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.location}</p>
                            <div className="mt-2 flex gap-2 items-center">
                              <Badge>{item.status}</Badge>
                              <span className="text-xs text-gray-500">{new Date(item.event_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedEvent(item);
                                setShowEventEditor(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <EventEditor
                event={selectedEvent}
                onSave={handleRefreshAndClose}
                onCancel={() => {
                  setShowEventEditor(false);
                  setSelectedEvent(null);
                }}
                onDelete={handleRefreshAndClose}
              />
            )}
          </TabsContent>

          {/* RESEARCH TAB */}
          <TabsContent value="research" className="space-y-6">
            {!showResearchEditor ? (
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setSelectedResearch(null);
                    setShowResearchEditor(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Research Item
                </Button>

                <div className="grid gap-4">
                  {research.length === 0 && <p className="text-gray-500">No research items yet.</p>}
                  {research.map(item => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.abstract}</p>
                            <div className="mt-2 flex gap-2 items-center">
                              <Badge>{item.status}</Badge>
                              <span className="text-xs text-gray-500">{new Date(item.published_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedResearch(item);
                                setShowResearchEditor(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <ResearchEditor
                research={selectedResearch}
                onSave={handleRefreshAndClose}
                onCancel={() => {
                  setShowResearchEditor(false);
                  setSelectedResearch(null);
                }}
                onDelete={handleRefreshAndClose}
              />
            )}
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Additional site configuration options can be added here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InternalAdminDashboard;