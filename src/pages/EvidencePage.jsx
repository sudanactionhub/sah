import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FileUploadWidget from '@/components/FileUploadWidget';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const initialFormData = {
  submitter_name: '',
  submitter_email: '',
  incident_date: '',
  location: '',
  file_url: '',
  description: '',
  evidence_type: 'video',
};

const EvidencePage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const successRef = useRef(null);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleFileUpload = (url) => {
    handleInputChange('file_url', url);
    toast({
      title: 'File uploaded',
      description: 'File has been set',
    });
  };

  const handleSubmitAnother = () => {
    setFormData(initialFormData);
    setSubmitted(false);
  };

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        incident_date: formData.incident_date
          ? new Date(`${formData.incident_date}T00:00:00`).toISOString()
          : null,
        submitter_name: formData.submitter_name || null,
        submitter_email: formData.submitter_email || null,
        location: formData.location || null,
        file_url: formData.file_url || null,
        description: formData.description || null,
        evidence_type: formData.evidence_type || 'Unspecified',
      };

      const { error } = await supabase
        .from('evidence_submissions')
        .insert([payload]);

      if (error) throw error;

      setSubmitted(true);
      setFormData(initialFormData);

      toast({
        title: 'Success!',
        description:
          'Your evidence submission has been received securely. Thank you for your contribution.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message || 'Failed to submit evidence. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    if (!formData.file_url) return null;

    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(formData.file_url);

    if (isVideo) {
      return (
        <video
          src={formData.file_url}
          controls
          className="mt-2 h-32 w-full object-cover rounded-lg"
        />
      );
    }

    return (
      <img
        src={formData.file_url}
        alt="Uploaded preview"
        className="mt-2 h-32 w-full object-cover rounded-lg"
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Secure Evidence Submission for Sudan | Sudan Action Hub</title>
        <meta
          name="description"
          content="Securely and confidentially submit evidence of human rights violations and atrocities in Sudan and Darfur. Your contribution is vital for documentation and accountability."
        />
        <meta
          name="keywords"
          content="Sudan evidence submission, Darfur atrocities, human rights violations evidence, submit testimony Sudan, document war crimes"
        />
        <link rel="canonical" href="https://sudanactionhub.org/evidence-collection" />

        <meta
          property="og:title"
          content="Secure Evidence Submission for Sudan | Sudan Action Hub"
        />
        <meta
          property="og:description"
          content="A secure and confidential platform for documenting human rights violations in Sudan. Help us build a case for justice."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop"
        />
        <meta
          property="og:url"
          content="https://sudanactionhub.org/evidence-collection"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Secure Evidence Submission for Sudan | Sudan Action Hub"
        />
        <meta
          name="twitter:description"
          content="A secure and confidential platform for documenting human rights violations in Sudan. Help us build a case for justice."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=630&fit=crop"
        />
      </Helmet>

      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Evidence Collection
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              A secure platform for documenting human rights violations in Sudan.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-600 p-6 mb-8"
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Security & Confidentiality
              </h3>
              <p className="text-green-800">
                All submissions are encrypted and stored securely. Your
                information will be kept confidential and used only for
                documentation and advocacy purposes. You may submit anonymously
                if preferred.
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
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Submit Evidence
              </h2>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="video">Video</option>
                    <option value="photo">Photo</option>
                    <option value="testimony">Testimony</option>
                    <option value="document">Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Image/Video Upload</Label>
                    <FileUploadWidget
                      onUpload={handleFileUpload}
                      bucket="evidence_submission"
                      folder="featured"
                      acceptedTypes="image/*,video/*"
                      label="Upload Image/Video"
                    />
                    {renderFilePreview()}
                  </div>
                  <div />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Please provide detailed information about the incident..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : 'Submit Evidence Securely'}
                  <Upload className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </>
          ) : (
            <div ref={successRef} className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank you for your submission
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Your evidence has been received securely. Thank you for
                contributing to documentation, accountability, and advocacy for
                Sudan.
              </p>

              <Button
                type="button"
                onClick={handleSubmitAnother}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Additional Evidence
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default EvidencePage;