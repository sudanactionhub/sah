/**
 * Validation utilities for the Join Us form
 * Provides client-side and server-side validation patterns
 */

export const FORM_FIELDS = {
  // Basic Information
  fullName: 'fullName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  location: 'location',
  organizationAffiliation: 'organizationAffiliation',
  portfolio: 'portfolio',

  // Background & Experience
  currentRole: 'currentRole',
  backgroundExperience: 'backgroundExperience',
  priorExperiences: 'priorExperiences',
  otherExperience: 'otherExperience',

  // Interests
  drawsToHub: 'drawsToHub',
  contributionWays: 'contributionWays',
  skillsPerspectives: 'skillsPerspectives',

  // Level of Engagement
  availability: 'availability',
  hoursPerMonth: 'hoursPerMonth',

  // Additional Context
  sudanConnection: 'sudanConnection',
  additionalInfo: 'additionalInfo',

  // Next Steps
  mayContact: 'mayContact',
  heardAbout: 'heardAbout',
  otherSource: 'otherSource',

  // Anti-spam
  honeypot: 'honeypot',
};

export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNumber: {
    required: false,
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  organizationAffiliation: {
    required: false,
    maxLength: 200,
  },
  portfolio: {
    required: false,
    maxLength: 500,
  },
  currentRole: {
    required: true,
    minLength: 3,
    maxLength: 300,
  },
  backgroundExperience: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  priorExperiences: {
    required: false,
  },
  otherExperience: {
    required: false, // Will be required if 'Other' is selected
    maxLength: 300,
  },
  drawsToHub: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  contributionWays: {
    required: true,
    minCount: 1,
  },
  skillsPerspectives: {
    required: false,
    maxLength: 1000,
  },
  availability: {
    required: true,
  },
  hoursPerMonth: {
    required: false,
  },
  sudanConnection: {
    required: false,
    maxLength: 1000,
  },
  additionalInfo: {
    required: false,
    maxLength: 1000,
  },
  mayContact: {
    required: true,
  },
  heardAbout: {
    required: true,
  },
  otherSource: {
    required: false, // Will be required if 'Other' is selected
    minLength: 2,
    maxLength: 300,
  },
};

/**
 * Canonical field order as displayed to the user (top-to-bottom across all steps)
 * Used to determine which field to focus on submit validation failure
 */
export const FIELD_ORDER = [
  // Step 0: Basic Information
  'fullName',
  'email',
  'phoneNumber',
  'location',
  'organizationAffiliation',
  'portfolio',
  
  // Step 1: Background & Experience
  'currentRole',
  'backgroundExperience',
  'priorExperiences',
  'otherExperience',
  
  // Step 2: Interests & Contribution
  'drawsToHub',
  'contributionWays',
  'skillsPerspectives',
  
  // Step 3: Level of Engagement
  'availability',
  'hoursPerMonth',
  
  // Step 4: Additional Context
  'sudanConnection',
  'additionalInfo',
  
  // Step 5: Next Steps
  'mayContact',
  'heardAbout',
  'otherSource',
];

/**
 * Maps each field to its step index
 */
export const FIELD_TO_STEP = {
  // Step 0
  fullName: 0,
  email: 0,
  phoneNumber: 0,
  location: 0,
  organizationAffiliation: 0,
  portfolio: 0,
  
  // Step 1
  currentRole: 1,
  backgroundExperience: 1,
  priorExperiences: 1,
  otherExperience: 1,
  
  // Step 2
  drawsToHub: 2,
  contributionWays: 2,
  skillsPerspectives: 2,
  
  // Step 3
  availability: 3,
  hoursPerMonth: 3,
  
  // Step 4
  sudanConnection: 4,
  additionalInfo: 4,
  
  // Step 5
  mayContact: 5,
  heardAbout: 5,
  otherSource: 5,
};

/**
 * Validates a single field
 */
export function validateField(fieldName, value, formData = {}) {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return { valid: true, error: null };

  const errors = [];

  // Check required
  if (rules.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) errors.push('This field is required');
    } else if (!value || value.trim() === '') {
      errors.push('This field is required');
    }
  }

  // Handle array (checkboxes)
  if (Array.isArray(value) && rules.minCount && value.length < rules.minCount) {
    errors.push(`Please select at least ${rules.minCount} option`);
  }

  // Handle string validations
  if (typeof value === 'string' && value.trim()) {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`);
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(getFieldErrorMessage(fieldName));
    }
  }

  // Conditional validations
  if (fieldName === 'otherExperience' && formData.priorExperiences?.includes('Other')) {
    if (!value || value.trim() === '') {
      errors.push('Please explain your other experience');
    }
  }

  if (fieldName === 'otherSource' && formData.heardAbout === 'Other') {
    if (!value || value.trim() === '') {
      errors.push('Please specify where you heard about us');
    }
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
  };
}

/**
 * Validates an entire form
 */
export function validateForm(formData) {
  const errors = {};
  let isValid = true;

  Object.keys(VALIDATION_RULES).forEach((fieldKey) => {
    const result = validateField(fieldKey, formData[fieldKey], formData);
    if (!result.valid) {
      errors[fieldKey] = result.error;
      isValid = false;
    }
  });

  return { valid: isValid, errors };
}
/**
 * Validates the entire form and returns invalid fields in canonical order
 * @returns { valid: boolean, errors: {}, invalidFieldsOrdered: [fieldName1, fieldName2, ...] }
 */
export function validateFullForm(formData) {
  const errors = {};
  const invalidFields = [];

  // Validate all fields
  Object.keys(VALIDATION_RULES).forEach((fieldKey) => {
    const result = validateField(fieldKey, formData[fieldKey], formData);
    if (!result.valid) {
      errors[fieldKey] = result.error;
      invalidFields.push(fieldKey);
    }
  });

  // Sort invalid fields by canonical field order
  const invalidFieldsOrdered = FIELD_ORDER.filter((field) =>
    invalidFields.includes(field)
  );

  return {
    valid: invalidFieldsOrdered.length === 0,
    errors,
    invalidFieldsOrdered,
  };
}

/**
 * Gets the first invalid field from full-form validation
 * Returns: { fieldName, step, errors } or null if all valid
 */
export function getFirstInvalidField(formData) {
  const validation = validateFullForm(formData);
  
  if (validation.valid) {
    return null;
  }
 
  const firstInvalidField = validation.invalidFieldsOrdered[0];
  const step = FIELD_TO_STEP[firstInvalidField];
  
  return {
    fieldName: firstInvalidField,
    step,
    errors: validation.errors,
    allErrors: validation.errors,
  };
}
export function validateStep(step, formData) {
  const stepFields = {
    0: [
      'fullName',
      'email',
      'phoneNumber',
      'location',
      'organizationAffiliation',
      'portfolio',
    ],
    1: [
      'currentRole',
      'backgroundExperience',
      'priorExperiences',
      'otherExperience',
    ],
    2: [
      'drawsToHub',
      'contributionWays',
      'skillsPerspectives',
    ],
    3: [
      'availability',
      'hoursPerMonth',
    ],
    4: [
      'sudanConnection',
      'additionalInfo',
    ],
    5: [
      'mayContact',
      'heardAbout',
      'otherSource',
    ],
  };

  const fields = stepFields[step] || [];
  const errors = {};
  let isValid = true;

  fields.forEach((fieldKey) => {
    const result = validateField(fieldKey, formData[fieldKey], formData);
    if (!result.valid) {
      errors[fieldKey] = result.error;
      isValid = false;
    }
  });

  return { valid: isValid, errors };
}

/**
 * Gets user-friendly error message for a field
 */
function getFieldErrorMessage(fieldName) {
  const messages = {
    email: 'Please enter a valid email address',
    phoneNumber: 'Please enter a valid phone number',
    portfolio: 'Please enter a valid URL or at least include a protocol (http/https)',
  };
  return messages[fieldName] || 'Invalid format';
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(text) {
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
 * Normalizes URL - adds protocol if missing
 */
export function normalizeUrl(url) {
  if (!url) return '';
  url = url.trim();
  if (!url) return '';
  if (!/^https?:\/\//.test(url)) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Sanitizes an entire form object
 */
export function sanitizeFormData(formData) {
  const sanitized = { ...formData };
  
  // Sanitize text fields
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
      sanitized[field] = sanitizeInput(sanitized[field]);
    }
  });

  // Normalize URL if provided
  if (sanitized.portfolio) {
    sanitized.portfolio = normalizeUrl(sanitized.portfolio);
  }

  return sanitized;
}

/**
 * Checks anti-spam conditions
 */
export function checkAntiSpam(formData) {
  const issues = [];

  // Honeypot check
  if (formData.honeypot && formData.honeypot.trim() !== '') {
    issues.push('Spam detection triggered');
  }

  return {
    isSpam: issues.length > 0,
    issues,
  };
}

/**
 * Prepares form data for submission
 */
export function prepareSubmissionData(formData) {
  return {
    ...sanitizeFormData(formData),
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
}