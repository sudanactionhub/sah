/**
 * Validation utilities for the Local Advocacy Intake form
 * Provides client-side validation, sanitization, and submission preparation.
 */

export const VALIDATION_RULES = {
  firstname: { required: true, minLength: 2, maxLength: 100 },
  lastname: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phonenumber: { required: false, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ },
  city: { required: true, minLength: 2, maxLength: 200 },
  state: { required: true, minLength: 2, maxLength: 100 },
  zipcode: { required: true, minLength: 3, maxLength: 5 },
  organizationAffiliation: { required: false, maxLength: 200 },
  involvementlevel: { required: true },
  availability: { required: true },
  hoursPerWeek: { required: false },
  contributionWays: { required: true },
  sudanConnection: { required: false, maxLength: 1000 },
  additionalInfo: { required: false, maxLength: 1000 },
  heardAbout: { required: false },
  otherSource: { required: false, minLength: 2, maxLength: 300 },
  honeypot: { required: false },
};

export const FIELD_ORDER = [
  'firstname',
  'lastname',
  'email',
  'phonenumber',
  'city',
  'state',
  'zipcode',
  'organizationAffiliation',
  'involvementlevel',
  'availability',
  'hoursPerWeek',
  'contributionWays',
  'sudanConnection',
  'additionalInfo',
  'heardAbout',
  'otherSource',
  'honeypot',
];

export const FIELD_TO_STEP = {
  firstname: 0,
  lastname: 0,
  email: 0,
  phonenumber: 0,
  city: 0,
  state: 0,
  zipcode: 0,
  organizationAffiliation: 0,
  involvementlevel: 1,
  availability: 1,
  hoursPerWeek: 1,
  contributionWays: 2,
  sudanConnection: 2,
  additionalInfo: 2,
  heardAbout: 2,
  otherSource: 2,
  honeypot: 2,
};

function getFieldErrorMessage(fieldName) {
  const messages = {
    email: 'Please enter a valid email address',
    phonenumber: 'Please enter a valid phone number',
    portfolio: 'Please enter a valid URL or include http/https',
  };
  return messages[fieldName] || 'Please correct this field';
}

export function validateField(fieldName, value, formData = {}) {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return { valid: true, error: null };

  const errors = [];

  if (rules.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) errors.push('This field is required');
    } else if (!value || value.toString().trim() === '') {
      errors.push('This field is required');
    }
  }

  if (Array.isArray(value) && rules.minCount && value.length < rules.minCount) {
    errors.push(`Please select at least ${rules.minCount} option${rules.minCount > 1 ? 's' : ''}`);
  }

  if (typeof value === 'string' && value.trim()) {
    if (rules.minLength && value.trim().length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`);
    }
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`);
    }
    if (rules.pattern && !rules.pattern.test(value.trim())) {
      errors.push(getFieldErrorMessage(fieldName));
    }
  }

  if (fieldName === 'otherExperience' && formData.priorExperiences?.includes('Other')) {
    if (!value || value.toString().trim() === '') {
      errors.push('Please explain your other experience');
    }
  }

  if (fieldName === 'otherSource' && formData.heardAbout === 'Other (please specify)') {
    if (!value || value.toString().trim() === '') {
      errors.push('Please specify where you heard about us');
    }
  }

  return { valid: errors.length === 0, error: errors.length > 0 ? errors[0] : null };
}

export function validateStep(step, formData) {
  const stepFields = {
    0: ['firstname', 'lastname', 'email', 'phonenumber', 'city', 'state', 'zipcode', 'organizationAffiliation'],
    1: ['involvementlevel', 'availability', 'hoursPerWeek'],
    2: ['contributionWays', 'sudanConnection', 'additionalInfo'],
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

export function validateFullForm(formData) {
  const errors = {};
  const invalidFields = [];

  Object.keys(VALIDATION_RULES).forEach((fieldKey) => {
    const result = validateField(fieldKey, formData[fieldKey], formData);
    if (!result.valid) {
      errors[fieldKey] = result.error;
      invalidFields.push(fieldKey);
    }
  });

  const invalidFieldsOrdered = FIELD_ORDER.filter((field) => invalidFields.includes(field));

  return {
    valid: invalidFieldsOrdered.length === 0,
    errors,
    invalidFieldsOrdered,
  };
}

export function getFirstInvalidField(formData) {
  const validation = validateFullForm(formData);
  if (validation.valid) return null;

  const firstInvalidField = validation.invalidFieldsOrdered[0];
  return {
    fieldName: firstInvalidField,
    step: FIELD_TO_STEP[firstInvalidField],
    errors: validation.errors,
    allErrors: validation.errors,
  };
}

export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function sanitizeFormData(formData) {
  const sanitized = { ...formData };

  const textFields = [
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'city',
    'state',
    'zipcode',
    'organizationAffiliation',
    'involvementlevel',
    'sudanConnection',
    'additionalInfo',
    'otherSource',
    'honeypot',
  ];

  textFields.forEach((field) => {
    if (sanitized[field] != null) {
      sanitized[field] = sanitizeInput(String(sanitized[field]));
    }
  });

  if (Array.isArray(sanitized.priorExperiences)) {
    sanitized.priorExperiences = sanitized.priorExperiences.map((item) => sanitizeInput(String(item)));
  }
  if (Array.isArray(sanitized.contributionWays)) {
    sanitized.contributionWays = sanitized.contributionWays.map((item) => sanitizeInput(String(item)));
  }

  return sanitized;
}

export function checkAntiSpam(formData) {
  const issues = [];
  if (formData.honeypot && formData.honeypot.trim() !== '') {
    issues.push('Honeypot field populated');
  }
  return {
    isSpam: issues.length > 0,
    issues,
  };
}

export function prepareSubmissionData(formData) {
  return {
    ...sanitizeFormData(formData),
    submittedAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  };
}
