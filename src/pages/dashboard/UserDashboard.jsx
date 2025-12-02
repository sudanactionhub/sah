import react, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Database, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { profile } = useAuth();
  const [restrictedDocs, setRestrictedDocs] = useState([]);

  useEffect(() => {
    // Mock fetching restricted data
    setRestrictedDocs([
      { id: 1, title: 'Confidential: North Darfur Situation Report', date: '2023-11-15', type: 'Intelligence Brief' },
      { id: 2, title: 'Internal: NGO Coordination Meeting Minutes', date: '2023-11-10', type: 'Meeting Notes' },
    ]);
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.full_name}</h1>
          <p className="text-gray-600">
            {profile.status === 'approved' 
              ? 'You have full access to the partner portal.' 
              : 'Your account is currently pending verification. Access is limited.'}
          </p>
        </div>

        {profile.status === 'approved' ? (
          <Tabs defaultValue="restricted-content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="restricted-content">Restricted Content</TabsTrigger>
              <TabsTrigger value="directory">Full Directory Access</TabsTrigger>
            </TabsList>

            <TabsContent value="restricted-content">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restrictedDocs.map(doc => (
                  <Card key={doc.id} className="border-l-4 border-red-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <Lock className="h-4 w-4 text-red-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">{doc.type} • {doc.date}</p>
                      <p className="text-sm text-gray-700">This document contains sensitive information available only to verified partners.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="directory">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Enhanced Organization Directory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">As a verified partner, you can view direct contact details and operational specifics for all organizations.</p>
                  <Link to="/organization-directory" className="text-blue-600 hover:underline font-medium">
                    Go to Directory (Admin View Enabled)
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-yellow-900">Verification Pending</h3>
                  <p className="text-yellow-800">Your account is under review. Once verified, you will gain access to restricted reports and the full organization directory.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;