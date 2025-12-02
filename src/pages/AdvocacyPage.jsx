import react from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Megaphone, Users, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
const AdvocacyPage = () => {
  const {
    toast
  } = useToast();
  const pastActions = [{
    title: 'Humanitarian Fundraising & Community Mobilization',
    description: 'Led large-scale fundraising efforts and community events supporting civilians in Sudan, generating critical resources for emergency aid',
    date: 'SINCE 2024',
    impact: '$50,000+ raised in the past six months'
  }, {
    title: 'Research & Documentation of Human Rights Violations',
    description: 'Collaborated on published research and ongoing archival work documenting human rights atrocities in Sudan',
    date: 'SINCE 2018',
    impact: '6+ years of abuses archived'
  }, {
    title: 'Global Advocacy, Media, & Public Engagement',
    description: 'Organized protests, lobbied legislators, spoke on panels and workshops, conducted media interviews, and coordinated international media coverage ',
    date: 'SINCE 2003',
    impact: '100+ media outlets reached'
  }];
  const ways = [{
    icon: Megaphone,
    title: 'Raise Awareness',
    description: 'Share our content on social media and educate your community about Sudan'
  }, {
    icon: FileText,
    title: 'Sign Petitions',
    description: 'Add your voice to our advocacy campaigns and petitions'
  }, {
    icon: Users,
    title: 'Join Events',
    description: 'Participate in rallies, vigils, and advocacy events'
  }, {
    icon: Share2,
    title: 'Contact Representatives',
    description: 'Urge your elected officials to take action on Sudan'
  }];
  const handleAction = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  return <>
      <Helmet>
        <title>Advocacy for Sudan - Take Action | Sudan Action Hub</title>
        <meta name="description" content="Join our advocacy efforts for Sudan. Learn about past actions, discover ways to get involved, and make your voice heard for human rights and justice." />
        <meta name="keywords" content="Sudan advocacy, take action for Sudan, Sudan petitions, Sudan human rights campaign, justice for Darfur, contact representatives" />
        <link rel="canonical" href="https://sudan-action-hub.com/advocacy" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Advocacy for Sudan - Take Action | Sudan Action Hub" />
        <meta property="og:description" content="Together, we can amplify the voices of those affected and demand justice. Find out how you can take action for Sudan." />
        {/* Removed placeholder image as per request. Ideally, these should be representative images for SEO. */}
        {/* <meta property="og:image" content="https://images.unsplash.com/photo-1590812572985-65983f15e839?w=1200&h=630&fit=crop" /> */}
        <meta property="og:url" content="https://sudan-action-hub.com/advocacy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advocacy for Sudan - Take Action | Sudan Action Hub" />
        <meta name="twitter:description" content="Together, we can amplify the voices of those affected and demand justice. Find out how you can take action for Sudan." />
        {/* Removed placeholder image as per request. Ideally, these should be representative images for SEO. */}
        {/* <meta name="twitter:image" content="https://images.unsplash.com/photo-1590812572985-65983f15e839?w=1200&h=630&fit=crop" /> */}
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center">
            <Megaphone className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Advocacy & Action</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Together, we can amplify the voices of those affected and demand justice
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Take Actions</h2>
            <p className="text-lg text-gray-600">
              Our advocacy efforts have made a real impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pastActions.map((action, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-gray-50 rounded-lg p-6">
                <div className="text-blue-600 font-semibold mb-2">{action.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-md inline-block">
                  {action.impact}
                </div>
              </motion.div>)}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-lg text-gray-600">
              There are many ways you can support our advocacy efforts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ways.map((way, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <way.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {way.title}
                </h3>
                <p className="text-gray-600">{way.description}</p>
              </motion.div>)}
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mt-12">
            <Button size="lg" onClick={handleAction} className="bg-blue-600 hover:bg-blue-700">
              Take Action Now
            </Button>
          </motion.div>
        </div>
      </section>
    </>;
};
export default AdvocacyPage;