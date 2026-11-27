type BrandContact = {
 website: string;
 contact: string;
 email?: string;
};

// These are public brand contacts, not the manufacturer or the responsible person
// for any particular batch. Each contact URL is the verification source.
const brandContacts: ReadonlyMap<string,BrandContact> = new Map([
 ["dries van noten",{website:"https://www.driesvannoten.com/en-de",contact:"https://www.driesvannoten.com/en-us/pages/terms-condition-of-sale",email:"contact@driesvannoten.com"}],
 ["xerjoff",{website:"https://www.xerjoff.com/en-eu",contact:"https://www.xerjoff.com/en-eu/pages/contact",email:"info@xerjoff.com"}],
 ["parfums de marly",{website:"https://parfums-de-marly.com",contact:"https://parfums-de-marly.com/pages/contact-us",email:"customerservice.eu@pmarly.com"}],
 ["ex nihilo",{website:"https://www.ex-nihilo-paris.com",contact:"https://www.ex-nihilo-paris.com/fr/etc/faq",email:"contact@ex-nihilo-paris.com"}],
 ["initio parfums",{website:"https://initioparfums.com/de",contact:"https://initioparfums.com/de/policies/legal-notice",email:"contact@initioparfums.com"}],
 ["amouage",{website:"https://amouage.com/en-eu",contact:"https://amouage.com/en-eu/pages/customer-support-delivery",email:"customerservice@amouage.com"}],
 ["marc-antoine barrois",{website:"https://marcantoinebarrois.com/en",contact:"https://marcantoinebarrois.com/en/pages/contact",email:"parfums@marcantoinebarrois.com"}],
 ["tiziana terenzi",{website:"https://tizianaterenzi.com",contact:"https://tizianaterenzi.com/contatti/"}],
 ["clive christian",{website:"https://eu.clivechristian.com",contact:"https://eu.clivechristian.com/pages/contacts",email:"customercare@clivechristian.com"}],
 ["maison francis kurkdjian",{website:"https://www.franciskurkdjian.com/eu-de",contact:"https://www.franciskurkdjian.com/eu-de/contact-us"}],
]);

export function fragranceBrandContact(brandName:string) {
 return brandContacts.get(brandName.trim().normalize("NFKC").replace(/\s+/g," ").toLowerCase());
}
