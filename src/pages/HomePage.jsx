import react from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsletterForm from '@/components/NewsletterForm';
const HomePage = () => {
  const features = [{
    icon: FileText,
    title: 'Research & Documentation',
    description: 'Academic publications and comprehensive research on human rights violations in Sudan.',
    link: '/research'
  }, {
    icon: Shield,
    title: 'Evidence Collection',
    description: 'Secure platform for documenting and preserving evidence of atrocities in Darfur.',
    link: '/evidence-collection'
  }, {
    icon: Users,
    title: 'Advocacy & Action',
    description: 'Join our advocacy efforts and make your voice heard for the people of Sudan.',
    link: '/advocacy'
  }, {
    icon: Heart,
    title: 'Humanitarian Aid',
    description: 'Support our campaigns providing essential aid and relief to affected communities.',
    link: '/humanitarian'
  }];
  return <>
      <Helmet>
        <title>Sudan Hub - Connecting and Uplifting Communities</title>
        <meta name="description" content="Sudan Hub is dedicated to connecting and uplifting Sudanese communities." />
        <meta name="keywords" content="Sudan, Darfur, human rights, humanitarian aid, advocacy, Sudan conflict, justice for Sudan, human rights violations, evidence collection" />
        <link rel="canonical" href="https://sudan-action-hub.com/" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Sudan Hub - Connecting and Uplifting Communities" />
        <meta property="og:description" content= "Launching soon..." />
        <meta property="og:url" content="https://sudan-action-hub.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sudan Hub - Connecting and Uplifting Communities" />
        <meta name="twitter:description" content="A non-profit organization documenting human rights violations, supporting humanitarian efforts, and advocating for justice in Sudan." />
      </Helmet>

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }}>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Sudan Hub (SH)</h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100">Launching soon...</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/donations"> {/* Reverted to internal link */}
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                      Donate Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <Link to="/event-programming">
                  <Button size="lg" variant="outline" className="bg-blue-800 border-white text-white hover:bg-blue-700">
                    Our Work
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>
    </>;
};
export default HomePage;