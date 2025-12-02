import react from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, CheckCircle, Clock, ExternalLink, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HumanitarianPage = () => {
  const campaigns = [
    {
      id: 1,
    title: "A Meal for El Fasher x Wadi Howar",
    description:
      "Founded in 2017, Wadi Howar delivers humanitarian relief...",
    link: "https://wadihowar.org/447-2",
    tags: ["Aid", "Non-Profit", "Darfur"],
    image: "https://i.imgur.com/L24j9WX.jpeg",   // ⭐ Add image URL here
    imageAlt: "Man wearing vest delivering aid",
    imageDescription:
        "A man wearing the organization's vest passing out food to IDPS at a refugee camp.",
    },
    
    {id: 2,
      title: "Sudan Charity Gala",
      description:
        "Join us for the Sudan Humanitarian Gala in Washington, D.C. A night of solidarity, awareness, and fundraising to support vital humanitarian assistance in Sudan.",
      link: "https://sudan-action-hub.com/gala",
      tags: ["Charity", "Advocacy", "Fundraising"],
      image: "https://images.unsplash.com/photo-1702342456570-2a68dcd8efba?w=1200&h=630&fit=crop",   // ⭐ Add image URL here
    imageAlt: "Man wearing vest delivering aid",
    imageDescription:
        "A man wearing the organization's vest passing out food to IDPS at a refugee camp.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Humanitarian Aid Campaigns for Sudan | Sudan Action Hub</title>
        <meta
          name="description"
          content="Explore and support humanitarian aid campaigns from organizations providing essential relief, medical assistance, and resources to communities affected by the crisis in Sudan."
        />
        <meta
          name="keywords"
          content="Sudan humanitarian aid, Sudan relief campaigns, donate to Sudan, Sudan crisis, support Sudan, Darfur aid"
        />
        <link rel="canonical" href="https://sudanactionhub.org/humanitarian" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Humanitarian Aid Campaigns for Sudan | Sudan Action Hub" />
        <meta
          property="og:description"
          content="Support communities in Sudan through our direct aid fundraisers and humanitarian relief campaigns."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1629074251722-125132248df7?w=1200&h=630&fit=crop"
        />
        <meta property="og:url" content="https://sudanactionhub.org/humanitarian" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Humanitarian Aid Campaigns for Sudan | Sudan Action Hub" />
        <meta
          name="twitter:description"
          content="Support communities in Sudan through organization fundraisers and humanitarian relief campaigns."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1629074251722-125132248df7?w=1200&h=630&fit=crop"
        />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Humanitarian Aid</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Campaigns supporting communities in Sudan through direct aid delivery.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    alt={campaign.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={campaign.image}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-blue-700 hover:bg-white shadow-sm border-none">
                      Active Campaign
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {campaign.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl leading-tight">{campaign.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <CardDescription className="text-base line-clamp-4">{campaign.description}</CardDescription>
                </CardContent>

                <CardFooter className="pt-4 border-t bg-gray-50/50">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm">
                    <a href={campaign.link} target="_blank" rel="noopener noreferrer">
                      Support Campaign <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          {/* Call to Action Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full flex flex-col border-dashed border-2 border-gray-300 bg-gray-50/30 justify-center items-center text-center p-8 hover:bg-gray-50 transition-colors">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <HeartHandshake className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Your Campaign</h3>
              <p className="text-gray-500 mb-6 max-w-xs text-sm">
                Is your organization delivering humanitarian aid to Sudan? Submit your campaign for support.
              </p>
              <Button variant="outline" asChild className="border-gray-300 hover:bg-white">
                <a href="/contact">Contact Us</a>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HumanitarianPage;
