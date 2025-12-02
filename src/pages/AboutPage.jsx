import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, History, Users, Award } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('founding_team').select('*').order('created_at', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching founding team:', error);
      } else {
        setTeam(data);
      }
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const values = [{
    icon: Target,
    title: 'Our Mission',
    description: 'Protecting Sudan\'s people, pursuing justice, and preserving truth.'
  }, {
    icon: Award,
    title: 'Our Vision',
    description: 'We envision a world where all Sudanese affected by conflict have access to humanitarian aid, justice for rights violations, and an empowered civic infrastructure that supports long-term recovery, accountability, and peaceful governance.'
  }, {
    icon: Users,
    title: 'Our Approach',
    description: 'Evidence-based advocacy, direct humanitarian assistance, and empowering local communities through partnership and collaboration.'
  }];

  return <>
      <Helmet>
        <title>About Us | Sudan Action Hub</title>
        <meta name="description" content="Learn about Sudan Action Hub's mission, story, and the dedicated founding team working to document human rights violations and support humanitarian efforts in Sudan." />
        <meta name="keywords" content="about Sudan Action Hub, our mission, our story, Sudan activists, humanitarian team, human rights advocates" />
        <link rel="canonical" href="https://sudan-action-hub.com/about" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="About Us | Sudan Action Hub" />
        <meta property="og:description" content="Learn about our dedication to justice, accountability, and humanitarian support for the people of Sudan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Sudan Action Hub" />
        <meta name="twitter:description" content="Learn about our dedication to justice, accountability, and humanitarian support for the people of Sudan." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa?w=1200&h=630&fit=crop" />
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dedicated to justice, accountability, and humanitarian support for the people of Sudan
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }}>
              <img alt="Sudan Action Hub team working" className="rounded-lg shadow-lg" src="https://horizons-cdn.hostinger.com/cd51f59a-01e2-4944-b968-e85ee86a9863/apm04816-K02RK.jpg" />
            </motion.div>
            <motion.div initial={{
              opacity: 0,
              x: 50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }}>
              <div className="flex items-center mb-4">
                <History className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              </div>
              <p className="text-lg text-gray-600 mb-4">Sudan Action Hub was founded in response to the escalating humanitarian crisis and human rights violations in Sudan, particularly in the Darfur region.</p>
              <p className="text-lg text-gray-600 mb-4">We information, networks, and practical tools to support humanitarian relief, document human rights abuses, strengthen advocacy, and coordinate global action for the people of Sudan — with particular attention to victims of violence in Darfur and other affected regions. </p>
              <p className="text-lg text-gray-600"> We connect individuals, grassroots groups, NGOs, researchers, and policymakers so that evidence-based advocacy, safe collaboration, and life-saving assistance can be scaled effectively.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white rounded-lg p-8 shadow-md">
                <value.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Founding Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Led by experienced professionals in human rights, humanitarian aid, and advocacy
            </p>
          </motion.div>

          {loading ? <div className="text-center text-gray-500">Loading team members...</div> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => <motion.div key={member.id} initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1
              }} className="bg-gray-50 rounded-lg p-6 text-center">
                  {member.image_url ? <img src={member.image_url} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" /> : <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </motion.div>)}
            </div>}
        </div>
      </section>
    </>;
};

export default AboutPage;