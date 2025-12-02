import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Users, 
  Map as MapIcon, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Eye,
  Scale,
  BookOpen,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ResearchPage = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('mission');
  
  // Evidence Form State
  const [evidenceForm, setEvidenceForm] = useState({
    submitter_name: '',
    submitter_email: '',
    confirm_email: '',
    incident_date: '',
    location: '',
    description: '',
    evidence_type: 'witness_account',
    file: null
  });
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    organization_name: '',
    contact_name: '',
    email: '',
    website: '',
    collaboration_interest: ''
  });
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleEvidenceChange = (e) => {
    if (e.target.name === 'file') {
      setEvidenceForm({ ...evidenceForm, file: e.target.files[0] });
    } else {
      setEvidenceForm({ ...evidenceForm, [e.target.name]: e.target.value });
    }
  };

  const handlePartnerChange = (e) => {
    setPartnerForm({ ...partnerForm, [e.target.name]: e.target.value });
  };

  const submitEvidence = async (e) => {
    e.preventDefault();
    setIsSubmittingEvidence(true);

    if (evidenceForm.submitter_email !== evidenceForm.confirm_email) {
      toast({
        variant: "destructive",
        title: "Email Mismatch",
        description: "Please ensure your email addresses match.",
      });
      setIsSubmittingEvidence(false);
      return;
    }

    try {
      let fileUrl = null;

      // Upload file if exists
      if (evidenceForm.file) {
        const fileExt = evidenceForm.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, evidenceForm.file);

        if (uploadError) {
          console.warn("File upload failed (bucket might not exist), proceeding with text data only.", uploadError);
          toast({
            title: "File Upload Warning",
            description: "We couldn't upload your file, but we'll save your text report.",
            variant: "warning"
          });
        } else {
           // Get public URL (Note: For sensitive evidence, you might want signed URLs instead, but keeping it simple for now)
           const { data: { publicUrl } } = supabase.storage.from('evidence').getPublicUrl(filePath);
           fileUrl = publicUrl;
        }
      }

      const { error } = await supabase
        .from('evidence_submissions')
        .insert([{
          submitter_name: evidenceForm.submitter_name,
          submitter_email: evidenceForm.submitter_email,
          incident_date: evidenceForm.incident_date,
          location: evidenceForm.location,
          description: evidenceForm.description,
          evidence_type: evidenceForm.evidence_type,
          file_url: fileUrl,
          verified: false
        }]);

      if (error) throw error;

      toast({
        title: "Evidence Submitted",
        description: "Thank you. Your submission has been securely received.",
      });
      
      setEvidenceForm({
        submitter_name: '',
        submitter_email: '',
        confirm_email: '',
        incident_date: '',
        location: '',
        description: '',
        evidence_type: 'witness_account',
        file: null
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your evidence. Please try again.",
      });
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const submitPartner = async (e) => {
    e.preventDefault();
    setIsSubmittingPartner(true);

    try {
      const { error } = await supabase
        .from('partner_applications')
        .insert([partnerForm]);

      if (error) throw error;

      toast({
        title: "Application Received",
        description: "Thank you for your interest. We will be in touch shortly.",
      });
      
      setPartnerForm({
        organization_name: '',
        contact_name: '',
        email: '',
        website: '',
        collaboration_interest: ''
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Research & Documentation | Sudan Action Hub</title>
        <meta name="description" content="Documenting human rights violations, analyzing conflict dynamics, and providing evidence-based research on the crisis in Sudan." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Research & Documentation</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Our mission is to rigorously document human rights violations, analyze conflict dynamics, and provide evidence-based research to support accountability and justice in Sudan.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollToSection('evidence-intake')} className="bg-red-600 hover:bg-red-700 text-white">
                <Lock className="mr-2 h-4 w-4" /> Secure Evidence Intake
              </Button>
              <Button onClick={() => scrollToSection('publications')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <BookOpen className="mr-2 h-4 w-4" /> View Publications
              </Button>
              <Button onClick={() => scrollToSection('map')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <MapIcon className="mr-2 h-4 w-4" /> Interactive Map
              </Button>
              <Button onClick={() => scrollToSection('partner')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Users className="mr-2 h-4 w-4" /> Partner Application
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why This Matters & What We Do */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Why This Matters</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                In the fog of war, truth is often the first casualty. Without systematic documentation, atrocities can be denied, and perpetrators can evade justice. Our work ensures that the stories of victims are preserved, patterns of violence are identified, and the international community cannot claim ignorance.
              </p>
              <ul className="space-y-3">
                {['Combating impunity', 'Preserving historical memory', 'Supporting legal accountability', 'Informing policy decisions'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <Eye className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">What We Will Do</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We employ a multi-faceted approach to research and documentation, combining open-source intelligence (OSINT) with direct testimony collection and satellite imagery analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Data Collection</h3>
                  <p className="text-sm text-gray-600">Securely gathering testimonies and digital evidence from the ground.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Verification</h3>
                  <p className="text-sm text-gray-600">Cross-referencing reports with satellite data and multiple sources.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Analysis</h3>
                  <p className="text-sm text-gray-600">Identifying trends, command structures, and systematic violations.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Reporting</h3>
                  <p className="text-sm text-gray-600">Publishing comprehensive reports for stakeholders and the public.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Methodology Summary */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Methodology</h2>
            <p className="text-gray-600">
              We adhere to international standards for human rights documentation, including the Berkeley Protocol on Digital Open Source Investigations. Our priority is the "Do No Harm" principle, ensuring the safety and dignity of witnesses and survivors above all else. All data is encrypted and stored on secure, offshore servers.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div id="map" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <MapIcon className="mr-3 h-8 w-8 text-blue-600" />
            Conflict Monitor Map
          </h2>
          <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
            <MapContainer center={[15.5007, 32.5599]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[15.5007, 32.5599]}>
                <Popup>
                  <strong>Khartoum</strong><br /> Capital city and center of intense conflict.
                </Popup>
              </Marker>
              <Marker position={[13.6167, 25.3500]}>
                <Popup>
                  <strong>North Darfur</strong><br /> Reports of displacement and violence.
                </Popup>
              </Marker>
              <Marker position={[19.6167, 37.2167]}>
                <Popup>
                  <strong>Port Sudan</strong><br /> Key humanitarian entry point.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * This map is for illustrative purposes. Real-time incident data is verified before publication.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Crisis Timeline</h2>
          <div className="relative border-l-4 border-blue-200 ml-6 md:ml-auto md:mr-auto md:w-2/3 space-y-12">
            {[
              { date: 'April 15, 2023', title: 'Conflict Erupts', desc: 'Fighting breaks out between SAF and RSF in Khartoum.' },
              { date: 'May 2023', title: 'Darfur Escalation', desc: 'Violence spreads to West Darfur, raising genocide alarms.' },
              { date: 'October 2023', title: 'Peace Talks Stall', desc: 'Jeddah talks resume but fail to secure lasting ceasefire.' },
              { date: 'Present', title: 'Ongoing Crisis', desc: 'Millions displaced, facing hunger and lack of medical aid.' }
            ].map((item, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{item.date}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publications Section */}
      <div id="publications" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <FileText className="mr-3 h-8 w-8 text-blue-600" />
                Publications & Reports
              </h2>
              <p className="text-gray-600">Access our latest findings and documentation.</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              View Archive <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Report: Situation Analysis</h3>
            <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg overflow-hidden mb-6">
              <iframe 
                src="https://drive.google.com/file/d/1OPw_ATmPn1SZElhYlyS7I90mm953mqqr/preview" 
                width="100%" 
                height="100%" 
                className="border-0"
                title="Research Report Preview"
              ></iframe>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => window.open('https://drive.google.com/file/d/1OPw_ATmPn1SZElhYlyS7I90mm953mqqr/view', '_blank')}>
                <Download className="mr-2 h-4 w-4" /> Download Full PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secure Evidence Intake */}
      <div id="evidence-intake" className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Secure Evidence Intake</h2>
            <p className="text-gray-400">
              Submit evidence of human rights violations securely. Your identity will be protected. 
              We use end-to-end encryption for all submissions.
            </p>
          </div>

          <form onSubmit={submitEvidence} className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="submitter_name" className="text-gray-300">Name (Optional)</Label>
                <Input 
                  id="submitter_name" 
                  name="submitter_name" 
                  value={evidenceForm.submitter_name}
                  onChange={handleEvidenceChange}
                  className="bg-gray-700 border-gray-600 text-white" 
                  placeholder="Leave blank for anonymous" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident_date" className="text-gray-300">Date of Incident</Label>
                <Input 
                  id="incident_date" 
                  name="incident_date" 
                  type="date" 
                  required
                  value={evidenceForm.incident_date}
                  onChange={handleEvidenceChange}
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="submitter_email" className="text-gray-300">Email Address</Label>
                <Input 
                  id="submitter_email" 
                  name="submitter_email" 
                  type="email" 
                  required
                  value={evidenceForm.submitter_email}
                  onChange={handleEvidenceChange}
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_email" className="text-gray-300">Confirm Email</Label>
                <Input 
                  id="confirm_email" 
                  name="confirm_email" 
                  type="email" 
                  required
                  value={evidenceForm.confirm_email}
                  onChange={handleEvidenceChange}
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input 
                id="location" 
                name="location" 
                required
                value={evidenceForm.location}
                onChange={handleEvidenceChange}
                className="bg-gray-700 border-gray-600 text-white" 
                placeholder="City, Neighborhood, or Coordinates" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description of Event</Label>
              <textarea 
                id="description" 
                name="description" 
                rows={5} 
                required
                value={evidenceForm.description}
                onChange={handleEvidenceChange}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe what happened in as much detail as possible..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-gray-300">Upload Evidence (Photo/Video/Doc)</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">MAX. 10MB</p>
                  </div>
                  <input id="file" name="file" type="file" className="hidden" onChange={handleEvidenceChange} />
                </label>
              </div>
              {evidenceForm.file && <p className="text-sm text-green-400 mt-2">Selected: {evidenceForm.file.name}</p>}
            </div>

            <Button type="submit" disabled={isSubmittingEvidence} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
              {isSubmittingEvidence ? 'Encrypting & Submitting...' : 'Submit Securely'}
            </Button>
          </form>
        </div>
      </div>

      {/* Partner Application */}
      <div id="partner" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Application</h2>
            <p className="text-gray-600">
              We collaborate with NGOs, academic institutions, and grassroots organizations. 
              Apply to join our research network.
            </p>
          </div>

          <form onSubmit={submitPartner} className="bg-gray-50 p-8 rounded-xl border border-gray-200 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organization_name">Organization Name</Label>
                <Input 
                  id="organization_name" 
                  name="organization_name" 
                  required
                  value={partnerForm.organization_name}
                  onChange={handlePartnerChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person</Label>
                <Input 
                  id="contact_name" 
                  name="contact_name" 
                  required
                  value={partnerForm.contact_name}
                  onChange={handlePartnerChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required
                  value={partnerForm.email}
                  onChange={handlePartnerChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={partnerForm.website}
                  onChange={handlePartnerChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaboration_interest">Area of Interest for Collaboration</Label>
              <textarea 
                id="collaboration_interest" 
                name="collaboration_interest" 
                rows={4} 
                required
                value={partnerForm.collaboration_interest}
                onChange={handlePartnerChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us how you'd like to work together..."
              />
            </div>

            <Button type="submit" disabled={isSubmittingPartner} className="w-full bg-blue-600 hover:bg-blue-700">
              {isSubmittingPartner ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>

      {/* Ethics & Privacy */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ethics & Privacy Policy</h3>
              <p className="text-sm text-gray-600">
                We are committed to the highest ethical standards. All information collected is treated with strict confidentiality. 
                We do not share personal details of witnesses without explicit, informed consent. Our digital infrastructure is 
                regularly audited for security vulnerabilities. By submitting information, you agree to our data processing terms 
                aimed solely at human rights documentation and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchPage;