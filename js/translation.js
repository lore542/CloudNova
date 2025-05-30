/**
 * Sistema di traduzione per CloudNova
 * Gestisce il caricamento dinamico dei testi in base alla lingua selezionata
 */

// Oggetto che conterrà le traduzioni caricate
let translations = {};
let currentLanguage = 'it'; // Lingua predefinita

// Funzione per caricare il file di traduzione
async function loadTranslations(lang) {
    try {
        const response = await fetch(`js/translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Impossibile caricare le traduzioni per ${lang}`);
        }
        translations = await response.json();
        currentLanguage = lang;
        
        // Aggiorna l'attributo lang dell'HTML
        document.documentElement.lang = lang;
        
        // Aggiorna i testi nella pagina
        updatePageTexts();
        
        // Aggiorna l'indicatore della lingua nella navbar
        updateLanguageIndicator();
        
        // Mostra notifica di cambio lingua
        showLanguageChangeToast();
        
        // Salva la preferenza dell'utente
        localStorage.setItem('cloudnova_language', lang);
        
        return true;
    } catch (error) {
        console.error('Errore nel caricamento delle traduzioni:', error);
        return false;
    }
}

// Funzione per aggiornare i testi nella pagina
function updatePageTexts() {
    // Aggiorna i testi in base agli attributi data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getTranslatedText(key);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', text);
                } else {
                    element.value = text;
                }
            } else {
                element.innerHTML = text;
            }
        }
    });
    
    // Aggiorna i testi nella navbar
    updateNavbarTexts();
    
    // Aggiorna i testi nel footer
    updateFooterTexts();
    
    // Aggiorna i testi nelle sezioni principali
    updateMainSectionTexts();
}

// Funzione per ottenere un testo tradotto in base alla chiave
function getTranslatedText(key) {
    // Gestisce chiavi nidificate come "navbar.azienda"
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            console.warn(`Chiave di traduzione non trovata: ${key}`);
            return null;
        }
    }
    
    return result;
}

// Funzione per aggiornare i testi nella navbar
function updateNavbarTexts() {
    if (!translations.navbar) return;
    
    // Aggiorna i link principali della navbar
    updateElementText('#aziendaDropdown', translations.navbar.azienda);
    updateElementText('#tecnologiaDropdown', translations.navbar.tecnologia);
    updateElementText('#serviziDropdown', translations.navbar.servizi);
    
    // Aggiorna i link del dropdown Azienda
    const aziendaDropdown = document.querySelector('#aziendaDropdown');
    if (aziendaDropdown) {
        const dropdownItems = aziendaDropdown.closest('.nav-item').querySelectorAll('.dropdown-item');
        updateDropdownItems(dropdownItems, [
            translations.navbar.chiSiamo,
            translations.navbar.nostri_valori,
            translations.navbar.perche_sceglierci
        ]);
    }
    
    // Aggiorna i link del dropdown Tecnologia
    const tecnologiaDropdown = document.querySelector('#tecnologiaDropdown');
    if (tecnologiaDropdown) {
        const dropdownItems = tecnologiaDropdown.closest('.nav-item').querySelectorAll('.dropdown-item');
        updateDropdownItems(dropdownItems, [
            translations.navbar.infrastruttura,
            translations.navbar.ia_integrata,
            translations.navbar.sostenibilita
        ]);
    }
    
    // Aggiorna i link del dropdown Servizi
    const serviziDropdown = document.querySelector('#serviziDropdown');
    if (serviziDropdown) {
        const dropdownItems = serviziDropdown.closest('.nav-item').querySelectorAll('.dropdown-item');
        updateDropdownItems(dropdownItems, [
            translations.navbar.panoramica,
            translations.navbar.offerte,
            translations.navbar.consulenza
        ]);
    }
    
    // Aggiorna il link Clienti
    updateElementText('.navbar-nav .nav-link:not(.dropdown-toggle):not(.btn):contains("Clienti")', translations.navbar.clienti);
    
    // Aggiorna il pulsante Contatti
    updateElementText('.navbar-nav .btn.btn-primary', translations.navbar.contatti);
}

// Funzione per aggiornare i testi nel footer
function updateFooterTexts() {
    if (!translations.footer) return;
    
    // Aggiorna i titoli delle sezioni del footer
    const footerTitles = document.querySelectorAll('footer h5, footer .h5');
    if (footerTitles.length >= 4) {
        footerTitles[0].textContent = translations.footer.azienda;
        footerTitles[1].textContent = translations.footer.servizi;
        footerTitles[2].textContent = translations.footer.supporto;
        footerTitles[3].textContent = translations.footer.legale;
    }
    
    // Aggiorna i link del footer
    updateFooterLinks();
    
    // Aggiorna il testo della newsletter
    const newsletterTitle = document.querySelector('footer .newsletter-title');
    if (newsletterTitle) {
        newsletterTitle.textContent = translations.footer.newsletter_title;
    }
    
    const newsletterText = document.querySelector('footer .newsletter-text');
    if (newsletterText) {
        newsletterText.textContent = translations.footer.newsletter_text;
    }
    
    // Aggiorna il pulsante della newsletter
    const newsletterButton = document.querySelector('footer button[type="submit"]');
    if (newsletterButton) {
        newsletterButton.textContent = translations.footer.newsletter_button;
    }
    
    // Aggiorna il titolo dei social
    const socialTitle = document.querySelector('footer .social-title');
    if (socialTitle) {
        socialTitle.textContent = translations.footer.social_title;
    }
    
    // Aggiorna il copyright
    const copyright = document.querySelector('footer .copyright');
    if (copyright) {
        copyright.textContent = translations.footer.copyright;
    }
}

// Funzione per aggiornare i link del footer
function updateFooterLinks() {
    // Aggiorna i link della sezione Azienda
    const aziendaLinks = document.querySelectorAll('footer .footer-links:nth-of-type(1) a');
    if (aziendaLinks.length >= 3) {
        aziendaLinks[0].textContent = translations.navbar.chiSiamo;
        aziendaLinks[1].textContent = translations.navbar.nostri_valori;
        aziendaLinks[2].textContent = translations.navbar.perche_sceglierci;
    }
    
    // Aggiorna i link della sezione Servizi
    const serviziLinks = document.querySelectorAll('footer .footer-links:nth-of-type(2) a');
    if (serviziLinks.length >= 4) {
        serviziLinks[0].textContent = translations.navbar.ia_integrata;
        serviziLinks[1].textContent = translations.navbar.panoramica;
        serviziLinks[2].textContent = translations.navbar.infrastruttura;
        serviziLinks[3].textContent = translations.navbar.consulenza;
    }
    
    // Aggiorna i link della sezione Supporto
    const supportoLinks = document.querySelectorAll('footer .footer-links:nth-of-type(3) a');
    if (supportoLinks.length >= 3) {
        supportoLinks[0].textContent = translations.footer.centro_assistenza;
        supportoLinks[1].textContent = translations.footer.faq;
        supportoLinks[2].textContent = translations.footer.documentazione;
    }
    
    // Aggiorna i link della sezione Legale
    const legaleLinks = document.querySelectorAll('footer .footer-links:nth-of-type(4) a');
    if (legaleLinks.length >= 4) {
        legaleLinks[0].textContent = translations.footer.privacy_policy;
        legaleLinks[1].textContent = translations.footer.termini_servizio;
        legaleLinks[2].textContent = translations.footer.cookie_policy;
        legaleLinks[3].textContent = translations.footer.gdpr;
    }
}

// Funzione per aggiornare i testi nelle sezioni principali
function updateMainSectionTexts() {
    // Hero Section
    if (translations.hero) {
        updateElementText('#hero h1', translations.hero.title);
        updateElementText('#hero p.lead', translations.hero.subtitle);
        updateElementText('#hero a.btn-light', translations.hero.cta_offerte);
        updateElementText('#hero a.btn-outline-light', translations.hero.cta_contatti);
    }
    
    // Chi Siamo Section
    if (translations.chi_siamo) {
        updateElementText('#chi-siamo h2', translations.chi_siamo.title);
        updateElementText('#chi-siamo p.lead', translations.chi_siamo.subtitle);
        updateElementText('#chi-siamo h3:first-of-type', translations.chi_siamo.storia_title);
        
        const storiaParas = document.querySelectorAll('#chi-siamo .storia-text p');
        if (storiaParas.length >= 2) {
            storiaParas[0].textContent = translations.chi_siamo.storia_text;
            storiaParas[1].textContent = translations.chi_siamo.storia_text2;
        }
        
        updateElementText('#chi-siamo h3:last-of-type', translations.chi_siamo.missione_title);
        
        const missioneParas = document.querySelectorAll('#chi-siamo .missione-text p');
        if (missioneParas.length >= 2) {
            missioneParas[0].textContent = translations.chi_siamo.missione_text;
            missioneParas[1].textContent = translations.chi_siamo.missione_text2;
        }
    }
    
    // Valori Section
    if (translations.valori) {
        updateElementText('#valori-aziendali h2', translations.valori.title);
        updateElementText('#valori-aziendali p.lead', translations.valori.subtitle);
        
        const valoriTitles = document.querySelectorAll('#valori-aziendali .card-title');
        if (valoriTitles.length >= 4) {
            valoriTitles[0].textContent = translations.valori.integrita_title;
            valoriTitles[1].textContent = translations.valori.innovazione_title;
            valoriTitles[2].textContent = translations.valori.collaborazione_title;
            valoriTitles[3].textContent = translations.valori.sostenibilita_title;
        }
        
        const valoriTexts = document.querySelectorAll('#valori-aziendali .card-text');
        if (valoriTexts.length >= 4) {
            valoriTexts[0].textContent = translations.valori.integrita_text;
            valoriTexts[1].textContent = translations.valori.innovazione_text;
            valoriTexts[2].textContent = translations.valori.collaborazione_text;
            valoriTexts[3].textContent = translations.valori.sostenibilita_text;
        }
    }
    
    // CTA Section
    if (translations.cta_section) {
        updateElementText('.cta-section h2', translations.cta_section.title);
        updateElementText('.cta-section p', translations.cta_section.text);
        updateElementText('.cta-section .btn', translations.cta_section.button);
    }
    
    // Infrastruttura Section
    if (translations.infrastruttura) {
        updateElementText('#infrastruttura h2', translations.infrastruttura.title);
        updateElementText('#infrastruttura p.lead', translations.infrastruttura.subtitle);
        updateElementText('#infrastruttura h3', translations.infrastruttura.datacenter_title);
        updateElementText('#infrastruttura .datacenter-text', translations.infrastruttura.datacenter_text);
        
        const infraTitles = document.querySelectorAll('#infrastruttura h5');
        if (infraTitles.length >= 4) {
            infraTitles[0].textContent = translations.infrastruttura.sicurezza_title;
            infraTitles[1].textContent = translations.infrastruttura.connettivita_title;
            infraTitles[2].textContent = translations.infrastruttura.alimentazione_title;
            infraTitles[3].textContent = translations.infrastruttura.raffreddamento_title;
        }
        
        const infraTexts = document.querySelectorAll('#infrastruttura .feature-text');
        if (infraTexts.length >= 4) {
            infraTexts[0].textContent = translations.infrastruttura.sicurezza_text;
            infraTexts[1].textContent = translations.infrastruttura.connettivita_text;
            infraTexts[2].textContent = translations.infrastruttura.alimentazione_text;
            infraTexts[3].textContent = translations.infrastruttura.raffreddamento_text;
        }
        
        updateElementText('#infrastruttura .btn', translations.infrastruttura.cta);
    }
}

// Funzione di utilità per aggiornare il testo di un elemento
function updateElementText(selector, text) {
    if (!text) return;
    
    let element;
    if (typeof selector === 'string') {
        element = document.querySelector(selector);
    } else {
        element = selector;
    }
    
    if (element) {
        element.textContent = text;
    }
}

// Funzione di utilità per aggiornare gli elementi di un dropdown
function updateDropdownItems(items, texts) {
    if (!items || !texts || items.length !== texts.length) return;
    
    for (let i = 0; i < items.length; i++) {
        if (texts[i]) {
            items[i].textContent = texts[i];
        }
    }
}

// Funzione per aggiornare l'indicatore della lingua nella navbar
function updateLanguageIndicator() {
    const languageText = document.querySelector('#languageDropdown');
    if (languageText) {
        languageText.innerHTML = `<i class="fas fa-globe"></i> ${currentLanguage.toUpperCase()}`;
    }
}

// Funzione per mostrare il toast di cambio lingua
function showLanguageChangeToast() {
    if (!translations.toast || !translations.toast.language_changed) return;
    
    // Usa la funzione showToast esistente nel main.js
    if (typeof showToast === 'function') {
        showToast(translations.toast.language_changed);
    }
}

// Funzione per inizializzare il sistema di traduzioni
function initTranslationSystem() {
    // Carica la lingua salvata o usa l'italiano come predefinito
    const savedLanguage = localStorage.getItem('cloudnova_language') || 'it';
    
    // Carica le traduzioni per la lingua salvata
    loadTranslations(savedLanguage);
    
    // Aggiungi event listener per i pulsanti di cambio lingua
    const languageButtons = document.querySelectorAll('[data-lang]');
    languageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            loadTranslations(lang);
        });
    });
}

// Inizializza il sistema di traduzioni quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initTranslationSystem);
