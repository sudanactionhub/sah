import react, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const DonationsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    campaign_id: '',
    message: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.amount || parseFloat(formData.amount) < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a donation amount of at least $1.",
      });
      setLoading(false);
      return;
    }
    
    if (!formData.anonymous && !formData.donor_name) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please provide your name or choose to donate anonymously.",
      });
      setLoading(false);
      return;
    }
    
    if (!formData.donor_email) {
      toast({
        variant: "destructive",
        title: "Email is required",
        description: "Please provide your email address for the receipt.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: { ...formData, amount: parseFloat(formData.amount) },
      });

      if (error) throw new Error(error.message);
      
      if(data.error) throw new Error(data.error);

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not create a payment session. Please try again.");
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process donation. Please try again.",
      });
      setLoading(false);
    }
  };

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <>
      <Helmet>
        <title>Donate to Support Sudan | Sudan Action Hub</title>
        <meta name="description" content="Make a secure donation to support our humanitarian efforts in Sudan. Your donation helps provide essential aid, medical assistance, and resources to affected communities." />
        <meta name="keywords" content="donate to Sudan, Sudan charity, Sudan donation, support Sudan relief, humanitarian donation, Darfur donation" />
        <link rel="canonical" href="https://sudan-action-hub.com/donations" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Donate to Support Sudan | Sudan Action Hub" />
        <meta property="og:description" content="Your generosity directly supports vital humanitarian aid and advocacy efforts for the people of Sudan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1618224304910-1845347989c2?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/donations" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Donate to Support Sudan | Sudan Action Hub" />
        <meta name="twitter:description" content="Your generosity directly supports vital humanitarian aid and advocacy efforts for the people of Sudan." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1618224304910-1845347989c2?w=1200&h=630&fit=crop" />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Make a Donation</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your generosity directly supports humanitarian aid and advocacy efforts in Sudan.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Campaign (Optional)
              </label>
              <select
                name="campaign_id"
                value={formData.campaign_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">General Fund</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className={`px-4 py-2 border rounded-md font-semibold transition-colors ${
                      formData.amount === amount.toString()
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-blue-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Custom amount"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="donor_name"
                  value={formData.donor_name}
                  onChange={handleChange}
                  disabled={formData.anonymous}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="donor_email"
                  value={formData.donor_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave a message of support..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Make this donation anonymous
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            >
              {loading ? 'Redirecting to payment...' : `Proceed to Payment`}
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Lock size={14}/> Secure payment via Stripe & PayPal
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default DonationsPage;