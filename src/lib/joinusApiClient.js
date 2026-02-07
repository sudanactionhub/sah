/**
 * Local Development API Proxy for Join Us Form
 * 
 * This file helps with local development testing before deploying to Vercel.
 * To use in development:
 * 
 * 1. Install supabase-js (already in dependencies)
 * 2. Set environment variables:
 *    - Create a .env.local file in the project root with:
 *      VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *      VITE_API_URL=http://localhost:3000 (for dev)
 * 
 * 3. For local testing without a backend server, you can:
 *    - Use the Supabase Edge Functions in development
 *    - Or add a simple proxy in vite.config.js to forward /api requests
 * 
 * Example vite.config.js server middleware:
 * import joinusHandler from './api/joinus-dev.js';
 * 
 * server: {
 *   middlewares: [
 *     (req, res, next) => {
 *       if (req.url.startsWith('/api/joinus')) {
 *         joinusHandler(req, res);
 *       } else {
 *         next();
 *       }
 *     }
 *   ]
 * }
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krziguirzqciqqjbstrx.supabase.co';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('Development Note: VITE_SUPABASE_SERVICE_ROLE_KEY not set. Using anonymous key for testing.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Development wrapper for local API testing
 * This mimics the Vercel serverless function signature
 */
export default async function devApiHandler(formData) {
  try {
    // Validate form data (basic check)
    if (!formData.email || !formData.fullName) {
      return {
        status: 400,
        body: {
          error: 'Validation failed',
          message: 'Email and name are required',
        },
      };
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('joinus_submissions')
      .insert([
        {
          name: formData.fullName,
          email: formData.email,
          location: formData.location,
          availability: formData.availability,
          interests: JSON.stringify(formData.contributionWays || []),
          payload_json: formData,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        status: 500,
        body: {
          error: 'Database error',
          message: error.message || 'Failed to store submission',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Thank you for your submission',
        id: data?.[0]?.id,
      },
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      status: 500,
      body: {
        error: 'Server error',
        message: error.message || 'An error occurred',
      },
    };
  }
}

/**
 * Production note:
 * 
 * The main handler in /api/joinus.js is designed for Vercel deployment.
 * 
 * For local development with Vite, you have two options:
 * 
 * 1. Use Supabase Edge Functions (recommended for production-like testing):
 *    - Create a function in Supabase Dashboard > Edge Functions
 *    - Copy the handler logic from /api/joinus.js
 *    - Call it from the frontend using supabase.functions.invoke()
 * 
 * 2. Use a local Node.js server:
 *    - Install express or similar
 *    - Create a separate dev server that imports /api/joinus.js
 *    - CORS will be handled automatically
 * 
 * For option 1 (Supabase Edge Functions), in the JoinUsPage component,
 * modify the fetch call to use:
 * 
 * const { data, error } = await supabase.functions.invoke('joinus', {
 *   body: submissionData,
 * });
 */
