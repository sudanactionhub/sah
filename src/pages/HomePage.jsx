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
    link: '/research',
    action: 'Learn More →'
  }, {
    icon: Shield,
    title: 'Advocacy',
    description: 'We work to advocate for Sudan in the media, through legislation, and via direct community engagement',
    link: '/advocacy',
    action: 'Learn More →'
  }, {
    icon: Users,
    title: 'Join Our Team',
    description: 'Contribute towards our advocacy efforts and make your voice heard for the people of Sudan.',
    link: '/JoinUs',
    action: 'Join Us →'
  }, {
    icon: Heart,
    title: 'Support our Work',
    description: 'Help Sudan Action Hub deliver humanitarian relief and justice to victims and conflict-affected communities.',
    link: '/donate',
    action: 'Donate Now →'
  }];
  return <>
      <Helmet>
        <title>Sudan Action Hub - Human Rights & Humanitarian Aid</title>
        <meta name="description" content="Sudan Action Hub is dedicated to documenting human rights violations in Sudan, supporting humanitarian efforts, and advocating for justice through research, evidence collection, and direct aid." />
        <meta name="keywords" content="Sudan, Darfur, human rights, humanitarian aid, advocacy, Sudan conflict, justice for Sudan, human rights violations, evidence collection" />
        <link rel="canonical" href="https://sudanactionhub.org/" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Sudan Action Hub - Human Rights & Humanitarian Aid" />
        <meta property="og:description" content="A non-profit organization documenting human rights violations, supporting humanitarian efforts, and advocating for justice in Sudan." />
        <meta property="og:image" content="https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/sign/sah_logo/SAHLogoTransparent_White.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mODU5YWMwYy1lOGI0LTQ5Y2MtODExMC0yMjUwNjM3ZDU1OTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzYWhfbG9nby9TQUhMb2dvVHJhbnNwYXJlbnRfV2hpdGUucG5nIiwiaWF0IjoxNzcyMTU5MDA2LCJleHAiOjIwODc1MTkwMDZ9.FI6s3PSsUB6Tdx7H1v0p4mb1XUg0Gufb5oI0_apf6E0" />   
        <meta property="og:url" content="https://sudanactionhub.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sudan Action Hub - Human Rights & Humanitarian Aid" />
        <meta name="twitter:description" content="A non-profit organization documenting human rights violations, supporting humanitarian efforts, and advocating for justice in Sudan." />
        <meta name="twitter:image" content="https://imgur.com/a/EpN8GtN" />
      </Helmet>

      <section className="bg-gradient-to-br from-[#501c21] to[#501c21] to-[#700c16] text-white py-16 lg:px-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }}>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Sudan Action Hub (SAH)</h1>
              <p className="text-xl lg:text-2xl mb-8 text-red-50">Protecting Sudan’s people, pursuing justice, and preserving truth.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/donate"> {/* Reverted to internal link */}
                    <Button size="lg" className="bg-white text-red-800 hover:bg-red-50 font-semibold">
                      Donate Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <Link to="/blog/HopeandHaven">
                  <Button size="lg" variant="outline" className="bg-red-900 border-white text-white hover:text-white hover:bg-red-700">
                    Learn More
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
            duration: 0.8
          }}>
              <img alt=" Photo of protester at Sudan rally" className="rounded-lg shadow-2xl" src="https://i.imgur.com/N9E4R0d.jpeg"
               />
              <p className="mx-auto text-sm text-gray-200 mt-1 text-justify-left">Co-Founder Samia Basheir speaking at a rally for Sudan | photo credits: @LaurenColbertMedia</p>

            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-black-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-black-600 max-w-3xl mx-auto">Sudan Action Hub mobilizes information, networks, and practical tools to support humanitarian relief, document human rights abuses, strengthen advocacy, and coordinate global action for the people of Sudan, with particular attention to victims of violence in Darfur and other affected regions. We connect individuals, grassroots groups, NGOs, researchers, and policymakers so that evidence-based advocacy, safe collaboration, and life-saving assistance can be scaled effectively.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0
          }}>
                <Link to={feature.link}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full group">
                    <feature.icon className="h-12 w-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <span className="text-green-700 font-medium group-hover:underline">
                      {feature.action} 
                    </span>
                  </div>
                </Link>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <img alt="Photo of protestors as Sudan rally" className="rounded-lg shadow-lg" src="https://krziguirzqciqqjbstrx.supabase.co/storage/v1/object/public/photo_highlights/Sudan_Rally_11-9-25-103.jpeg" />
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Evidence-Based Advocacy
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive evidence collection and research publications provide crucial documentation of human rights violations in Sudan, supporting international advocacy efforts and legal accountability.
              </p>
              <Link to="/evidence-collection">
                <Button className="bg-green-700 hover:bg-green-500">
                  Explore Evidence Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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