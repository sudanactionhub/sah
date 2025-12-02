import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const EvidencePage = () => {
  const [formData, setFormData] = useState({
    submitter_name: '',
    submitter_email: '',
    incident_date: '',
    location: '',
    description: '',
    evidence_type: 'testimony'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('evidence_submissions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your evidence submission has been received securely. Thank you for your contribution.",
      });

      setFormData({
        submitter_name: '',
        submitter_email: '',
        incident_date: '',
        location: '',
        description: '',
        evidence_type: 'testimony'
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit evidence. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Secure Evidence Submission for Sudan | Sudan Action Hub</title>
        <meta name="description" content="Securely and confidentially submit evidence of human rights violations and atrocities in Sudan and Darfur. Your contribution is vital for documentation and accountability." />
        <meta name="keywords" content="Sudan evidence submission, Darfur atrocities, human rights violations evidence, submit testimony Sudan, document war crimes" />
        <link rel="canonical" href="https://sudan-action-hub.com/evidence-collection" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Secure Evidence Submission for Sudan | Sudan Action Hub" />
        <meta property="og:description" content="A secure and confidential platform for documenting human rights violations in Sudan. Help us build a case for justice." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/evidence-collection" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Secure Evidence Submission for Sudan | Sudan Action Hub" />
        <meta name="twitter:description" content="A secure and confidential platform for documenting human rights violations in Sudan. Help us build a case for justice." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop" />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Evidence Collection</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A secure platform for documenting human rights violations in Sudan.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8"
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Security & Confidentiality</h3>
              <p className="text-blue-800">
                All submissions are encrypted and stored securely. Your information will be kept confidential and used only for documentation and advocacy purposes. You may submit anonymously if preferred.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Evidence</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  name="submitter_name"
                  value={formData.submitter_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave blank to remain anonymous"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="submitter_email"
                  value={formData.submitter_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="For follow-up only"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date
                </label>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, region, or coordinates"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Type
              </label>
              <select
                name="evidence_type"
                value={formData.evidence_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="testimony">Testimony</option>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide detailed information about the incident..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : 'Submit Evidence Securely'}
              <Upload className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EvidencePage;