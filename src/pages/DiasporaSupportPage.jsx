import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DiasporaSupportPage = () => {
  const campaigns = [
    {
      id: 1,
      title: "Sudanese American Association of Indianapolis Community Center",
      description: "Help the Indianapolis Sudanese community maintain their community space. This space serves as a hub for the growing Sudanese diaspora in Indy, offering cultural programs, educational support, and a gathering place for families and refugees settling in the area.",
      link: "https://www.gofundme.com/f/support-sudanese-american-association-indy?attribution_id=sl:06d77922-8f91-43af-a128-2687d81b2dec&lang=en_US&ts=1763258484&utm_campaign=man_sharesheet_dash&utm_content=amp17_te&utm_medium=customer&utm_source=copy_link",
      tags: ["Community Building", "USA", "Indianapolis"],
      imageAlt: "Community members gathering at an event",
      imageDescription: "A group of diverse community members gathering indoors for a meeting"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Diaspora Support | Sudan Action Hub</title>
        <meta name="description" content="Supporting Sudanese student communities and refugees in the diaspora through community-led initiatives and campaigns." />
      </Helmet>

      <div className="bg-blue-50 py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-6">
              <Globe className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight mb-6">
              Diaspora Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering Sudanese communities abroad. We support student organizations, refugee assistance programs, and community centers across the USA and around the world.
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
                    src="https://scontent-iad3-2.xx.fbcdn.net/v/t39.30808-6/314695945_110263581897009_6984738353841657443_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3zgawYtBvDoQ7kNvwFKC-pN&_nc_oc=AdkUxppVeAlmQOosIKkdm6HrvKlGZAFLD4UqfJ4HsRTvVW9aJjB8RjzDC0Rqv6hcXHfP8VgjZkGZ32vto43Yt_yD&_nc_zt=23&_nc_ht=scontent-iad3-2.xx&_nc_gid=rd6QjCEleWrf3RczG4yUiA&oh=00_Afjo4l7hH68v8K4xR4kRvOiKc-VfJFgbj2og7jKtHqgFkQ&oe=6927221F" />
                   <div className="absolute top-4 right-4">
                     <Badge className="bg-white/90 text-blue-700 hover:bg-white shadow-sm border-none">
                       Active Campaign
                     </Badge>
                   </div>
                </div>
                <CardHeader>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {campaign.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 text-xl leading-tight">{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base line-clamp-4">
                    {campaign.description}
                  </CardDescription>
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
          
          {/* Call to Action Card for future submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col border-dashed border-2 border-gray-300 bg-gray-50/30 justify-center items-center text-center p-8 hover:bg-gray-50 transition-colors">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <HeartHandshake className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Diaspora Initiative</h3>
              <p className="text-gray-500 mb-6 max-w-xs text-sm">
                Are you part of a Sudanese student association or community group? Submit your initiative for support.
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

export default DiasporaSupportPage;