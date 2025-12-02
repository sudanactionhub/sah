import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Building2 } from 'lucide-react';

const RegisterOrganizationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    website: '',
    email_domains: '',
    contact_info: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('organization_requests')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your organization registration request has been submitted for review.",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <CardTitle>Register Organization</CardTitle>
            </div>
            <CardDescription>
              Submit your organization for verification. Once approved, your team members can join using their organization email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={formData.website} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_domains">Allowed Email Domains *</Label>
                <Input 
                  id="email_domains" 
                  name="email_domains" 
                  placeholder="e.g. un.org, savethechildren.org (comma separated)" 
                  required 
                  value={formData.email_domains} 
                  onChange={handleChange} 
                />
                <p className="text-xs text-gray-500">Users with emails ending in these domains will be automatically verified.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_info">Additional Contact Info</Label>
                <Input id="contact_info" name="contact_info" placeholder="Phone number or alternative contact" value={formData.contact_info} onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Registration Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterOrganizationPage;