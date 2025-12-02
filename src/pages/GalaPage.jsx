import react, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Award, HeartHandshake as Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const GalaPage = () => {
  const { toast } = useToast();
  const [preorderData, setPreorderData] = useState({ name: '', email: '', num_tickets: 1 });
  const [sponsorshipData, setSponsorshipData] = useState({ organization_name: '', contact_name: '', contact_email: '', contact_phone: '', message: '' });
  const [preorderLoading, setPreorderLoading] = useState(false);
  const [sponsorshipLoading, setSponsorshipLoading] = useState(false);

  const handlePreorderChange = (e) => {
    const { id, value } = e.target;
    setPreorderData(prev => ({ ...prev, [id]: id === 'num_tickets' ? Math.max(1, parseInt(value)) : value }));
  };

  const handleSponsorshipChange = (e) => {
    const { id, value } = e.target;
    setSponsorshipData(prev => ({ ...prev, [id]: value }));
  };

  const handlePreorderSubmit = async (e) => {
    e.preventDefault();
    setPreorderLoading(true);
    const { error } = await supabase.from('gala_preorders').insert([preorderData]);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your pre-order. Please try again.' });
    } else {
      toast({ title: 'Success!', description: "We've received your ticket pre-order. We'll be in touch soon!" });
      setPreorderData({ name: '', email: '', num_tickets: 1 });
    }
    setPreorderLoading(false);
  };

  const handleSponsorshipSubmit = async (e) => {
    e.preventDefault();
    setSponsorshipLoading(true);
    const { error } = await supabase.from('gala_sponsorships').insert([sponsorshipData]);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your inquiry. Please try again.' });
    } else {
      toast({ title: 'Thank you!', description: "We've received your sponsorship inquiry and will get back to you shortly." });
      setSponsorshipData({ organization_name: '', contact_name: '', contact_email: '', contact_phone: '', message: '' });
    }
    setSponsorshipLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Sudan Humanitarian Gala | Sudan Action Hub</title>
        <meta name="description" content="Join us for the Sudan Humanitarian Gala in Washington, D.C. A night of solidarity, awareness, and fundraising to support vital humanitarian assistance in Sudan." />
        <meta name="keywords" content="Sudan gala, humanitarian gala, Washington DC charity event, Sudan fundraiser, charity ball, non-profit gala" />
        <link rel="canonical" href="https://sudan-action-hub.com/gala" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Sudan Humanitarian Gala | Sudan Action Hub" />
        <meta property="og:description" content="An evening of solidarity and action in Washington, D.C. to raise critical funds and awareness for humanitarian assistance in Sudan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1702342456570-2a68dcd8efba?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/gala" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sudan Humanitarian Gala | Sudan Action Hub" />
        <meta name="twitter:description" content="An evening of solidarity and action in Washington, D.C. to raise critical funds and awareness for humanitarian assistance in Sudan." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1702342456570-2a68dcd8efba?w=1200&h=630&fit=crop" />
      </Helmet>

      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img class="absolute inset-0 w-full h-full object-cover opacity-30" alt="Elegant gala setting with ambient lighting" src="https://images.unsplash.com/photo-1702342456570-2a68dcd8efba" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">Sudan Humanitarian Gala</h1>
            <p className="text-xl lg:text-2xl text-blue-200 max-w-3xl mx-auto">
              An evening of solidarity and action in Washington, D.C. to raise critical funds and awareness for humanitarian assistance in Sudan.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Event Details</h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">More information is coming soon. Pre-order your tickets to be the first to know.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.1}} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Date & Time</h3>
              <p className="text-gray-600">To Be Announced</p>
            </motion.div>
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.2}} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Washington, D.C.</p>
            </motion.div>
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.3}} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Award className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Purpose</h3>
              <p className="text-gray-600">Fundraising & Awareness for Sudan</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="preorder" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Be the First to Know</h2>
            <p className="text-lg text-gray-600 mb-8">
              Final event details will be announced soon. Fill out the form to pre-order your tickets and secure your spot. We'll notify you as soon as tickets are officially on sale.
            </p>
            <img class="rounded-lg shadow-xl" alt="Guests mingling at a charity event" src="https://images.unsplash.com/photo-1702342456570-2a68dcd8efba" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Ticket className="mr-3 h-6 w-6 text-blue-600"/> Pre-Order Your Tickets</CardTitle>
                <CardDescription>Reserve your place at this landmark event.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreorderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={preorderData.name} onChange={handlePreorderChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" value={preorderData.email} onChange={handlePreorderChange} required />
                  </div>
                  <div>
                    <Label htmlFor="num_tickets">Number of Tickets</Label>
                    <Input id="num_tickets" type="number" min="1" value={preorderData.num_tickets} onChange={handlePreorderChange} required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={preorderLoading}>
                    {preorderLoading ? 'Submitting...' : 'Reserve My Spot'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="sponsorship" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
           <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Handshake className="mr-3 h-6 w-6 text-blue-600"/> Partner With Us</CardTitle>
                <CardDescription>Inquire about sponsorship and collaboration opportunities.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSponsorshipSubmit} className="space-y-4">
                   <div>
                    <Label htmlFor="organization_name">Organization Name</Label>
                    <Input id="organization_name" type="text" placeholder="Your Company Inc." value={sponsorshipData.organization_name} onChange={handleSponsorshipChange} required />
                  </div>
                  <div>
                    <Label htmlFor="contact_name">Contact Name</Label>
                    <Input id="contact_name" type="text" placeholder="Jane Smith" value={sponsorshipData.contact_name} onChange={handleSponsorshipChange} required />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input id="contact_email" type="email" placeholder="jane.smith@company.com" value={sponsorshipData.contact_email} onChange={handleSponsorshipChange} required />
                  </div>
                   <div>
                    <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
                    <Input id="contact_phone" type="tel" placeholder="(555) 123-4567" value={sponsorshipData.contact_phone} onChange={handleSponsorshipChange} />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us how you'd like to get involved..." value={sponsorshipData.message} onChange={handleSponsorshipChange} required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={sponsorshipLoading}>
                    {sponsorshipLoading ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Sponsor</h2>
            <p className="text-lg text-gray-600 mb-8">
              Amplify your impact and showcase your organization's commitment to humanitarian causes. We offer various sponsorship packages and are open to creative collaborations to make this event a success.
            </p>
             <img class="rounded-lg shadow-xl" alt="Corporate logos on a sponsorship banner" src="https://images.unsplash.com/photo-1679327676630-a2d7c3e438e5" />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default GalaPage;