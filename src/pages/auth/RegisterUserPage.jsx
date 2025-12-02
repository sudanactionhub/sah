import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, UserPlus } from 'lucide-react';

const RegisterUserPage = () => {
  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    organizationId: '',
    document: null
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrgs = async () => {
      const { data } = await supabase.from('organizations').select('id, name, email_domains').eq('status', 'Active');
      setOrganizations(data || []);
    };
    fetchOrgs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleOrgSelect = (value) => {
    setFormData({ ...formData, organizationId: value });
  };

  const checkDomainMatch = () => {
    if (!formData.organizationId || !formData.email) return false;
    const org = organizations.find(o => o.id === formData.organizationId);
    if (!org || !org.email_domains) return false;
    
    const emailDomain = formData.email.split('@')[1];
    const allowedDomains = org.email_domains.split(',').map(d => d.trim());
    return allowedDomains.includes(emailDomain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign Up User
      const { data: authData, error: authError } = await signUp(formData.email, formData.password);
      if (authError) throw authError;

      const userId = authData.user.id;
      const isDomainMatch = checkDomainMatch();
      const status = isDomainMatch ? 'approved' : 'pending';
      const role = 'org_member';

      // 2. Create Profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          full_name: formData.fullName,
          organization_id: formData.organizationId,
          role: role,
          status: status
        }]);

      if (profileError) throw profileError;

      // 3. If not auto-verified, upload doc and create verification request
      if (!isDomainMatch && formData.document) {
        const fileExt = formData.document.name.split('.').pop();
        const filePath = `${userId}/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('verification-docs')
          .upload(filePath, formData.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('verification-docs').getPublicUrl(filePath);

        const { error: reqError } = await supabase
          .from('verification_requests')
          .insert([{
            user_id: userId,
            organization_id: formData.organizationId,
            document_url: publicUrl,
            status: 'pending'
          }]);

        if (reqError) throw reqError;
      }

      toast({
        title: isDomainMatch ? "Account Created" : "Verification Pending",
        description: isDomainMatch 
          ? "Your email matched the organization's domain. You are verified." 
          : "Your account is created but pending manual verification of your documents.",
      });

      navigate('/login');

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-6 w-6 text-blue-600" />
              <CardTitle>Create Account</CardTitle>
            </div>
            <CardDescription>Join the Sudan Action Hub network.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select onValueChange={handleOrgSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
              </div>

              {formData.organizationId && formData.email && !checkDomainMatch() && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 space-y-3">
                  <p className="text-sm text-yellow-800">
                    Your email domain does not match the registered domains for this organization. Please upload proof of affiliation (ID card, letterhead, etc.).
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="document">Proof of Affiliation</Label>
                    <div className="flex items-center gap-2">
                      <Input id="document" type="file" required onChange={handleFileChange} className="cursor-pointer" />
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              )}

              {formData.organizationId && formData.email && checkDomainMatch() && (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <p className="text-sm text-green-800">✓ Email domain matches. Your account will be automatically verified.</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUserPage;