import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import {
  validateStep,
  sanitizeFormData,
  checkAntiSpam,
  prepareSubmissionData,
  validateFullForm,
  getFirstInvalidField,
  FIELD_TO_STEP,
} from '@/utils/localadvocacyValidation';

const STEPS = [
  { title: 'Basic Information', description: 'Let\'s start with your contact details' },
  { title: 'Level of Engagement', description: 'How would you like to be involved?' },
  { title: 'Additional Context', description: 'Any other information we should know?' },
];

const CONTRIBUTION_OPTIONS = [
  'Media and public awareness',
  'Policy Research',
  'Events & convenings',
  'Press and communications',
  'Community mobilization organizing',
  'Strategic planning or advising',
  'Not sure yet / open to discussion',
];

const EXPERIENCE_OPTIONS = [
  'Humanitarian or nonprofit work',
  'Policy, advocacy, or human rights',
  'Research or data analysis',
  'Fundraising or donor relations',
  'Communications, media, or storytelling',
  'Program design or implementation',
  'Finance, accounting, or legal work',
  'Community organizing or grassroots leadership',
  'International or diaspora-based work',
  'Board service or organizational governance',
  'Other (please specify)',
];

const INVOLVEMENTLEVEL_OPTIONS = [
  'Local lead or organizer',
  'Participant',
];

const AVAILABILITY_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const HOURS_OPTIONS = [
  '<1 hour',
  '1–2 hours',
  '3–5 hours',
  '6+ hours',
  'Depends on the week',
];



const LocalAdvocacyIntakeForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('localadvocacyFormData');
      return saved ? JSON.parse(saved) : getInitialFormData();
    } catch {
      return getInitialFormData();
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  function focusFirstInvalidField(fieldName) {
    if (!fieldName) return;
    let el = document.querySelector(`[name="${fieldName}"]`);
    if (!el) el = document.querySelector(`fieldset [data-field-name="${fieldName}"] input`);
    if (!el) {
      const label = document.querySelector(`label[for="${fieldName}"]`);
      if (label) el = label.parentElement?.querySelector('input, select, textarea');
    }
    if (el && typeof el.focus === 'function') {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function getInitialFormData() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: '',
      city: '',
      state: '',
      zipcode: '',
      portfolio: '',
      currentRole: '',
      backgroundExperience: '',
      organizationAffiliation: '',
      priorExperiences: [],
      otherExperience: '',
      drawsToHub: '',
      contributionWays: [],
      skillsPerspectives: '',
      involvementlevel: '',
      availability: [],
      hoursPerWeek: '',
      sudanConnection: '',
      additionalInfo: '',
      honeypot: '',
    };
  }

  useEffect(() => {
    localStorage.setItem('localadvocacyFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' && Array.isArray(prev[name])
        ? checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value)
        : type === 'checkbox'
        ? checked
          ? value
          : ''
        : value,
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleCheckboxChange = (value, fieldName) => {
    setFormData((prev) => {
      const arr = prev[fieldName] || [];
      return { ...prev, [fieldName]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
    if (errors[fieldName]) setErrors((p) => ({ ...p, [fieldName]: null }));
  };

  const handleRadioChange = (value, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) setErrors((p) => ({ ...p, [fieldName]: null }));
  };

   const goNext = () => {
   const validation = validateStep(currentStep, formData);
     if (!validation.valid) {
       setErrors(validation.errors);
       const firstInvalid = Object.keys(validation.errors)[0];
       if (firstInvalid) {
         setTimeout(() => focusFirstInvalidField(firstInvalid), 0);
       }
       return;
     }
     setErrors({});
     setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
   };
   const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));
 
   const handleSubmit = async (e) => {
     e.preventDefault();
 
     const validation = validateFullForm(formData);
     if (!validation.valid) {
       setErrors(validation.errors);
       const firstInvalid = getFirstInvalidField(formData);
       if (firstInvalid) {
         setCurrentStep(firstInvalid.step);
         setTimeout(() => focusFirstInvalidField(firstInvalid.fieldName), 0);
       }
       toast({ variant: 'destructive', title: 'Please complete the highlighted required fields', description: 'Review the errors below.' });
       return;
     }
 
     const spamCheck = checkAntiSpam(formData);
     if (spamCheck.isSpam) {
       toast({ variant: 'destructive', title: 'Submission blocked', description: 'Our security system flagged this submission.' });
       return;
     }
 
     setLoading(true);
     setErrors({});
     try {
       const submissionData = prepareSubmissionData(formData);
       let success = false;
       let err = null;
       try {
         const resp = await fetch('/api/localadvocacy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submissionData) });
         const data = await resp.json();
         if (!resp.ok) throw new Error(data.error || 'Failed to submit form');
         success = true;
       } catch (apiErr) {
         console.log('API failed, falling back to Supabase direct:', apiErr.message);
         const { error: dbError } = await supabase.from('localadvocacy_submissions').insert([{
           firstname: submissionData.firstname,
           lastname: submissionData.lastname,
           email: submissionData.email,
           phonenumber: submissionData.phonenumber,
           city: submissionData.city,
           state: submissionData.state,
           zipcode: submissionData.zipcode,
           involvementlevel: JSON.stringify(submissionData.involvementlevel || ''),
           payload_json: submissionData,
           created_at: new Date().toISOString(),
         }]);
         if (dbError) err = dbError; else success = true;
       }
       if (!success) throw err || new Error('Failed to submit form');
       localStorage.removeItem('localadvocacyFormData');
       setSubmitted(true);
       toast({ title: 'Thank you!', description: 'Your submission has been received.' });
     } catch (error) {
       console.error('Submission error:', error);
       toast({ variant: 'destructive', title: 'Submission failed', description: error.message || 'Please try again later.' });
     } finally {
       setLoading(false);
     }
   };
 
   const handleClearForm = () => {
     if (!window.confirm('Are you sure you want to clear all your responses?')) return;
     setFormData(getInitialFormData());
     setErrors({});
     setCurrentStep(0);
     localStorage.removeItem('localadvocacyFormData');
     toast({ title: 'Form cleared', description: 'All responses have been removed.' });
   };
 
  if (submitted) return <SuccessScreen />;

  return (
    <>
      <Helmet>
        <title>Local Advocacy Intake Form - Sudan Action Hub</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Join Sudan Action Hub as a volunteer, advisor, partner, or future board member." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Local Advocacy Initiative – Volunteer Interest Form</h1>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              Sudan is facing one of the world’s worst humanitarian crises, with mass atrocities, ethnic violence, and millions displaced since war erupted in April 2023. Decolonize Sudan and Sudan Action Hub are organizing local meetings with state representatives across the United States, allowing advocates to speak directly with lawmakers and push for meaningful action to end the war.
  </p>
  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
             Be an advocates and help raise awareness, demand accountability for the violence, push for policies that can stop the bloodshed, and increase urgently needed humanitarian aid. If you’d like to help organize meetings with your state lawmakers, or attend meetings as a volunteer, fill out the following form and we’ll follow up.
            
            </p>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map((step, index) => (
                <div key={index} className={`flex-1 h-2 rounded-full mx-1 transition-colors ${index <= currentStep ? 'bg-green-600' : 'bg-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">Step {currentStep + 1} of {STEPS.length}</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg p-8 sm:p-10">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
              <p className="text-gray-600 text-sm mt-1">{STEPS[currentStep].description}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {renderStepContent(currentStep, formData, handleInputChange, handleCheckboxChange, handleRadioChange, errors)}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <Button type="button" variant="outline" onClick={goBack} disabled={currentStep === 0} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={goNext} className="flex items-center gap-2">Next <ChevronRight className="h-4 w-4" /></Button>
                ) : (
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">{loading ? 'Submitting...' : 'submit'}</Button>
                )}
              </div>

              <div className="mt-4 text-center">
                <button type="button" onClick={handleClearForm} className="text-sm text-gray-500 hover:text-gray-700 underline">Clear form</button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

function renderStepContent(step, formData, handleInputChange, handleCheckboxChange, handleRadioChange, errors) {
  switch (step) {
    case 0:
      return <BasicInformationStep formData={formData} handleInputChange={handleInputChange} errors={errors} />;
    case 1:
      return <EngagementStep formData={formData} handleInputChange={handleInputChange} handleRadioChange={handleRadioChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />;
    case 2:
      return <AdditionalContextStep formData={formData} handleRadioChange={handleRadioChange} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />;
    {/*} case 3:
      return <NextStepsStep formData={formData} handleRadioChange={handleRadioChange} handleInputChange={handleInputChange} errors={errors} />;
   */}
      default:
      return null;
  }
}

function BasicInformationStep({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-6">
      <input type="hidden" name="honeypot" value={formData.honeypot} onChange={handleInputChange} />

      <FormField label="First Name" required error={errors?.firstname}>
        <input type="text" name="firstname" value={formData.firstname} onChange={handleInputChange} placeholder="John" className={inputClass(errors?.firstname)} />
      </FormField>

      <FormField label="Last Name" required error={errors?.lastname}>
        <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} placeholder="Doe" className={inputClass(errors?.lastname)} />
      </FormField>

      <FormField label="Email Address" required error={errors?.email}>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={inputClass(errors?.email)} />
      </FormField>

      <FormField label="Phone Number" error={errors?.phonenumber} helperText="Optional: include country code for international numbers">
        <input type="tel" name="phonenumber" value={formData.phonenumber} onChange={handleInputChange} placeholder="+1 (xxx) xxx-xxxx" className={inputClass(errors?.phonenumber)} />
      </FormField>

      <FormField label="City" required error={errors?.city}>
        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Washington" className={inputClass(errors?.city)} />
      </FormField>

       <FormField label="State" required error={errors?.state}>
        <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="DC" className={inputClass(errors?.state)} />
      </FormField>

       <FormField label="Zipcode" required error={errors?.zipcode}>
        <input type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} placeholder="20001" className={inputClass(errors?.zipcode)} />
      </FormField>

      <FormField label="Organization or Affiliation" error={errors?.organizationAffiliation} helperText="Optional: include if relevant">
        <input type="text" name="organizationAffiliation" value={formData.organizationAffiliation} onChange={handleInputChange} placeholder="Your organization" className={inputClass(errors?.organizationAffiliation)} />
      </FormField>
{/*}
      <FormField label="LinkedIn, Website, or Portfolio" error={errors?.portfolio} helperText="Optional">
        <input type="text" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="linkedin.com/in/yourprofile or yourwebsite.com" className={inputClass(errors?.portfolio)} />
      </FormField>
        */}
    </div>
  );
}
{/*}
function BackgroundExperienceStep({ formData, handleInputChange, handleCheckboxChange, errors }) {
  return (
    <div className="space-y-6">
      <FormField label="Current Professional Role or Primary Area of Work" required error={errors?.currentRole} helperText="e.g., Software Engineer, Program Manager, Nonprofit Director">
        <input type="text" name="currentRole" value={formData.currentRole} onChange={handleInputChange} placeholder="Your current role" className={inputClass(errors?.currentRole)} />
      </FormField>

      <FormField label="Briefly Describe Your Background and Relevant Experience" required error={errors?.backgroundExperience} helperText="Tell us about your professional journey and key accomplishments">
        <textarea name="backgroundExperience" value={formData.backgroundExperience} onChange={handleInputChange} placeholder="Share your background..." rows="5" className={inputClass(errors?.backgroundExperience)} />
      </FormField>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Do You Have Prior Experience With Any of the Following?</label>
        <p className="text-xs text-gray-600 mb-3">Optional, but we'd love to know</p>
        <fieldset className="space-y-2">
          <legend className="sr-only">Prior experience</legend>
          {EXPERIENCE_OPTIONS.map((option) => (
            <div key={option} className="flex items-start">
              <input type="checkbox" id={`experience-${option}`} checked={formData.priorExperiences?.includes(option) || false} onChange={() => handleCheckboxChange(option, 'priorExperiences')} className="mt-1 rounded" />
              <label htmlFor={`experience-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.priorExperiences && <ErrorMessage message={errors.priorExperiences} />}
      </div>

      {formData.priorExperiences?.includes('Other') && (
        <FormField label="If You Selected 'Other,' Please Explain" error={errors?.otherExperience}>
          <input type="text" name="otherExperience" value={formData.otherExperience} onChange={handleInputChange} placeholder="Please specify..." className={inputClass(errors?.otherExperience)} />
        </FormField>
      )}
    </div>
  );
}

function InterestsStep({ formData, handleInputChange, handleCheckboxChange, errors }) {
  return (
    <div className="space-y-6">
      <FormField label="What Draws You to Sudan Action Hub?" required error={errors?.drawsToHub} helperText="Tell us about your motivation and passion">
        <textarea name="drawsToHub" value={formData.drawsToHub} onChange={handleInputChange} placeholder="Share what excites you..." rows="5" className={inputClass(errors?.drawsToHub)} />
      </FormField>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">In What Ways Are You Most Interested in Contributing? <span className="text-red-500">*</span></label>
        <p className="text-xs text-gray-600 mb-3">Select at least one area</p>
        <fieldset className="space-y-2">
          <legend className="sr-only">Contribution interests</legend>
          {CONTRIBUTION_OPTIONS.map((option) => (
            <div key={option} className="flex items-start">
              <input type="checkbox" id={`contribution-${option}`} checked={formData.contributionWays?.includes(option) || false} onChange={() => handleCheckboxChange(option, 'contributionWays')} className="mt-1 rounded" />
              <label htmlFor={`contribution-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.contributionWays && <ErrorMessage message={errors.contributionWays} />}
      </div>

      <FormField label="Are There Specific Skills, Perspectives, or Resources You Would Bring to Our Work?" error={errors?.skillsPerspectives} helperText="Optional: highlight unique contributions">
        <textarea name="skillsPerspectives" value={formData.skillsPerspectives} onChange={handleInputChange} placeholder="Describe your unique skills..." rows="4" className={inputClass(errors?.skillsPerspectives)} />
      </FormField>
    </div>
  );
}
*/}

function EngagementStep({ formData, handleInputChange, handleRadioChange, handleCheckboxChange, errors }) {
  return (
      <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Would you like to be a local lead or participant? <span className="text-red-500">*</span></label>
        <fieldset className="space-y-3">
          <legend className="sr-only">Level of Involvement</legend>
          {INVOLVEMENTLEVEL_OPTIONS.map((option) => (
            <div key={option} className="flex items-center">
              <input type="radio" id={`involvementlevel-${option}`} name="involvementlevel" value={option} checked={formData.involvementlevel === option} onChange={() => handleRadioChange(option, 'involvementlevel')} className="rounded-full" />
              <label htmlFor={`involvementlevel-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.involvementlevel && <ErrorMessage message={errors.involvementlevel} />}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">What Days of the Week Are You Available to Participate? <span className="text-red-500">*</span></label>
        <fieldset className="space-y-3">
          <legend className="sr-only">Current availability</legend>
          {AVAILABILITY_OPTIONS.map((option) => (
            <div key={option} className="flex items-start">
              <input type="checkbox" id={`availability-${option}`} checked={formData.availability?.includes(option) || false} onChange={() => handleCheckboxChange(option, 'availability')} className="mt-1 rounded" /> 
              <label htmlFor={`availability-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.availability && <ErrorMessage message={errors.availability} />}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">How Many Hours Per Week Would You Realistically Be Able to Contribute?</label>
        <p className="text-xs text-gray-600 mb-3">Optional: if not sure, you can leave this blank</p>
        <fieldset className="space-y-3">
          <legend className="sr-only">Hours per Week</legend>
          {HOURS_OPTIONS.map((option) => (
            <div key={option} className="flex items-center">
              <input type="radio" id={`hours-${option}`} name="hoursPerWeek" value={option} checked={formData.hoursPerWeek === option} onChange={() => handleRadioChange(option, 'hoursPerWeek')} className="rounded-full" />
              <label htmlFor={`hours-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.hoursPerWeek && <ErrorMessage message={errors.hoursPerWeek} />}
      </div>
    </div>
  );
}

function AdditionalContextStep({ formData, handleRadioChange, handleInputChange, handleCheckboxChange, errors }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">In What Ways Are You Most Interested in Contributing? <span className="text-red-500">*</span></label>
        <p className="text-xs text-gray-600 mb-3">Select at least one area</p>
        <fieldset className="space-y-2">
          <legend className="sr-only">Contribution interests</legend>
          {CONTRIBUTION_OPTIONS.map((option) => (
            <div key={option} className="flex items-start">
              <input type="checkbox" id={`contribution-${option}`} checked={formData.contributionWays?.includes(option) || false} onChange={() => handleCheckboxChange(option, 'contributionWays')} className="mt-1 rounded" />
              <label htmlFor={`contribution-${option}`} className="ml-3 text-sm text-gray-700 cursor-pointer">{option}</label>
            </div>
          ))}
        </fieldset>
        {errors?.contributionWays && <ErrorMessage message={errors.contributionWays} />}
      </div>

      <FormField label="Do You Have Any Prior Connection to Sudan or Sudanese Communities?" error={errors?.sudanConnection} helperText="Optional: personal or professional ties are always valuable context">
        <textarea name="sudanConnection" value={formData.sudanConnection} onChange={handleInputChange} placeholder="Share any connections you have to Sudan..." rows="4" className={inputClass(errors?.sudanConnection)} />
      </FormField>

      <FormField label="Is There Anything Else You Would Like Us to Know?" error={errors?.additionalInfo} helperText="Optional: final thoughts or additional context">
        <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} placeholder="Any final thoughts..." rows="4" className={inputClass(errors?.additionalInfo)} />
      </FormField>

{/*}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-700"><strong>We truly appreciate your interest in Sudan Action Hub.</strong><br />Our team will review responses on a rolling basis and reach out as opportunities align with your interests and our evolving needs.</p>
      </div>
      */}
    </div>
  );
}

function FormField({ label, required, error, helperText, children }) {
  return (
    <div>
      {label && (<label className="block text-sm font-medium text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>)}
      {children}
      {helperText && <p className="text-xs text-gray-600 mt-1">{helperText}</p>}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="mt-2 flex items-start gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>{message}</span></div>
  );
}

function inputClass(hasError) {
  return `w-full px-4 py-2 border rounded-lg text-sm transition-colors ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} focus:outline-none focus:ring-2`;
}

function SuccessScreen() {
  return (
    <>
      <Helmet>
        <title>Thank You - Sudan Action Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="mb-6"><CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" /></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-bold text-gray-900 mb-4">Thank You!</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-gray-600 mb-8">Your submission has been received. We truly appreciate your interest in Sudan Action Hub. Our team will review your response and reach out as opportunities align with your interests and our evolving needs.</motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button onClick={() => (window.location.href = '/')} className="inline-flex items-center justify-center">Return to Home</Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default LocalAdvocacyIntakeForm;
