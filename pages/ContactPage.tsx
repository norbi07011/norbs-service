import React, { useState, ChangeEvent, FormEvent, DragEvent, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useTheme } from '../hooks/useTheme';
import LogoFrame from '../components/ui/LogoFrame';

// --- STYLED & REUSABLE FORM COMPONENTS ---

const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; required?: boolean }> = ({ label, name, value, onChange, type = "text", placeholder, required }) => {
    const { theme } = useTheme();
    return (
    <div className="relative">
        <input 
            type={type} 
            name={name} 
            id={name} 
            value={value} 
            onChange={onChange} 
            placeholder=" " // Required for the floating label effect
            required={required} 
            className="peer w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground" 
        />
        <label 
            htmlFor={name} 
            className={`absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 left-2 peer-focus:px-2 peer-focus:text-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${theme === 'light' ? 'bg-white' : 'bg-secondary'} peer-placeholder-shown:max-w-[calc(100%-2rem)] peer-placeholder-shown:overflow-hidden peer-placeholder-shown:text-ellipsis peer-placeholder-shown:whitespace-nowrap`}
        >
            {label}
        </label>
    </div>
)};

const FormTextarea: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> = ({ label, name, value, onChange, placeholder, rows = 3 }) => {
    const { theme } = useTheme();
    return (
    <div className="relative">
        <textarea 
            name={name} 
            id={name} 
            value={value} 
            onChange={onChange} 
            placeholder=" " 
            rows={rows} 
            className="peer w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground resize-none" 
        />
        <label 
            htmlFor={name} 
            className={`absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 left-2 peer-focus:px-2 peer-focus:text-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${theme === 'light' ? 'bg-white' : 'bg-secondary'} peer-placeholder-shown:max-w-[calc(100%-2rem)] peer-placeholder-shown:overflow-hidden peer-placeholder-shown:text-ellipsis peer-placeholder-shown:whitespace-nowrap`}
        >
            {label}
        </label>
    </div>
)};

const StyledCheckbox: React.FC<{ label: string; name: string; value: string; checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-3 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-muted border-2 border-transparent has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all duration-300">
        <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-5 h-5 flex-shrink-0 rounded border-2 border-muted-foreground flex items-center justify-center peer-checked:bg-accent peer-checked:border-accent transition-all duration-300">
            <svg className={`w-3 h-3 text-accent-foreground transition-opacity duration-300 ${checked ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <span className="text-foreground min-w-0">{label}</span>
    </label>
);

const StyledRadio: React.FC<{ label: string; name: string; value: string; checked: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, checked, onChange }) => (
     <label className="flex items-center space-x-3 p-3 bg-secondary rounded-lg cursor-pointer hover:bg-muted border-2 border-transparent has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-all duration-300">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-muted-foreground flex items-center justify-center peer-checked:border-accent transition-all duration-300">
            <div className={`w-2.5 h-2.5 rounded-full bg-accent transition-transform duration-300 ${checked ? 'scale-100' : 'scale-0'}`}></div>
        </div>
        <span className="text-foreground min-w-0">{label}</span>
    </label>
);

const ProgressBar: React.FC<{ currentStep: number, totalSteps: number, stepLabels: string[] }> = ({ currentStep, totalSteps, stepLabels }) => (
    <div className="w-full mb-12">
        <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-accent transform -translate-y-1/2 transition-all duration-500 step-progress"></div>
            {stepLabels.map((label, index) => (
                <div key={index} className="z-10 text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-accent-foreground transition-all duration-500 ${currentStep > index ? 'bg-accent' : 'bg-muted'} ${currentStep === index + 1 ? 'ring-4 ring-accent/50' : ''}`}>
                        {currentStep > index ? '✓' : index + 1}
                    </div>
                    <p className={`mt-2 text-xs transition-colors duration-500 ${currentStep >= index + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                </div>
            ))}
        </div>
    </div>
);


// State structure
interface FormData {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: 'graphics' | 'photo' | 'websites' | 'video' | 'clothing' | '';
    details: any;
    budget: string;
    timeline: string;
}

const initialFormData: FormData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    details: {},
    budget: '',
    timeline: '',
};

const ContactPage: React.FC = () => {
    const { t } = useTranslations();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const totalSteps = 5;

    const stepLabels = [
      t('contact_form.step_labels.contact'),
      t('contact_form.step_labels.service'),
      t('contact_form.step_labels.details'),
      t('contact_form.step_labels.budget'),
      t('contact_form.step_labels.summary'),
    ];

    // Update CSS custom property for step progress
    useEffect(() => {
        const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
        document.documentElement.style.setProperty('--progress-width', `${progressPercentage}%`);
    }, [step, totalSteps]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
    
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => {
                const existingValues = prev.details[name] || {};
                return {
                    ...prev,
                    details: {
                        ...prev.details,
                        [name]: { ...existingValues, [value]: checked }
                    }
                };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                details: { ...prev.details, [name]: value }
            }));
        }
    };

    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            setFiles(prev => [...prev, ...Array.from(selectedFiles)]);
        }
    };
    
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const nextStep = () => setStep(prev => (prev < totalSteps ? prev + 1 : prev));
    const prevStep = () => setStep(prev => (prev > 1 ? prev - 1 : prev));

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
          // Prepare email content
          const emailSubject = encodeURIComponent(`Nowe zapytanie ofertowe - ${formData.service || 'ogólne'}`);
          
          let emailBody = `
Dane kontaktowe:
- Imię i nazwisko: ${formData.name}
- Firma: ${formData.company || 'Nie podano'}
- Email: ${formData.email}
- Telefon: ${formData.phone || 'Nie podano'}

Wybrana usługa: ${formData.service || 'Nie wybrano'}

Szczegóły projektu:
${JSON.stringify(formData.details, null, 2)}

Budżet: ${formData.budget || 'Nie określono'}
Termin realizacji: ${formData.timeline || 'Nie określono'}
`;

          if (files.length > 0) {
              emailBody += `\n\nDołączono ${files.length} plików: ${files.map(f => f.name).join(', ')}`;
          }

          const mailtoLink = `mailto:servicenorbs@gmail.com?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
          
          // Open email client
          window.location.href = mailtoLink;
          
          // Show success message
          setSubmitStatus('success');
          
          // Reset form after a delay
          setTimeout(() => {
              setFormData(initialFormData);
              setFiles([]);
          }, 2000);

      } catch (error) {
          console.error('Submission error:', error);
          setSubmitStatus('error');
      } finally {
          setIsSubmitting(false);
      }
    };
    
    const handleTryAgain = () => {
        setSubmitStatus('idle');
        // No need to reset step, user can retry from the summary page.
    }

    const renderStepContent = () => {
        switch (step) {
            case 1: // Contact Info
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-center mb-4 text-foreground">{t('contact_form.step1_title')}</h3>
                        <FormInput label={t('contact.name')} name="name" value={formData.name} onChange={handleInputChange} required />
                        <FormInput label={t('contact.company_name')} name="company" value={formData.company} onChange={handleInputChange} />
                        <FormInput label={t('contact.email')} name="email" value={formData.email} onChange={handleInputChange} type="email" required />
                        <FormInput label={t('contact.phone')} name="phone" value={formData.phone} onChange={handleInputChange} type="tel" />
                    </div>
                );
            case 2: // Service Selection
                const services = [
                    { key: 'graphics', icon: '🎨', label: t('services_teaser.graphics') },
                    { key: 'photo', icon: '📷', label: t('services_teaser.photo') },
                    { key: 'websites', icon: '🌐', label: t('services_teaser.websites') },
                    { key: 'video', icon: '🎬', label: t('services_teaser.video') },
                    { key: 'clothing', icon: '👕', label: t('services_teaser.clothing') },
                ];
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-center mb-6 text-foreground">{t('contact_form.step2_title')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map(s => (
                                <button key={s.key} type="button" onClick={() => { setFormData({ ...formData, service: s.key as any, details: {} }); nextStep(); }}
                                    className="p-6 bg-secondary border-2 rounded-xl text-center transition-all duration-300 transform hover:-translate-y-1 hover:bg-accent/20 hover:border-accent border-border">
                                    <span className="text-4xl block">{s.icon}</span>
                                    <p className="font-semibold mt-2 text-foreground">{s.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Project Details
                const renderDetails = () => {
                  switch (formData.service) {
                    case 'graphics':
                      return (
                          <div className="space-y-6">
                              <h4 className="font-semibold text-lg text-foreground">{t('contact_form.graphics_options.type_label')}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <StyledCheckbox label={t('contact_form.graphics_options.logo')} name="graphic_types" value="logo" checked={!!formData.details.graphic_types?.logo} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.graphics_options.business_cards')} name="graphic_types" value="business_cards" checked={!!formData.details.graphic_types?.business_cards} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.graphics_options.posters_banners')} name="graphic_types" value="posters_banners" checked={!!formData.details.graphic_types?.posters_banners} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.graphics_options.social_media')} name="graphic_types" value="social_media" checked={!!formData.details.graphic_types?.social_media} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.graphics_options.branding')} name="graphic_types" value="branding" checked={!!formData.details.graphic_types?.branding} onChange={handleDetailChange} />
                              </div>
                              <FormTextarea label={t('contact_form.graphics_options.brand_desc_label')} name="brand_desc" value={formData.details.brand_desc || ''} onChange={handleDetailChange} />
                              <FormInput label={t('contact_form.graphics_options.colors_label')} name="colors" value={formData.details.colors || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.graphics_options.inspiration_label')} name="inspiration" value={formData.details.inspiration || ''} onChange={handleDetailChange} />

                              <h4 className="font-semibold text-lg text-foreground pt-6 border-t border-border mt-6">{t('contact_form.additional_questions_title')}</h4>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.graphics_options.guidelines_label')}</p>
                                <StyledRadio label={t('contact_form.graphics_options.guidelines_yes')} name="guidelines" value="yes" checked={formData.details.guidelines === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.graphics_options.guidelines_no')} name="guidelines" value="no" checked={formData.details.guidelines === 'no'} onChange={handleDetailChange} />
                              </div>
                              <FormTextarea label={t('contact_form.graphics_options.style_label')} name="style" value={formData.details.style || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.graphics_options.usage_label')} name="usage" value={formData.details.usage || ''} onChange={handleDetailChange} />
                          </div>
                      );
                    case 'photo':
                       return (
                          <div className="space-y-6">
                              <h4 className="font-semibold text-lg text-foreground">{t('contact_form.photo_options.type_label')}</h4>
                              <div className="space-y-3">
                                  <StyledRadio label={t('contact_form.photo_options.product')} name="photo_type" value="product" checked={formData.details.photo_type === 'product'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.photo_options.portrait')} name="photo_type" value="portrait" checked={formData.details.photo_type === 'portrait'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.photo_options.interior')} name="photo_type" value="interior" checked={formData.details.photo_type === 'interior'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.photo_options.event')} name="photo_type" value="event" checked={formData.details.photo_type === 'event'} onChange={handleDetailChange} />
                              </div>
                              <FormInput label={t('contact_form.photo_options.location_label')} name="location" value={formData.details.location || ''} onChange={handleDetailChange} />
                              <FormInput label={t('contact_form.photo_options.date_label')} name="date" value={formData.details.date || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.photo_options.concept_label')} name="concept" value={formData.details.concept || ''} onChange={handleDetailChange} />
                              
                              <h4 className="font-semibold text-lg text-foreground pt-6 border-t border-border mt-6">{t('contact_form.additional_questions_title')}</h4>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.photo_options.models_label')}</p>
                                <StyledRadio label={t('contact_form.photo_options.models_yes')} name="models" value="yes" checked={formData.details.models === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.photo_options.models_no')} name="models" value="no" checked={formData.details.models === 'no'} onChange={handleDetailChange} />
                              </div>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.photo_options.location_scouting_label')}</p>
                                <StyledRadio label={t('contact_form.photo_options.location_scouting_yes')} name="location_scouting" value="yes" checked={formData.details.location_scouting === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.photo_options.location_scouting_no')} name="location_scouting" value="no" checked={formData.details.location_scouting === 'no'} onChange={handleDetailChange} />
                              </div>
                          </div>
                       );
                    case 'websites':
                       return (
                           <div className="space-y-6">
                              <h4 className="font-semibold text-lg text-foreground">{t('contact_form.websites_options.type_label')}</h4>
                              <div className="space-y-3">
                                  <StyledRadio label={t('contact_form.websites_options.simple')} name="website_type" value="simple" checked={formData.details.website_type === 'simple'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.websites_options.business')} name="website_type" value="business" checked={formData.details.website_type === 'business'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.websites_options.ecommerce')} name="website_type" value="ecommerce" checked={formData.details.website_type === 'ecommerce'} onChange={handleDetailChange} />
                              </div>
                              <FormInput label={t('contact_form.websites_options.pages_label')} name="pages" value={formData.details.pages || ''} onChange={handleDetailChange} type="number"/>
                               <h4 className="font-semibold mt-4 mb-2 text-lg text-foreground">{t('contact_form.websites_options.features_label')}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                   <StyledCheckbox label={t('contact_form.websites_options.contact_form')} name="website_features" value="contact_form" checked={!!formData.details.website_features?.contact_form} onChange={handleDetailChange} />
                                   <StyledCheckbox label={t('contact_form.websites_options.blog')} name="website_features" value="blog" checked={!!formData.details.website_features?.blog} onChange={handleDetailChange} />
                                   <StyledCheckbox label={t('contact_form.websites_options.gallery')} name="website_features" value="gallery" checked={!!formData.details.website_features?.gallery} onChange={handleDetailChange} />
                                   <StyledCheckbox label={t('contact_form.websites_options.payments')} name="website_features" value="payments" checked={!!formData.details.website_features?.payments} onChange={handleDetailChange} />
                                   <StyledCheckbox label={t('contact_form.websites_options.accounts')} name="website_features" value="accounts" checked={!!formData.details.website_features?.accounts} onChange={handleDetailChange} />
                               </div>
                               <FormTextarea label={t('contact_form.websites_options.inspiration_label')} name="inspiration" value={formData.details.inspiration || ''} onChange={handleDetailChange} />
                               
                               <h4 className="font-semibold text-lg text-foreground pt-6 border-t border-border mt-6">{t('contact_form.additional_questions_title')}</h4>
                               <div className="space-y-6">
                                  <div className='space-y-3'><p className='text-sm text-muted-foreground'>{t('contact_form.websites_options.domain_hosting_label')}</p><StyledRadio label={t('contact_form.websites_options.domain_hosting_yes')} name="domain_hosting" value="yes" checked={formData.details.domain_hosting === 'yes'} onChange={handleDetailChange} /><StyledRadio label={t('contact_form.websites_options.domain_hosting_no')} name="domain_hosting" value="no" checked={formData.details.domain_hosting === 'no'} onChange={handleDetailChange} /></div>
                                  <div className='space-y-3'><p className='text-sm text-muted-foreground'>{t('contact_form.websites_options.cms_label')}</p><StyledRadio label={t('contact_form.websites_options.cms_yes')} name="cms" value="yes" checked={formData.details.cms === 'yes'} onChange={handleDetailChange} /><StyledRadio label={t('contact_form.websites_options.cms_no')} name="cms" value="no" checked={formData.details.cms === 'no'} onChange={handleDetailChange} /></div>
                                  <div className='space-y-3'><p className='text-sm text-muted-foreground'>{t('contact_form.websites_options.content_provider_label')}</p><StyledRadio label={t('contact_form.websites_options.content_provider_me')} name="content_provider" value="me" checked={formData.details.content_provider === 'me'} onChange={handleDetailChange} /><StyledRadio label={t('contact_form.websites_options.content_provider_you')} name="content_provider" value="you" checked={formData.details.content_provider === 'you'} onChange={handleDetailChange} /></div>
                                  <div className='space-y-3'><p className='text-sm text-muted-foreground'>{t('contact_form.websites_options.multilingual_label')}</p><StyledRadio label={t('contact_form.websites_options.multilingual_yes')} name="multilingual" value="yes" checked={formData.details.multilingual === 'yes'} onChange={handleDetailChange} /><StyledRadio label={t('contact_form.websites_options.multilingual_no')} name="multilingual" value="no" checked={formData.details.multilingual === 'no'} onChange={handleDetailChange} /></div>
                                  <div className='space-y-3'><p className='text-sm text-muted-foreground'>{t('contact_form.websites_options.seo_support_label')}</p><StyledRadio label={t('contact_form.websites_options.seo_support_yes')} name="seo_support" value="yes" checked={formData.details.seo_support === 'yes'} onChange={handleDetailChange} /><StyledRadio label={t('contact_form.websites_options.seo_support_no')} name="seo_support" value="no" checked={formData.details.seo_support === 'no'} onChange={handleDetailChange} /></div>
                                  <FormTextarea label={t('contact_form.websites_options.integrations_label')} name="integrations" value={formData.details.integrations || ''} onChange={handleDetailChange} />
                               </div>
                           </div>
                       );
                    case 'video':
                        return (
                          <div className="space-y-6">
                              <h4 className="font-semibold text-lg text-foreground">{t('contact_form.video_options.type_label')}</h4>
                              <div className="space-y-3">
                                  <StyledRadio label={t('contact_form.video_options.promo')} name="video_type" value="promo" checked={formData.details.video_type === 'promo'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.video_options.music_video')} name="video_type" value="music_video" checked={formData.details.video_type === 'music_video'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.video_options.social_media_ad')} name="video_type" value="social_media_ad" checked={formData.details.video_type === 'social_media_ad'} onChange={handleDetailChange} />
                                  <StyledRadio label={t('contact_form.video_options.event_coverage')} name="video_type" value="event_coverage" checked={formData.details.event_coverage === 'event_coverage'} onChange={handleDetailChange} />
                              </div>
                              <FormInput label={t('contact_form.video_options.length_label')} name="length" value={formData.details.length || ''} onChange={handleDetailChange} />
                              <FormInput label={t('contact_form.video_options.location_label')} name="location" value={formData.details.location || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.video_options.story_label')} name="story" value={formData.details.story || ''} onChange={handleDetailChange} />
                              
                              <h4 className="font-semibold text-lg text-foreground pt-6 border-t border-border mt-6">{t('contact_form.additional_questions_title')}</h4>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.video_options.actors_label')}</p>
                                <StyledRadio label={t('contact_form.video_options.actors_yes')} name="actors" value="yes" checked={formData.details.actors === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.video_options.actors_no')} name="actors" value="no" checked={formData.details.actors === 'no'} onChange={handleDetailChange} />
                              </div>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.photo_options.location_scouting_label')}</p>
                                <StyledRadio label={t('contact_form.photo_options.location_scouting_yes')} name="location_scouting" value="yes" checked={formData.details.location_scouting === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.photo_options.location_scouting_no')} name="location_scouting" value="no" checked={formData.details.location_scouting === 'no'} onChange={handleDetailChange} />
                              </div>
                          </div>
                        );
                    case 'clothing':
                        return (
                          <div className="space-y-6">
                              <h4 className="font-semibold text-lg text-foreground">{t('contact_form.clothing_options.type_label')}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <StyledCheckbox label={t('contact_form.clothing_options.streetwear')} name="clothing_types" value="streetwear" checked={!!formData.details.clothing_types?.streetwear} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.clothing_options.corporate')} name="clothing_types" value="corporate" checked={!!formData.details.clothing_types?.corporate} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.clothing_options.eco_fashion')} name="clothing_types" value="eco_fashion" checked={!!formData.details.clothing_types?.eco_fashion} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.clothing_options.sports_wear')} name="clothing_types" value="sports_wear" checked={!!formData.details.clothing_types?.sports_wear} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.clothing_options.luxury')} name="clothing_types" value="luxury" checked={!!formData.details.clothing_types?.luxury} onChange={handleDetailChange} />
                                  <StyledCheckbox label={t('contact_form.clothing_options.casual')} name="clothing_types" value="casual" checked={!!formData.details.clothing_types?.casual} onChange={handleDetailChange} />
                              </div>
                              <FormInput label={t('contact_form.clothing_options.quantity_label')} name="quantity" value={formData.details.quantity || ''} onChange={handleDetailChange} type="number" />
                              <FormInput label={t('contact_form.clothing_options.sizes_label')} name="sizes" value={formData.details.sizes || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.clothing_options.materials_label')} name="materials" value={formData.details.materials || ''} onChange={handleDetailChange} />
                              <FormTextarea label={t('contact_form.clothing_options.design_concept_label')} name="design_concept" value={formData.details.design_concept || ''} onChange={handleDetailChange} />

                              <h4 className="font-semibold text-lg text-foreground pt-6 border-t border-border mt-6">{t('contact_form.additional_questions_title')}</h4>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.clothing_options.production_needed_label')}</p>
                                <StyledRadio label={t('contact_form.clothing_options.production_needed_yes')} name="production_needed" value="yes" checked={formData.details.production_needed === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.clothing_options.production_needed_no')} name="production_needed" value="no" checked={formData.details.production_needed === 'no'} onChange={handleDetailChange} />
                              </div>
                              <div className='space-y-3'>
                                <p className='text-sm text-muted-foreground'>{t('contact_form.clothing_options.branding_label')}</p>
                                <StyledRadio label={t('contact_form.clothing_options.branding_yes')} name="branding_needed" value="yes" checked={formData.details.branding_needed === 'yes'} onChange={handleDetailChange} />
                                <StyledRadio label={t('contact_form.clothing_options.branding_no')} name="branding_needed" value="no" checked={formData.details.branding_needed === 'no'} onChange={handleDetailChange} />
                              </div>
                          </div>
                        );
                    default: return <p>Please select a service first.</p>;
                  }
                };
                return (
                     <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-center mb-4 text-foreground">{t('contact_form.step3_title')}</h3>
                        {renderDetails()}
                    </div>
                );
            case 4: // Budget & Timeline
                return (
                    <div className="space-y-6">
                         <h3 className="text-2xl font-bold text-center mb-4 text-foreground">{t('contact_form.step4_title')}</h3>
                         <div>
                            <label className="block text-lg font-medium text-foreground mb-3">{t('contact_form.budget_label')}</label>
                            <div className="space-y-3">
                                <StyledRadio label={t('contact_form.budget_options.b1')} name="budget" value="b1" checked={formData.budget === 'b1'} onChange={handleInputChange} />
                                <StyledRadio label={t('contact_form.budget_options.b2')} name="budget" value="b2" checked={formData.budget === 'b2'} onChange={handleInputChange} />
                                <StyledRadio label={t('contact_form.budget_options.b3')} name="budget" value="b3" checked={formData.budget === 'b3'} onChange={handleInputChange} />
                                <StyledRadio label={t('contact_form.budget_options.b4')} name="budget" value="b4" checked={formData.budget === 'b4'} onChange={handleInputChange} />
                                <StyledRadio label={t('contact_form.budget_options.b5')} name="budget" value="b5" checked={formData.budget === 'b5'} onChange={handleInputChange} />
                            </div>
                         </div>
                         <div>
                            <label className="block text-lg font-medium text-foreground mb-3">{t('contact_form.timeline_label')}</label>
                            <div className="space-y-3">
                               <StyledRadio label={t('contact_form.timeline_options.t1')} name="timeline" value="t1" checked={formData.timeline === 't1'} onChange={handleInputChange} />
                               <StyledRadio label={t('contact_form.timeline_options.t2')} name="timeline" value="t2" checked={formData.timeline === 't2'} onChange={handleInputChange} />
                               <StyledRadio label={t('contact_form.timeline_options.t3')} name="timeline" value="t3" checked={formData.timeline === 't3'} onChange={handleInputChange} />
                               <StyledRadio label={t('contact_form.timeline_options.t4')} name="timeline" value="t4" checked={formData.timeline === 't4'} onChange={handleInputChange} />
                            </div>
                         </div>
                    </div>
                );
            case 5: // Review & Attachments
                 const serviceMap: { [key: string]: string } = {
                    graphics: t('services_teaser.graphics'),
                    photo: t('services_teaser.photo'),
                    websites: t('services_teaser.websites'),
                    video: t('services_teaser.video'),
                    clothing: t('services_teaser.clothing'),
                };
                const renderSummaryDetail = (labelKey: string, value: any) => value ? <p className="text-foreground text-sm"><strong>{t(labelKey)}:</strong> {value}</p> : null;
                const renderSummaryRadio = (labelKey: string, valueKey: string | undefined, yesKey: string, noKey: string) => valueKey ? <p className="text-foreground text-sm"><strong>{t(labelKey)}:</strong> {valueKey === 'yes' ? t(yesKey) : t(noKey)}</p> : null;
                
                return (
                    <div className="space-y-6">
                         <h3 className="text-2xl font-bold text-center mb-4 text-foreground">{t('contact_form.step5_title')}</h3>
                         <div className="p-4 bg-secondary rounded-lg space-y-3 border border-border">
                             <h4 className="font-bold text-lg text-accent">{t('contact_form.summary_title')}</h4>
                             <div className='p-3 bg-muted/50 rounded-md'>
                                <h5 className='font-semibold mb-2 text-foreground'>{t('contact_form.summary_contact_info')}</h5>
                                {renderSummaryDetail('contact.name', formData.name)}
                                {renderSummaryDetail('contact.email', formData.email)}
                                {renderSummaryDetail('contact.company_name', formData.company)}
                                {renderSummaryDetail('contact.phone', formData.phone)}
                             </div>
                             <div className='p-3 bg-muted/50 rounded-md'>
                                <h5 className='font-semibold mb-2 text-foreground'>{t('contact_form.summary_service_details')}</h5>
                                {formData.service && <p className="text-foreground text-sm"><strong>{t('contact.service')}:</strong> {serviceMap[formData.service]}</p>}
                                {/* TODO: Add summary of initial details */}
                             </div>
                              <div className='p-3 bg-muted/50 rounded-md'>
                                <h5 className='font-semibold mb-2 text-foreground'>{t('contact_form.summary_additional_details')}</h5>
                                {/* Websites Additional Details */}
                                {formData.service === 'websites' && <>
                                  {renderSummaryRadio('contact_form.websites_options.domain_hosting_label', formData.details.domain_hosting, 'contact_form.websites_options.domain_hosting_yes', 'contact_form.websites_options.domain_hosting_no')}
                                  {renderSummaryRadio('contact_form.websites_options.cms_label', formData.details.cms, 'contact_form.websites_options.cms_yes', 'contact_form.websites_options.cms_no')}
                                  {formData.details.content_provider && <p className="text-foreground text-sm"><strong>{t('contact_form.websites_options.content_provider_label')}:</strong> {formData.details.content_provider === 'me' ? t('contact_form.websites_options.content_provider_me') : t('contact_form.websites_options.content_provider_you')}</p>}
                                  {renderSummaryRadio('contact_form.websites_options.multilingual_label', formData.details.multilingual, 'contact_form.websites_options.multilingual_yes', 'contact_form.websites_options.multilingual_no')}
                                  {renderSummaryRadio('contact_form.websites_options.seo_support_label', formData.details.seo_support, 'contact_form.websites_options.seo_support_yes', 'contact_form.websites_options.seo_support_no')}
                                  {renderSummaryDetail('contact_form.websites_options.integrations_label', formData.details.integrations)}
                                </>}
                                {/* Graphics Additional Details */}
                                {formData.service === 'graphics' && <>
                                  {renderSummaryRadio('contact_form.graphics_options.guidelines_label', formData.details.guidelines, 'contact_form.graphics_options.guidelines_yes', 'contact_form.graphics_options.guidelines_no')}
                                  {renderSummaryDetail('contact_form.graphics_options.style_label', formData.details.style)}
                                  {renderSummaryDetail('contact_form.graphics_options.usage_label', formData.details.usage)}
                                </>}
                                {/* Photo Additional Details */}
                                {formData.service === 'photo' && <>
                                  {renderSummaryRadio('contact_form.photo_options.models_label', formData.details.models, 'contact_form.photo_options.models_yes', 'contact_form.photo_options.models_no')}
                                  {renderSummaryRadio('contact_form.photo_options.location_scouting_label', formData.details.location_scouting, 'contact_form.photo_options.location_scouting_yes', 'contact_form.photo_options.location_scouting_no')}
                                </>}
                                {/* Video Additional Details */}
                                {formData.service === 'video' && <>
                                  {renderSummaryRadio('contact_form.video_options.actors_label', formData.details.actors, 'contact_form.video_options.actors_yes', 'contact_form.video_options.actors_no')}
                                  {renderSummaryRadio('contact_form.photo_options.location_scouting_label', formData.details.location_scouting, 'contact_form.photo_options.location_scouting_yes', 'contact_form.photo_options.location_scouting_no')}
                                </>}
                                {/* Clothing Additional Details */}
                                {formData.service === 'clothing' && <>
                                  {renderSummaryDetail('contact_form.clothing_options.quantity_label', formData.details.quantity)}
                                  {renderSummaryDetail('contact_form.clothing_options.sizes_label', formData.details.sizes)}
                                  {renderSummaryDetail('contact_form.clothing_options.materials_label', formData.details.materials)}
                                  {renderSummaryDetail('contact_form.clothing_options.design_concept_label', formData.details.design_concept)}
                                  {renderSummaryRadio('contact_form.clothing_options.production_needed_label', formData.details.production_needed, 'contact_form.clothing_options.production_needed_yes', 'contact_form.clothing_options.production_needed_no')}
                                  {renderSummaryRadio('contact_form.clothing_options.branding_label', formData.details.branding_needed, 'contact_form.clothing_options.branding_yes', 'contact_form.clothing_options.branding_no')}
                                </>}
                             </div>
                         </div>
                        
                         <h4 className="font-semibold text-lg mt-4 text-foreground">{t('contact_form.files_label')}</h4>
                        <div 
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md transition-colors ${isDragging ? 'border-accent bg-accent/10' : ''}`}
                        >
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-muted-foreground">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-accent hover:text-opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background focus-within:ring-accent px-1">
                                        <span>{t('contact_form.file_upload_prompt')}</span>
                                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={(e) => handleFileChange(e.target.files)} />
                                    </label>
                                    <p className="pl-1">{t('contact_form.file_drag_drop')}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{t('contact_form.file_types')}</p>
                            </div>
                        </div>
                        {files.length > 0 && (
                            <div className="space-y-2 mt-4">
                                {files.map((file, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                                        <span className="text-muted-foreground truncate">{file.name}</span>
                                        <button type="button" onClick={() => removeFile(index)} className="ml-4 text-red-500 hover:text-red-400">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    }

    const renderFormContent = () => {
      if (submitStatus === 'success') {
        return (
          <div className="text-center flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t('contact_form.submit_success_title')}</h3>
            <p className="text-muted-foreground">{t('contact_form.submit_success_message')}</p>
          </div>
        );
      }

      if (submitStatus === 'error') {
        return (
          <div className="text-center flex flex-col items-center justify-center min-h-[450px]">
             <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{t('contact_form.submit_error_title')}</h3>
            <p className="text-muted-foreground mb-6">{t('contact_form.submit_error_message')}</p>
            <button type="button" onClick={handleTryAgain} className="px-8 py-3 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors transform hover:scale-105 shadow-lg shadow-accent/30">
              {t('contact_form.try_again')}
            </button>
          </div>
        );
      }

      return (
        <form onSubmit={handleSubmit} noValidate>
            <ProgressBar currentStep={step} totalSteps={totalSteps} stepLabels={stepLabels} />
            
            <div className="min-h-[450px]">
               {renderStepContent()}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-color">
                 {step > 1 ? (
                    <button type="button" onClick={prevStep} className="px-6 py-2 font-semibold text-foreground bg-muted rounded-full hover:bg-secondary transition-colors transform hover:scale-105" disabled={isSubmitting}>
                        {t('contact.back')}
                    </button>
                ) : <div />}
                
                {step < totalSteps && step !== 2 && (
                    <button type="button" onClick={nextStep} className="px-8 py-3 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors transform hover:scale-105 shadow-lg shadow-accent/30 ml-auto">
                        {t('contact.next')}
                    </button>
                )}
                
                {step === totalSteps && (
                    <button type="submit" className="px-8 py-3 font-semibold text-brand-dark bg-gold rounded-full hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg shadow-gold/30 ml-auto disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        {isSubmitting ? t('contact_form.submitting') : t('contact.send_request')}
                    </button>
                )}
            </div>
        </form>
      );
    }

    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-foreground text-shadow-accent">
                {t('contact.title')}
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{t('contact.form_title')}</p>

            {/* Logo Display */}
            <div className="flex justify-center mb-16">
                <LogoFrame />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-6 bg-glass backdrop-blur-md border border-border-color rounded-xl">
                        <h3 className="text-2xl font-bold mb-4 text-foreground">{t('contact.title')}</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><strong>Email:</strong> servicenorbs@gmail.com</li>
                            <li><strong>WhatsApp:</strong> +31 6 42474314</li>
                            <li><strong>Tel:</strong> +31 6 42474314</li>
                            <li><strong>Adres:</strong> Braamstraat 19, 2681GL, Monster, Netherlands</li>
                        </ul>
                        
                        {/* Quick Contact Buttons */}
                        <div className="mt-6 flex gap-3">
                            <a 
                                href="https://wa.me/31642474314" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                WhatsApp
                            </a>
                            <a 
                                href="mailto:servicenorbs@gmail.com" 
                                className="flex-1 px-4 py-3 bg-accent hover:bg-opacity-90 text-accent-foreground rounded-lg font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </a>
                        </div>
                    </div>
                     <div className="h-64 rounded-xl overflow-hidden">
                       <iframe 
                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.482811327151!2d4.182404677103758!3d52.03058987193796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b0f807358797%3A0x6758411d73a6e9a!2sBraamstraat%2019%2C%202681%20GL%20Monster%2C%20Netherlands!5e0!3m2!1sen!2spl!4v1716124796349!5m2!1sen!2spl" 
                         width="100%" 
                         height="100%" 
                         className="border-0" 
                         allowFullScreen 
                         loading="lazy" 
                         referrerPolicy="no-referrer-when-downgrade"
                         title="Mapa lokalizacji - Braamstraat 19, Monster, Netherlands"
                       ></iframe>
                    </div>
                </div>

                <div className="lg:col-span-3 p-8 bg-background/50 backdrop-blur-md border border-border-color rounded-xl shadow-2xl shadow-accent/10">
                    {renderFormContent()}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;