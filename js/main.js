// Moova Corporate Website - JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Language selector logic
  const langFrBtn = document.getElementById('lang-fr');
  const langEnBtn = document.getElementById('lang-en');

  if (langFrBtn) {
    langFrBtn.addEventListener('click', function() {
      setLanguage('fr');
      applyTranslations('fr');
    });
  }

  if (langEnBtn) {
    langEnBtn.addEventListener('click', function() {
      setLanguage('en');
      window.location.reload();
    });
  }

  // On page load, apply language if not English
  const userLang = getLanguage();
  if (userLang === 'fr') {
    applyTranslations('fr');
  }

  // Mobile navigation toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');

      // Animate hamburger to X
      const spans = navbarToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });

    // Close menu when clicking on a link
    const navLinks = navbarMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbarMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Form submission handler
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Try to send to Firestore (requires Firebase SDK loaded)
      let sent = false;
      let errorMsg = '';
      if (window.firebase && firebase.firestore) {
        try {
          await firebase.firestore().collection('messages').add({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            createdAt: new Date().toISOString()
          });
          sent = true;
        } catch (err) {
          errorMsg = err.message || 'Failed to send message.';
        }
      } else {
        errorMsg = 'Message service unavailable.';
      }

      if (sent) {
        alert('Your message was sent successfully! We will get back to you within 24-48 hours.');
        contactForm.reset();
      } else {
        alert('Failed to send your message. ' + errorMsg);
      }
    });
  }

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .step-item, .stat-item, .value-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    .navbar.scrolled {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// Utility function for language toggle
function setLanguage(lang) {
  localStorage.setItem('moova-language', lang);
}

function getLanguage() {
  return localStorage.getItem('moova-language') || 'en';
}

// Helper function to get nested translation value
function getTranslationValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }
  return value;
}

// Apply translations to the page
function applyTranslations(lang) {
  if (lang !== 'fr' || !window.MOOVA_TRANSLATIONS_FR) return;

  const t = window.MOOVA_TRANSLATIONS_FR;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Apply translations to elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const value = getTranslationValue(t, key);
    if (value && typeof value === 'string') {
      el.textContent = value;
    }
  });

  // Apply translations to elements with data-translate-placeholder attribute
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    const value = getTranslationValue(t, key);
    if (value && typeof value === 'string') {
      el.placeholder = value;
    }
  });

  // Apply translations to elements with data-translate-html attribute (for innerHTML)
  document.querySelectorAll('[data-translate-html]').forEach(el => {
    const key = el.getAttribute('data-translate-html');
    const value = getTranslationValue(t, key);
    if (value && typeof value === 'string') {
      el.innerHTML = value;
    }
  });

  // Page-specific translations
  switch(currentPage) {
    case 'index.html':
    case '':
      applyIndexTranslations(t);
      break;
    case 'about.html':
      applyAboutTranslations(t);
      break;
    case 'how-it-works.html':
      applyHowItWorksTranslations(t);
      break;
    case 'contact.html':
      applyContactTranslations(t);
      break;
    case 'download.html':
      applyDownloadTranslations(t);
      break;
    case 'privacy-policy.html':
      applyPrivacyPolicyTranslations(t);
      break;
    case 'terms-conditions.html':
      applyTermsConditionsTranslations(t);
      break;
  }

  // Apply common footer translations
  applyFooterTranslations(t);
}

// Footer translations (shared across all pages)
function applyFooterTranslations(t) {
  const footerAbout = document.querySelector('.footer-about > p');
  if (footerAbout) footerAbout.textContent = t.footer.about;

  const footerLinks = document.querySelectorAll('.footer-links-column h4');
  if (footerLinks[0]) footerLinks[0].textContent = t.footer.company;
  if (footerLinks[1]) footerLinks[1].textContent = t.footer.legal;
  if (footerLinks[2]) footerLinks[2].textContent = t.footer.support;

  // Company links
  const companyLinks = document.querySelectorAll('.footer-links-column:nth-child(2) .footer-links li a');
  if (companyLinks[0]) companyLinks[0].textContent = t.footer.aboutUs;
  if (companyLinks[1]) companyLinks[1].textContent = t.footer.howItWorks;
  if (companyLinks[2]) companyLinks[2].textContent = t.footer.contact;
  if (companyLinks[3]) companyLinks[3].textContent = t.footer.downloadApp;

  // Legal links
  const legalLinks = document.querySelectorAll('.footer-links-column:nth-child(3) .footer-links li a');
  if (legalLinks[0]) legalLinks[0].textContent = t.footer.privacyPolicy;
  if (legalLinks[1]) legalLinks[1].textContent = t.footer.termsConditions;

  // Support links
  const supportLinks = document.querySelectorAll('.footer-links-column:nth-child(4) .footer-links li a');
  if (supportLinks[0]) supportLinks[0].textContent = t.footer.help;
  if (supportLinks[1]) supportLinks[1].textContent = t.footer.faq;

  // Copyright
  const copyright = document.querySelector('.footer-bottom p');
  if (copyright) copyright.innerHTML = `&copy; 2025 Moova Africa. ${t.footer.copyright} Powered by Jerttech.`;

  // Bottom links
  const bottomLinks = document.querySelectorAll('.footer-bottom-links a');
  if (bottomLinks[0]) bottomLinks[0].textContent = t.footer.privacy;
  if (bottomLinks[1]) bottomLinks[1].textContent = t.footer.terms;
}

// Index page translations
function applyIndexTranslations(t) {
  const idx = t.index;

  // Hero section
  const heroTitle = document.querySelector('.hero-text h1');
  if (heroTitle) heroTitle.textContent = idx.hero.title;

  const heroDesc = document.querySelector('.hero-text p');
  if (heroDesc) heroDesc.textContent = idx.hero.description;

  const heroBtns = document.querySelectorAll('.hero-buttons a');
  if (heroBtns[0]) heroBtns[0].textContent = idx.hero.download;
  if (heroBtns[1]) heroBtns[1].textContent = idx.hero.learnMore;

  // Features section
  const featuresHeader = document.querySelector('.features .section-header h2');
  if (featuresHeader) featuresHeader.textContent = idx.features.whyChoose;

  const featuresSub = document.querySelector('.features .section-header p');
  if (featuresSub) featuresSub.textContent = idx.features.subtitle;

  const featureCards = document.querySelectorAll('.features .feature-card');
  const featureKeys = ['affordable', 'secure', 'community', 'tracking', 'chat', 'coverage'];
  featureCards.forEach((card, i) => {
    if (featureKeys[i] && idx.features[featureKeys[i]]) {
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3) h3.textContent = idx.features[featureKeys[i]].title;
      if (p) p.textContent = idx.features[featureKeys[i]].desc;
    }
  });

  // Stats section
  const statLabels = document.querySelectorAll('.stats .stat-label');
  if (statLabels[0]) statLabels[0].textContent = idx.stats.countries;
  if (statLabels[1]) statLabels[1].textContent = idx.stats.states;
  if (statLabels[2]) statLabels[2].textContent = idx.stats.languages;
  if (statLabels[3]) statLabels[3].textContent = idx.stats.support;

  // How it works section
  const hiwHeader = document.querySelector('.how-it-works .section-header h2');
  if (hiwHeader) hiwHeader.textContent = idx.howItWorks.title;

  const hiwSub = document.querySelector('.how-it-works .section-header p');
  if (hiwSub) hiwSub.textContent = idx.howItWorks.subtitle;

  const hiwCols = document.querySelectorAll('.steps-column');
  if (hiwCols[0]) {
    const h3 = hiwCols[0].querySelector('h3');
    if (h3) h3.textContent = idx.howItWorks.senders;
  }
  if (hiwCols[1]) {
    const h3 = hiwCols[1].querySelector('h3');
    if (h3) h3.textContent = idx.howItWorks.travelers;
  }

  const senderSteps = hiwCols[0] ? hiwCols[0].querySelectorAll('.step-item') : [];
  idx.howItWorks.senderSteps.forEach((step, i) => {
    if (senderSteps[i]) {
      const h4 = senderSteps[i].querySelector('h4');
      const p = senderSteps[i].querySelector('p');
      if (h4) h4.textContent = step.title;
      if (p) p.textContent = step.desc;
    }
  });

  const travelerSteps = hiwCols[1] ? hiwCols[1].querySelectorAll('.step-item') : [];
  idx.howItWorks.travelerSteps.forEach((step, i) => {
    if (travelerSteps[i]) {
      const h4 = travelerSteps[i].querySelector('h4');
      const p = travelerSteps[i].querySelector('p');
      if (h4) h4.textContent = step.title;
      if (p) p.textContent = step.desc;
    }
  });

  const hiwBtn = document.querySelector('.how-it-works .btn-primary');
  if (hiwBtn) hiwBtn.textContent = idx.howItWorks.learnMore;

  // Coverage section
  const covHeader = document.querySelector('.coverage .section-header h2');
  if (covHeader) covHeader.textContent = idx.coverage.title;

  const covSub = document.querySelector('.coverage .section-header p');
  if (covSub) covSub.textContent = idx.coverage.subtitle;

  const covLists = document.querySelectorAll('.coverage-list h3');
  if (covLists[0]) covLists[0].textContent = idx.coverage.us;
  if (covLists[1]) covLists[1].textContent = idx.coverage.africa;

  const usList = document.querySelector('.coverage-list:first-child ul');
  if (usList) {
    const lastItem = usList.querySelector('li:last-child');
    if (lastItem) lastItem.textContent = idx.coverage.moreStates;
  }

  const africaList = document.querySelector('.coverage-list:last-child ul');
  if (africaList) {
    const lastItem = africaList.querySelector('li:last-child');
    if (lastItem) lastItem.textContent = idx.coverage.moreCountries;
  }

  // CTA section
  const ctaHeader = document.querySelector('.cta h2');
  if (ctaHeader) ctaHeader.textContent = idx.cta.title;

  const ctaDesc = document.querySelector('.cta > .container > p');
  if (ctaDesc) ctaDesc.textContent = idx.cta.desc;

  const ctaBtns = document.querySelectorAll('.cta-buttons a');
  if (ctaBtns[0]) ctaBtns[0].textContent = idx.cta.download;
  if (ctaBtns[1]) ctaBtns[1].textContent = idx.cta.contact;
}

// About page translations
function applyAboutTranslations(t) {
  const about = t.about;

  // Hero
  const heroTitle = document.querySelector('.about-hero h1');
  if (heroTitle) heroTitle.textContent = about.hero.title;

  const heroSub = document.querySelector('.about-hero p');
  if (heroSub) heroSub.textContent = about.hero.subtitle;

  // Our Story
  const storyTitle = document.querySelector('section:nth-of-type(2) .section-header h2');
  if (storyTitle) storyTitle.textContent = about.story.title;

  const storyParagraphs = document.querySelectorAll('section:nth-of-type(2) > .container > div > p');
  if (storyParagraphs[0]) storyParagraphs[0].textContent = about.story.p1;
  if (storyParagraphs[1]) storyParagraphs[1].textContent = about.story.p2;
  if (storyParagraphs[2]) storyParagraphs[2].textContent = about.story.p3;

  // Mission & Vision
  const missionVision = document.querySelectorAll('.coverage-grid > div');
  if (missionVision[0]) {
    const h3 = missionVision[0].querySelector('h3');
    const p = missionVision[0].querySelector('p');
    if (h3) h3.textContent = about.mission.title;
    if (p) p.textContent = about.mission.desc;
  }
  if (missionVision[1]) {
    const h3 = missionVision[1].querySelector('h3');
    const p = missionVision[1].querySelector('p');
    if (h3) h3.textContent = about.vision.title;
    if (p) p.textContent = about.vision.desc;
  }

  // Values
  const valuesSection = document.querySelector('.values-grid');
  if (valuesSection) {
    const valuesHeader = valuesSection.closest('section').querySelector('.section-header h2');
    const valuesSub = valuesSection.closest('section').querySelector('.section-header p');
    if (valuesHeader) valuesHeader.textContent = about.values.title;
    if (valuesSub) valuesSub.textContent = about.values.subtitle;

    const valueCards = valuesSection.querySelectorAll('.value-card');
    const valueKeys = ['community', 'trust', 'affordability', 'reliability'];
    valueCards.forEach((card, i) => {
      if (valueKeys[i] && about.values[valueKeys[i]]) {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3) h3.textContent = about.values[valueKeys[i]].title;
        if (p) p.textContent = about.values[valueKeys[i]].desc;
      }
    });
  }

  // Stats/Reach
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const reachHeader = statsSection.closest('section').querySelector('.section-header h2');
    const reachSub = statsSection.closest('section').querySelector('.section-header p');
    if (reachHeader) reachHeader.textContent = about.reach.title;
    if (reachSub) reachSub.textContent = about.reach.subtitle;

    const statLabels = statsSection.querySelectorAll('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = about.reach.countries;
    if (statLabels[1]) statLabels[1].textContent = about.reach.states;
    if (statLabels[2]) statLabels[2].textContent = about.reach.languages;
    if (statLabels[3]) statLabels[3].textContent = about.reach.securePayments;
  }

  // Team section
  const teamSection = document.querySelector('section:has(.section-header h2)');
  const allSections = document.querySelectorAll('section');
  allSections.forEach(section => {
    const h2 = section.querySelector('.section-header h2');
    if (h2 && h2.textContent.includes('Jerttech')) {
      h2.textContent = about.team.title;
      const p = section.querySelector('.section-header p');
      if (p) p.textContent = about.team.desc;
    }
  });

  // CTA
  const ctaHeader = document.querySelector('.cta h2');
  if (ctaHeader) ctaHeader.textContent = about.cta.title;

  const ctaDesc = document.querySelector('.cta > .container > p');
  if (ctaDesc) ctaDesc.textContent = about.cta.desc;

  const ctaBtns = document.querySelectorAll('.cta-buttons a');
  if (ctaBtns[0]) ctaBtns[0].textContent = about.cta.download;
  if (ctaBtns[1]) ctaBtns[1].textContent = about.cta.contact;
}

// How It Works page translations
function applyHowItWorksTranslations(t) {
  const hiw = t.howItWorksPage;

  // Hero
  const heroTitle = document.querySelector('.about-hero h1');
  if (heroTitle) heroTitle.textContent = hiw.hero.title;

  const heroSub = document.querySelector('.about-hero p');
  if (heroSub) heroSub.textContent = hiw.hero.subtitle;

  // Senders section
  const sendersSection = document.querySelector('#senders');
  if (sendersSection) {
    const h2 = sendersSection.querySelector('.section-header h2');
    const p = sendersSection.querySelector('.section-header p');
    if (h2) h2.textContent = hiw.senders.title;
    if (p) p.textContent = hiw.senders.subtitle;

    const steps = sendersSection.querySelectorAll('.step-item');
    hiw.senders.steps.forEach((step, i) => {
      if (steps[i]) {
        const h4 = steps[i].querySelector('h4');
        const pEl = steps[i].querySelector('p');
        if (h4) h4.textContent = step.title;
        if (pEl) pEl.textContent = step.desc;
      }
    });
  }

  // Divider
  const divider = document.querySelector('.bg-light h3');
  if (divider && divider.textContent === 'OR') {
    divider.textContent = hiw.divider;
  }

  // Travelers section
  const travelersSection = document.querySelector('#travelers');
  if (travelersSection) {
    const h2 = travelersSection.querySelector('.section-header h2');
    const p = travelersSection.querySelector('.section-header p');
    if (h2) h2.textContent = hiw.travelers.title;
    if (p) p.textContent = hiw.travelers.subtitle;

    const steps = travelersSection.querySelectorAll('.step-item');
    hiw.travelers.steps.forEach((step, i) => {
      if (steps[i]) {
        const h4 = steps[i].querySelector('h4');
        const pEl = steps[i].querySelector('p');
        if (h4) h4.textContent = step.title;
        if (pEl) pEl.textContent = step.desc;
      }
    });
  }

  // Pricing section
  const pricingSection = document.querySelectorAll('.coverage-grid > div');
  if (pricingSection.length >= 2) {
    const pricingHeader = pricingSection[0].closest('section').querySelector('.section-header h2');
    const pricingSub = pricingSection[0].closest('section').querySelector('.section-header p');
    if (pricingHeader) pricingHeader.textContent = hiw.pricing.title;
    if (pricingSub) pricingSub.textContent = hiw.pricing.subtitle;

    // Sender pricing
    const senderH3 = pricingSection[0].querySelector('h3');
    if (senderH3) senderH3.textContent = hiw.pricing.forSenders;

    // Traveler pricing
    const travelerH3 = pricingSection[1].querySelector('h3');
    if (travelerH3) travelerH3.textContent = hiw.pricing.forTravelers;
  }

  // Safety section
  const safetyFeatures = document.querySelectorAll('.features-grid .feature-card');
  if (safetyFeatures.length >= 3) {
    const safetyHeader = safetyFeatures[0].closest('section').querySelector('.section-header h2');
    const safetySub = safetyFeatures[0].closest('section').querySelector('.section-header p');
    if (safetyHeader) safetyHeader.textContent = hiw.safety.title;
    if (safetySub) safetySub.textContent = hiw.safety.subtitle;

    const safetyKeys = ['escrow', 'verification', 'ratings'];
    safetyFeatures.forEach((card, i) => {
      if (safetyKeys[i] && hiw.safety[safetyKeys[i]]) {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3) h3.textContent = hiw.safety[safetyKeys[i]].title;
        if (p) p.textContent = hiw.safety[safetyKeys[i]].desc;
      }
    });
  }

  // CTA
  const ctaHeader = document.querySelector('.cta h2');
  if (ctaHeader) ctaHeader.textContent = hiw.cta.title;

  const ctaDesc = document.querySelector('.cta > .container > p');
  if (ctaDesc) ctaDesc.textContent = hiw.cta.desc;

  const ctaBtns = document.querySelectorAll('.cta-buttons a');
  if (ctaBtns[0]) ctaBtns[0].textContent = hiw.cta.download;
  if (ctaBtns[1]) ctaBtns[1].textContent = hiw.cta.questions;
}

// Contact page translations
function applyContactTranslations(t) {
  const contact = t.contact;

  // Hero
  const heroTitle = document.querySelector('.about-hero h1');
  if (heroTitle) heroTitle.textContent = contact.hero.title;

  const heroSub = document.querySelector('.about-hero p');
  if (heroSub) heroSub.textContent = contact.hero.subtitle;

  // Get in touch section
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) {
    const h3 = contactInfo.querySelector('h3');
    const p = contactInfo.querySelector('p');
    if (h3) h3.textContent = contact.getInTouch.title;
    if (p) p.textContent = contact.getInTouch.desc;

    const contactItems = contactInfo.querySelectorAll('.contact-item');
    if (contactItems[0]) {
      const h4 = contactItems[0].querySelector('h4');
      const pEl = contactItems[0].querySelector('p');
      if (h4) h4.textContent = contact.getInTouch.responseTime;
      if (pEl) pEl.textContent = contact.getInTouch.responseTimeDesc;
    }
    if (contactItems[1]) {
      const h4 = contactItems[1].querySelector('h4');
      const pEl = contactItems[1].querySelector('p');
      if (h4) h4.textContent = contact.getInTouch.coverage;
      if (pEl) pEl.textContent = contact.getInTouch.coverageDesc;
    }

    const followUs = contactInfo.querySelector('h4:last-of-type');
    if (followUs && followUs.textContent === 'Follow Us') {
      followUs.textContent = contact.getInTouch.followUs;
    }
  }

  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const formTitle = contactForm.querySelector('h3');
    if (formTitle) formTitle.textContent = contact.form.title;

    const labels = contactForm.querySelectorAll('label');
    if (labels[0]) labels[0].textContent = contact.form.fullName;
    if (labels[1]) labels[1].textContent = contact.form.email;
    if (labels[2]) labels[2].textContent = contact.form.subject;
    if (labels[3]) labels[3].textContent = contact.form.message;

    const inputs = contactForm.querySelectorAll('input');
    if (inputs[0]) inputs[0].placeholder = contact.form.fullNamePlaceholder;
    if (inputs[1]) inputs[1].placeholder = contact.form.emailPlaceholder;

    const select = contactForm.querySelector('select');
    if (select) {
      const options = select.querySelectorAll('option');
      if (options[0]) options[0].textContent = contact.form.subjectPlaceholder;
      if (options[1]) options[1].textContent = contact.form.subjectOptions.general;
      if (options[2]) options[2].textContent = contact.form.subjectOptions.support;
      if (options[3]) options[3].textContent = contact.form.subjectOptions.sender;
      if (options[4]) options[4].textContent = contact.form.subjectOptions.traveler;
      if (options[5]) options[5].textContent = contact.form.subjectOptions.partnership;
      if (options[6]) options[6].textContent = contact.form.subjectOptions.feedback;
      if (options[7]) options[7].textContent = contact.form.subjectOptions.other;
    }

    const textarea = contactForm.querySelector('textarea');
    if (textarea) textarea.placeholder = contact.form.messagePlaceholder;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = contact.form.submit;
  }

  // FAQ section
  const faqSection = document.querySelector('.bg-light .section-header');
  if (faqSection) {
    const h2 = faqSection.querySelector('h2');
    const p = faqSection.querySelector('p');
    if (h2) h2.textContent = contact.faq.title;
    if (p) p.textContent = contact.faq.subtitle;

    const faqItems = document.querySelectorAll('.bg-light > .container > div > div');
    const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
    faqItems.forEach((item, i) => {
      if (faqKeys[i] && contact.faq[faqKeys[i]]) {
        const h4 = item.querySelector('h4');
        const pEl = item.querySelector('p');
        if (h4) h4.textContent = contact.faq[faqKeys[i]].question;
        if (pEl) pEl.textContent = contact.faq[faqKeys[i]].answer;
      }
    });
  }

  // CTA
  const ctaHeader = document.querySelector('.cta h2');
  if (ctaHeader) ctaHeader.textContent = contact.cta.title;

  const ctaDesc = document.querySelector('.cta > .container > p');
  if (ctaDesc) ctaDesc.textContent = contact.cta.desc;

  const ctaBtn = document.querySelector('.cta-buttons a');
  if (ctaBtn) ctaBtn.textContent = contact.cta.download;
}

// Download page translations
function applyDownloadTranslations(t) {
  const download = t.download;

  // Hero
  const heroTitle = document.querySelector('.download-hero h1');
  if (heroTitle) heroTitle.textContent = download.hero.title;

  const heroSub = document.querySelector('.download-hero p');
  if (heroSub) heroSub.textContent = download.hero.subtitle;

  // Download buttons
  const downloadBtns = document.querySelectorAll('.download-btn');
  downloadBtns.forEach(btn => {
    const smallText = btn.querySelector('.small');
    const mainText = btn.querySelector('span > :not(.small)');

    if (btn.id === 'apk-download' || btn.hasAttribute('download')) {
      if (smallText) smallText.textContent = download.hero.downloadNow;
    } else {
      if (smallText) smallText.textContent = download.hero.comingSoon;
    }
  });

  // Features section
  const featuresHeader = document.querySelector('section:nth-of-type(2) .section-header h2');
  const featuresSub = document.querySelector('section:nth-of-type(2) .section-header p');
  if (featuresHeader) featuresHeader.textContent = download.features.title;
  if (featuresSub) featuresSub.textContent = download.features.subtitle;

  const featureCards = document.querySelectorAll('section:nth-of-type(2) .feature-card');
  const featureKeys = ['sendPackages', 'earnMoney', 'chatSecurely', 'paySafely', 'trackShipments', 'rateReview'];
  featureCards.forEach((card, i) => {
    if (featureKeys[i] && download.features[featureKeys[i]]) {
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3) h3.textContent = download.features[featureKeys[i]].title;
      if (p) p.textContent = download.features[featureKeys[i]].desc;
    }
  });

  // Requirements section
  const reqHeader = document.querySelector('.bg-light .section-header h2');
  const reqSub = document.querySelector('.bg-light .section-header p');
  if (reqHeader) reqHeader.textContent = download.requirements.title;
  if (reqSub) reqSub.textContent = download.requirements.subtitle;

  // APK Instructions
  const apkSection = document.querySelectorAll('section');
  apkSection.forEach(section => {
    const h2 = section.querySelector('.section-header h2');
    if (h2 && h2.textContent.includes('Installing the APK')) {
      h2.textContent = download.apkInstructions.title;
      const p = section.querySelector('.section-header p');
      if (p) p.textContent = download.apkInstructions.subtitle;

      const steps = section.querySelectorAll('.step-item');
      const stepKeys = ['step1', 'step2', 'step3', 'step4'];
      steps.forEach((step, i) => {
        if (stepKeys[i] && download.apkInstructions[stepKeys[i]]) {
          const h4 = step.querySelector('h4');
          const pEl = step.querySelector('p');
          if (h4) h4.textContent = download.apkInstructions[stepKeys[i]].title;
          if (pEl) pEl.textContent = download.apkInstructions[stepKeys[i]].desc;
        }
      });
    }
  });

  // CTA
  const ctaHeader = document.querySelector('.cta h2');
  if (ctaHeader) ctaHeader.textContent = download.cta.title;

  const ctaDesc = document.querySelector('.cta > .container > p');
  if (ctaDesc) ctaDesc.textContent = download.cta.desc;

  const ctaBtns = document.querySelectorAll('.cta-buttons a');
  if (ctaBtns[0]) ctaBtns[0].textContent = download.cta.contactSupport;
  if (ctaBtns[1]) ctaBtns[1].textContent = download.cta.learnHow;
}

// Privacy Policy page translations
function applyPrivacyPolicyTranslations(t) {
  const pp = t.privacyPolicy;

  // Hero
  const heroTitle = document.querySelector('.about-hero h1');
  if (heroTitle) heroTitle.textContent = pp.hero.title;

  const heroSub = document.querySelector('.about-hero p');
  if (heroSub) heroSub.textContent = pp.hero.lastUpdated;

  // Content
  const legalContent = document.querySelector('.legal-content');
  if (legalContent) {
    const intro = legalContent.querySelector('p:first-child');
    if (intro) intro.textContent = pp.intro;

    const headings = legalContent.querySelectorAll('h2');
    headings.forEach((h2, i) => {
      const sectionKey = `s${i + 1}`;
      if (pp.sections[sectionKey]) {
        h2.textContent = pp.sections[sectionKey].title;
      }
    });

    // Agreement box
    const agreementBox = legalContent.querySelector('div[style*="background: var(--primary)"] p');
    if (agreementBox) agreementBox.innerHTML = `<strong>${pp.agreement}</strong>`;
  }
}

// Terms and Conditions page translations
function applyTermsConditionsTranslations(t) {
  const tc = t.termsConditions;

  // Hero
  const heroTitle = document.querySelector('.about-hero h1');
  if (heroTitle) heroTitle.textContent = tc.hero.title;

  const heroSub = document.querySelector('.about-hero p');
  if (heroSub) heroSub.textContent = tc.hero.lastUpdated;

  // Content
  const legalContent = document.querySelector('.legal-content');
  if (legalContent) {
    const intro = legalContent.querySelector('p:first-child');
    if (intro) intro.textContent = tc.intro;

    const headings = legalContent.querySelectorAll('h2');
    headings.forEach((h2, i) => {
      const sectionKey = `s${i}`;
      if (tc.sections[sectionKey]) {
        h2.textContent = tc.sections[sectionKey].title;
      }
    });

    // Agreement box
    const agreementBox = legalContent.querySelector('div[style*="background: var(--primary)"] p');
    if (agreementBox) agreementBox.innerHTML = `<strong>${tc.agreement}</strong>`;
  }
}
