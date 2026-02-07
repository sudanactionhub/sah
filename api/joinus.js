/**
 * API Handler for Join Us Form Submissions
 * 
 * Environment variables required:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_ANON_KEY: Supabase anon key (for client-side access, shown in CustomSupabaseClient)
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase service role key (for server-side operations) - KEEP PRIVATE
 * - ADMIN_EMAIL: Email address to send notifications (optional, for future email integration)
 * 
 * Deployment: This file should be placed in /api/joinus.js for Vercel deployment
 * For local development, use vite-node or a local server proxy
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL || 'https://krziguirzqciqqjbstrx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Form storage will not work in production.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || '');

// Rate limiting: simple in-memory store (reset on server restart)
// For production, use Redis or a rate limiting service
const submissionAttempts = new Map();

function checkRateLimit(ipAddress) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxAttempts = 5;

  if (!submissionAttempts.has(ipAddress)) {
    submissionAttempts.set(ipAddress, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const attempt = submissionAttempts.get(ipAddress);
  if (now > attempt.resetTime) {
    // Window expired, reset
    submissionAttempts.set(ipAddress, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (attempt.count >= maxAttempts) {
    return false;
  }

  attempt.count++;
  return true;
}

/**
 * Sanitizes string input to prevent XSS
 */
function sanitizeString(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validates email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (optional field)
 */
function isValidPhoneNumber(phone) {
  if (!phone || phone.trim() === '') return true; // Optional field
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Checks anti-spam conditions
 */
function checkAntiSpam(data) {
  const issues = [];

  // Honeypot check - if honeypot field has value, it's likely a bot
  if (data.honeypot && data.honeypot.trim() !== '') {
    issues.push('Honeypot field populated');
  }

  // Check for suspicious patterns (simple checks)
  const suspiciousKeywords = ['viagra', 'casino', 'lottery', 'prize', 'click here'];
  const allText = Object.values(data)
    .filter((v) => typeof v === 'string')
    .join(' ')
    .toLowerCase();

  for (const keyword of suspiciousKeywords) {
    if (allText.includes(keyword)) {
      issues.push(`Suspicious keyword detected: ${keyword}`);
    }
  }

  return {
    isSpam: issues.length > 0,
    issues,
  };
}

/**
 * Validates the form data structure
 */
function validateFormData(data) {
  const errors = [];

  // Required fields
  if (!data.fullName || data.fullName.trim() === '') {
    errors.push('Full name is required');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.location || data.location.trim() === '') {
    errors.push('Location is required');
  }

  if (!data.currentRole || data.currentRole.trim() === '') {
    errors.push('Current role is required');
  }

  if (!data.backgroundExperience || data.backgroundExperience.trim() === '') {
    errors.push('Background experience is required');
  }

  if (!data.drawsToHub || data.drawsToHub.trim() === '') {
    errors.push('Please tell us what draws you to Sudan Action Hub');
  }

  if (!Array.isArray(data.contributionWays) || data.contributionWays.length === 0) {
    errors.push('Please select at least one area of contribution');
  }

  if (!data.availability || data.availability.trim() === '') {
    errors.push('Please indicate your availability');
  }

  if (!data.mayContact || data.mayContact.trim() === '') {
    errors.push('Please indicate if we may contact you');
  }

  if (!data.heardAbout || data.heardAbout.trim() === '') {
    errors.push('Please tell us how you heard about us');
  }

  // Optional validations
  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  // Conditional validation: if "Other" is selected for experience, explain is required
  if (Array.isArray(data.priorExperiences) && data.priorExperiences.includes('Other')) {
    if (!data.otherExperience || data.otherExperience.trim() === '') {
      errors.push('Please explain what other experience you have');
    }
  }

  // Conditional validation: if "Other" is selected for how heard, must specify
  if (data.heardAbout === 'Other (please specify)') {
    if (!data.otherSource || data.otherSource.trim() === '') {
      errors.push('Please specify where you heard about us');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes the entire form data object
 */
function sanitizeFormData(data) {
  const sanitized = { ...data };

  const textFields = [
    'fullName',
    'email',
    'phoneNumber',
    'location',
    'organizationAffiliation',
    'portfolio',
    'currentRole',
    'backgroundExperience',
    'otherExperience',
    'drawsToHub',
    'skillsPerspectives',
    'sudanConnection',
    'additionalInfo',
    'otherSource',
  ];

  textFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeString(sanitized[field]);
    }
  });

  // For arrays, sanitize each item
  if (Array.isArray(sanitized.priorExperiences)) {
    sanitized.priorExperiences = sanitized.priorExperiences.map((item) =>
      sanitizeString(item)
    );
  }

  if (Array.isArray(sanitized.contributionWays)) {
    sanitized.contributionWays = sanitized.contributionWays.map((item) =>
      sanitizeString(item)
    );
  }

  return sanitized;
}

/**
 * Stores submission in Supabase
 */
async function storeSubmission(sanitizedData) {
  if (!supabaseServiceKey) {
    throw new Error('Server configuration incomplete: SUPABASE_SERVICE_ROLE_KEY not set');
  }

  try {
    const { data, error } = await supabase
      .from('joinus_submissions')
      .insert([
        {
          name: sanitizedData.fullName,
          email: sanitizedData.email,
          location: sanitizedData.location,
          availability: sanitizedData.availability,
          interests: JSON.stringify(sanitizedData.contributionWays),
          payload_json: sanitizedData, // Store full form data
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return {
      stored: true,
      id: data?.[0]?.id || null,
    };
  } catch (error) {
    console.error('Database storage error:', error);
    throw new Error(
      error.message || 'Failed to store submission. Please try again later.'
    );
  }
}

/**
 * Main API handler function
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are accepted',
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  try {
    const formData = req.body;

    // Get client IP for rate limiting
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown';

    // Check rate limiting
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait before submitting again',
      });
    }

    // Check anti-spam
    const spamCheck = checkAntiSpam(formData);
    if (spamCheck.isSpam) {
      console.warn('Spam submission detected:', {
        ip: clientIp,
        issues: spamCheck.issues,
        timestamp: new Date().toISOString(),
      });

      // Don't reveal to user it's spam detection
      return res.status(400).json({
        error: 'Submission failed',
        message: 'Your submission could not be processed. Please try again.',
      });
    }

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        message: validation.errors[0] || 'Please check your form data',
        errors: validation.errors,
      });
    }

    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);

    // Store in Supabase
    const storage = await storeSubmission(sanitizedData);

    // Log successful submission
    console.log('Form submission successful:', {
      id: storage.id,
      email: sanitizedData.email,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your submission. We will review your information and be in touch soon.',
      id: storage.id,
    });
  } catch (error) {
    console.error('Form submission error:', error);

    return res.status(500).json({
      error: 'Server error',
      message:
        error.message ||
        'An error occurred processing your submission. Please try again later.',
    });
  }
}

// For local development with Vite, export as CommonJS
module.exports = handler;
