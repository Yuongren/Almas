// Content drawn from the "Almas Skika Professional Proposal" (September 2026).
// Edit copy here once and every page updates.
import { Phone, Languages, Mic, Headphones, Radio, Megaphone, FileText, Music4, Church } from "lucide-react";

export const tagline = "Your Voice. Your Brand.";
export const subTagline = "We turn phone interactions into branded audio experiences.";

// Honest "at a glance" facts — all taken from the proposal.
export const glanceStats = [
  { k: "4", v: "Core capabilities" },
  { k: "3", v: "Launch languages" },
  { k: "KSh 2,500", v: "Caller tunes from" },
  { k: "Nairobi", v: "Studio base" },
];

// The four capabilities the proposal says the company combines.
export const capabilities = [
  { icon: FileText, title: "Creative scripting", desc: "Words written for how your customers actually listen and speak." },
  { icon: Mic, title: "Professional voice-over", desc: "The right voice and direction for your brand and audience." },
  { icon: Music4, title: "Audio production", desc: "Editing, sound design, mixing and quality control." },
  { icon: Radio, title: "Telecom-ready delivery", desc: "Formatted for caller-tune and phone-system use, with activation through licensed technical partners where required." },
];

// The product ladder + indicative launch prices.
export const products = [
  { icon: Phone, title: "Caller Tunes", desc: "Basic, Premium and Multilingual tunes — the low-friction way to start.", from: "From KSh 2,500" },
  { icon: Languages, title: "Multilingual Audio", desc: "English, Kiswahili and Sheng first — more languages only with qualified native speakers.", from: "From KSh 7,500" },
  { icon: Mic, title: "Business Voice Package", desc: "Greetings, service messages, on-hold marketing and after-hours or holiday greetings.", from: "KSh 10,000–25,000" },
  { icon: Headphones, title: "IVR / PABX Voice", desc: "Structured call-handling prompts for offices, institutions and call centres.", from: "KSh 15,000–40,000+" },
  { icon: Radio, title: "Corporate Voice Identity", desc: "One consistent voice across every touchpoint — our premium, ongoing relationship.", from: "From KSh 30,000" },
  { icon: Megaphone, title: "Campaign Audio", desc: "Candidate caller tunes and multilingual campaign audio, using client-approved messages.", from: "KSh 10,000–50,000+" },
];

// Fuller list for the Features page.
export const features = [
  { icon: Phone, title: "Caller Tunes", desc: "Branded ring-back audio that replaces silence or a generic tone.", tag: "Best for SMEs" },
  { icon: Mic, title: "Business Greetings", desc: "Welcome, service-explanation and after-hours or holiday greetings.", tag: "Best for front desks" },
  { icon: Headphones, title: "IVR / PABX Prompts", desc: "Clear, structured voice prompts for menus and call routing.", tag: "Best for institutions" },
  { icon: Music4, title: "On-hold Marketing", desc: "Turn waiting time into useful, memorable communication.", tag: "Best for busy lines" },
  { icon: Megaphone, title: "Campaign Audio", desc: "Consistent, client-approved messaging for campaign teams.", tag: "Best for campaigns" },
  { icon: Church, title: "Church & Ministry Voice", desc: "Welcome, prayer and event communication for congregations.", tag: "Best for churches" },
  { icon: Languages, title: "Multilingual Audio", desc: "English, Kiswahili and Sheng — culturally relevant, not just translated.", tag: "Best for local reach" },
  { icon: Radio, title: "Corporate Voice Identity", desc: "A consistent brand voice across calls, prompts and messages.", tag: "Best for growing brands" },
];

// Launch segments named in the proposal.
export const audiences = [
  "SMEs",
  "Churches & ministries",
  "Schools",
  "Clinics",
  "SACCOs",
  "Hospitality",
  "Real estate",
  "Professional services",
  "Campaign teams",
];

// What sets the company apart (proposal: competitive gap + legal/copyright + language sections).
export const principles = [
  { title: "Localized by design", desc: "English, Kiswahili and Sheng from day one. Indigenous languages are added only where we have qualified native speakers and a reliable review process." },
  { title: "Rights-cleared audio", desc: "Original or properly licensed music, written voice-artist agreements, client content approvals and clear usage terms." },
  { title: "Telecom-ready, partner-powered", desc: "We own the message, voice and sound. Where telecom-side activation is needed, we work through licensed technical partners." },
];

export const contactInfo = {
  phone: "+254 707 002 424",
  phoneHref: "tel:+254707002424",
  email: "hello@almasskika.co.ke",
  location: "Nairobi, Kenya",
};