import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const STRIPE_SCRIPT_SRC = 'https://js.stripe.com/v3/buy-button.js';

const DonatePage = () => {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    // If already loaded, don’t add it again
    const existing = document.querySelector(`script[src="${STRIPE_SCRIPT_SRC}"]`);
    if (existing) {
      setStripeReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = STRIPE_SCRIPT_SRC;
    script.async = true;

    script.onload = () => setStripeReady(true);
    script.onerror = () => {
      console.error('Failed to load Stripe Buy Button script.');
      setStripeReady(false);
    };

    document.body.appendChild(script);

    // Optional cleanup
    return () => {
      // Usually you can leave Stripe loaded once per app session.
      // If you *must* remove it on unmount, uncomment:
      // script.remove();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Donate | Sudan Action Hub</title>
        <meta
          name="description"
          content="Support Sudan Action Hub’s humanitarian aid and advocacy efforts by making a donation."
        />
        <link rel="canonical" href="https://sudanactionhub.org/donate" />
      </Helmet>

      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Make a contribution</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Your donation directly supports the mobilization of information, networks, and practical tools to coordinate global action for the people of Sudan. All donations are tax-exempt.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto  sm:px-8 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-16 flex flex-col items-center justify-center"
        >
          {!stripeReady ? (
            <p className="text-gray-600 mb-20">Loading secure donation form…</p>
          ) : (
            <stripe-buy-button
            buy-button-id="buy_btn_1T5Ir7EjpmldAixU3qysteV5"
            publishable-key="pk_live_51SVOh3EjpmldAixUzDQTk72O1nOqPrNurhmzwCQCFWeE8jZQsN0iA59FBNWA1CLLXA8Fe9UU04k3eQ4t5Vkkhgbp00ojMgBTfn"
            />          
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DonatePage;