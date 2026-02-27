import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const effectiveDate = 'February 26, 2026'; // update anytime

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Sudan Action Hub</title>
        <meta
          name="description"
          content="Read Sudan Action Hub’s Privacy Policy to understand what information we collect, how we use it, and the choices you have."
        />
        <meta
          name="keywords"
          content="Sudan Action Hub privacy policy, data privacy, nonprofit privacy, donor privacy"
        />
        <link rel="canonical" href="https://sudan-action-hub.com/privacy" />

        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | Sudan Action Hub" />
        <meta
          property="og:description"
          content="Learn how Sudan Action Hub collects, uses, and protects personal information."
        />
        <meta property="og:url" content="https://sudan-action-hub.com/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Privacy Policy | Sudan Action Hub" />
        <meta
          name="twitter:description"
          content="Learn how Sudan Action Hub collects, uses, and protects personal information."
        />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              We’re committed to protecting your privacy and handling data responsibly.
            </p>
            <p className="mt-4 text-sm text-green-100/90">
              Effective date: <span className="font-semibold">{effectiveDate}</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-8 md:p-10"
        >
          <div className="prose prose-gray max-w-none">
             <h3 className="text-m font-medium text-gray-900 mb-8">
              Sudan Action Hub (“Sudan Action Hub,” “we,” “our,” or “us”) values your privacy.
              This Privacy Policy explains how we collect, use, disclose, and protect personal
              information when you visit our website, participate in our programs, or interact
              with us online.
            </h3>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <h3> 
              a. Information you provide</h3>
             <p className="text-gray-600 mb-4">
              We collect information you voluntarily provide when you subscribe to updates, fill out
              forms, register for events, apply to volunteer/partner, make a donation, or contact us.
              This may include your name, email address, phone number, mailing address, organizational
              affiliation, and any information you choose to share.
            </p>

            <h3>b. Information collected automatically</h3>
             <p className="text-gray-600 mb-4">
              When you use our website, we may automatically collect basic usage data such as IP
              address, browser and device information, pages viewed, referring URLs, and access times.
              This helps us maintain security and improve our website.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
             <p className="text-gray-600 mb-4">We use information to:</p>
           <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Provide requested information and respond to inquiries</li>
              <li>Share updates about our mission, events, and initiatives</li>
              <li>Manage volunteer, partnership, and program participation</li>
              <li>Process donations and provide acknowledgments/receipts</li>
              <li>Maintain website security and improve performance</li>
              <li>Comply with legal obligations</li>
            </ul>
             <p className="text-gray-600 mb-4">
              We do not sell or rent your personal information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Donations and Payment Processing</h2>
             <p className="text-gray-600 mb-4">
              Donations made through our website may be processed by third-party payment providers.
              We do not store full payment card details on our servers. Payment providers handle your
              payment information under their own privacy and security practices.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cookies and Similar Technologies</h2>
             <p className="text-gray-600 mb-4">
              We may use cookies or similar technologies to support site functionality and understand
              aggregate usage. You can control cookies through your browser settings. Disabling cookies
              may limit certain features.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. When We Share Information</h2>
             <p className="text-gray-600 mb-4">We may share information:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>With trusted service providers that help operate our website and programs</li>
              <li>If required by law, regulation, or legal process</li>
              <li>To protect the rights, safety, and integrity of Sudan Action Hub and our community</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Data Security</h2>
             <p className="text-gray-600 mb-4">
              We use reasonable administrative, technical, and organizational safeguards to protect
              personal information. No method of transmission or storage is 100% secure, but we take
              data protection seriously and continuously improve our safeguards.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. International Visitors</h2>
             <p className="text-gray-600 mb-4">
              Sudan Action Hub is based in the United States and works with partners globally. If you
              access our website from outside the U.S., you understand your information may be processed
              in the U.S. or other jurisdictions where we or our service providers operate.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Your Choices</h2>
             <p className="text-gray-600 mb-4">
              You can unsubscribe from our emails at any time using the link provided in messages.
              Depending on your location, you may also request access, correction, or deletion of
              your personal information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Third-Party Links</h2>
             <p className="text-gray-600 mb-4">
              Our website may link to third-party sites. We are not responsible for their content or
              privacy practices. Please review their privacy policies separately.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Children’s Privacy</h2>
             <p className="text-gray-600 mb-4">
              Our website is not directed to children under 13, and we do not knowingly collect personal
              information from children.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Updates to This Policy</h2>
             <p className="text-gray-600 mb-4">
              We may update this Privacy Policy periodically. Updates will be posted on this page with
              an updated effective date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">12. Contact Us</h2>
             <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or your information, contact us at:{' '}
              <a href="mailto:admin@sudanhub.org">admin@sudanhub.org</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;