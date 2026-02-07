/**
 * SETUP INSTRUCTIONS FOR /JOINUS FORM
 * 
 * This file documents the steps needed to fully set up the Join Us form system.
 * 
 * =============================================================================
 * 1. CREATE SUPABASE TABLE
 * =============================================================================
 * 
 * Step 1a: Open your Supabase project dashboard
 * Step 1b: Go to SQL Editor
 * Step 1c: Run the migration from: db/migrations/create_joinus_submissions.sql
 * 
 * This creates the joinus_submissions table with proper indexes and RLS policies.
 * 
 * =============================================================================
 * 2. CONFIGURE ENVIRONMENT VARIABLES (PRODUCTION ONLY)
 * =============================================================================
 * 
 * For Vercel deployment, add these to your environment variables:
 * 
 * - SUPABASE_URL: https://krziguirzqciqqjbstrx.supabase.co
 * - SUPABASE_SERVICE_ROLE_KEY: [Get from Supabase > Settings > API > Service Role Key]
 * 
 * Keep the SERVICE_ROLE_KEY confidential. Never commit it to version control.
 * It's only used server-side in /api/joinus.js (Vercel serverless function).
 * 
 * For local development (optional):
 * - You can create a .env.local file at the project root
 * - Add the variables there for local testing
 * - This file is gitignored and won't be committed
 * 
 * =============================================================================
 * 3. TESTING IN DEVELOPMENT
 * =============================================================================
 * 
 * Option A: Direct Supabase (Recommended for Local Dev)
 * - The form will try to use the API endpoint first (/api/joinus)
 * - If unavailable (which it will be locally), it falls back to Supabase direct
 * - The joinus_submissions table must exist in your Supabase project
 * - Use the anonymous key (VITE_SUPABASE_ANON_KEY) - already configured
 * - Note: RLS policies in the table control who can insert/select
 * 
 * Option B: Local Vercel Functions (Advanced)
 * - Install Vercel CLI: npm i -g vercel
 * - Run: vercel dev
 * - This will locally emulate the serverless functions in /api/
 * 
 * =============================================================================
 * 4. ACCESSING THE FORM
 * =============================================================================
 * 
 * URL: http://localhost:3000/joinus (development)
 * URL: https://yourdomain.com/joinus (production)
 * 
 * The page is intentionally hidden from navigation menus (not linked in header/footer).
 * Share the link directly or via QR code as needed.
 * 
 * =============================================================================
 * 5. MONITORING SUBMISSIONS
 * =============================================================================
 * 
 * View submissions in Supabase:
 * 1. Open Supabase Dashboard
 * 2. Go to Table Editor
 * 3. Select "joinus_submissions" table
 * 4. Review entries
 * 
 * The table has these fields:
 * - id: Unique submission ID
 * - created_at: Submission timestamp
 * - name: Submitter's full name
 * - email: Contact email
 * - location: City/Country
 * - availability: Level of availability
 * - interests: JSON array of selected contribution areas
 * - payload_json: Complete form data (all fields)
 * - user_agent: Browser info for tracking
 * - ip_address: Optional IP tracking (currently unused)
 * 
 * =============================================================================
 * 6. OPTIONAL: ADMIN EMAIL NOTIFICATIONS
 * =============================================================================
 * 
 * Currently, submissions are stored in Supabase only.
 * To add email notifications:
 * 
 * Option A: Use Supabase Webhooks + Zapier/Make.com
 * - Set up a webhook on the joinus_submissions table
 * - On INSERT event, trigger an external service
 * - Have that service send emails
 * 
 * Option B: Add Sendgrid/Mailgun integration to /api/joinus.js
 * - Install: npm install @sendgrid/mail (or similar)
 * - Add env var: SENDGRID_API_KEY
 * - Update /api/joinus.js to send email on successful submission
 * 
 * Option C: Use Supabase Functions + Resend
 * - Create a Supabase Edge Function
 * - Call it from /api/joinus.js after storing the submission
 * - Reference: https://supabase.com/docs/guides/functions
 * 
 * =============================================================================
 * 7. SECURITY NOTES
 * =============================================================================
 * 
 * ✓ Form data is sanitized on both client and server
 * ✓ Anti-spam: Honeypot field + rate limiting (5 requests per minute per IP)
 * ✓ All inputs validated against expected patterns
 * ✓ XSS protection via HTML entity encoding
 * ✓ CSRF: Uses standard CORS checks (POST from same origin preferred)
 * 
 * ⚠ RLS Policies: Update the joinus_submissions table RLS policies
 *   to match your authentication system if needed.
 * 
 * ⚠ Service Role Key: Keep SUPABASE_SERVICE_ROLE_KEY extremely confidential.
 *   It has admin access to the database. Never expose it to the client.
 * 
 * =============================================================================
 * 8. CUSTOMIZATION
 * =============================================================================
 * 
 * To modify form fields:
 * 1. Edit src/utils/joinusValidation.js - update VALIDATION_RULES
 * 2. Edit src/pages/JoinUsPage.jsx - update form sections
 * 3. Update /api/joinus.js - update server-side validation
 * 4. Re-run the Supabase migration if table schema changes
 * 
 * To change form appearance:
 * - Modify Tailwind classes in JoinUsPage.jsx
 * - The component uses the project's existing color scheme (blue-600, etc.)
 * - All spacing tokens are consistent with the rest of the site
 * 
 * =============================================================================
 * 9. TROUBLESHOOTING
 * =============================================================================
 * 
 * Issue: Form won't submit
 * - Check browser console for errors
 * - Verify joinus_submissions table exists in Supabase
 * - Ensure VITE_SUPABASE_ANON_KEY is correctly set
 * - Check RLS policies allow anonymous INSERT
 * 
 * Issue: Rate limiting too strict
 * - Adjust maxAttempts in /api/joinus.js (line ~22)
 * - Adjust windowMs for different time windows
 * 
 * Issue: Email/phone validation failing
 * - Update regex patterns in src/utils/joinusValidation.js
 * - Test patterns at regex101.com
 * 
 * Issue: localStorage not persisting
 * - Check browser privacy settings (Safari, Firefox)
 * - Test in incognito/private mode
 * 
 * =============================================================================
 */

// This is a documentation file. No code to execute.
console.log('Join Us form setup instructions loaded. See this file for details.');
