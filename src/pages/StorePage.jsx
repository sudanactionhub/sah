import react from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Shop to Support Sudan | Sudan Action Hub Store</title>
        <meta name="description" content="Support our cause by purchasing merchandise from our online store. All proceeds go towards our humanitarian aid, research, and advocacy efforts for Sudan." />
        <meta name="keywords" content="Sudan charity shop, support Sudan, buy merchandise, non-profit store, Sudan fundraiser store" />
        <link rel="canonical" href="https://sudan-action-hub.com/store" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Shop to Support Sudan | Sudan Action Hub Store" />
        <meta property="og:description" content="Every item you buy helps fund our vital work in advocacy, research, and humanitarian aid for Sudan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1579298245158-38e219192a5b?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/store" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop to Support Sudan | Sudan Action Hub Store" />
        <meta name="twitter:description" content="Every item you buy helps fund our vital work in advocacy, research, and humanitarian aid for Sudan." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1579298245158-38e219192a5b?w=1200&h=630&fit=crop" />
      </Helmet>

      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="h-16 w-16 mx-auto text-purple-400" />
            <h1 className="text-4xl font-bold mt-4 sm:text-5xl">Our Store</h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Support our mission by purchasing merchandise. Every item you buy helps fund our vital work in advocacy, research, and humanitarian aid for Sudan.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsList />
        </div>
      </div>
    </>
  );
};

export default StorePage;