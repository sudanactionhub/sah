import react from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Successful! | Sudan Action Hub Store</title>
        <meta name="description" content="Thank you for your order! Your purchase helps support our mission in Sudan." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://sudan-action-hub.com/success" />
      </Helmet>
      <div className="bg-gray-50 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-6 text-4xl font-bold text-gray-900">
              Thank You for Your Order!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Your payment was successful and your order is being processed.
            </p>
            <p className="mt-2 text-md text-gray-500">
              You will receive an email confirmation shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/store">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full">
                <Home className="mr-2 h-5 w-5" />
                Back to Homepage
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;