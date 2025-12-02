import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, ExternalLink } from 'lucide-react';

const InternalAdminDashboard = () => {
  const [orgRequests, setOrgRequests] = useState([]);
  const [verifRequests, setVerifRequests] = useState([]);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data: orgs } = await supabase.from('organization_requests').select('*').eq('status', 'pending');
    setOrgRequests(orgs || []);

    const { data: verifs, error } = await supabase
      .from('verification_requests')
      .select(`
        *,
        user_profiles:user_id (full_name, role),
        organizations:organization_id (name)
      `)
      .eq('status', 'pending');
    
    if (error) console.error(error);
    setVerifRequests(verifs || []);
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Internal Admin Portal</h1>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">Super Admin</Badge>
        </div>

        <Tabs defaultValue="org-requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="org-requests">Organization Requests ({orgRequests.length})</TabsTrigger>
            <TabsTrigger value="user-verification">User Verification ({verifRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="org-requests">
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
          </TabsContent>

          <TabsContent value="user-verification">
            <div className="grid gap-4">
              {verifRequests.length === 0 && <p className="text-gray-500">No pending user verifications.</p>}
              {verifRequests.map(req => (
                <Card key={req.id}>
                  <CardContent className="pt-6 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{req.user_profiles?.full_name}</h3>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InternalAdminDashboard;