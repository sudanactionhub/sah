import react, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const DonationSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        const recordDonation = async (sessionId) => {
            try {
                const { error } = await supabase.functions.invoke('record-donation', {
                    body: { session_id: sessionId },
                });
                if (error) {
                    throw error;
                }
            } catch (err) {
                console.error("Error recording donation:", err);
                toast({
                    variant: 'destructive',
                    title: 'Recording Error',
                    description: 'There was an issue saving your donation record, but your payment was successful. Please contact us if you need a receipt.',
                });
            }
        };

        if (sessionId) {
            recordDonation(sessionId);
        }
    }, [searchParams, toast]);

  return (
    <>
      <Helmet>
        <title>Thank You for Your Donation! | Sudan Action Hub</title>
        <meta name="description" content="Your generous donation has been received. Thank you for supporting our mission and making a difference for the people of Sudan." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://sudan-action-hub.com/donation-success" />
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
              Thank You!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Your generous donation has been received. Your support is invaluable to our mission.
            </p>
            <p className="mt-2 text-md text-gray-500">
              A receipt for your donation has been sent to your email address.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/humanitarian">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Heart className="mr-2 h-5 w-5" />
                See Your Impact
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

export default DonationSuccessPage;