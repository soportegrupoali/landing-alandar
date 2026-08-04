// Contenido central de la landing de Alandar Paseo Residencial.
// El copy y los datos "editables" viven en src/content/site.yaml (gestionado
// desde /admin vía Decap CMS). Aquí solo se tipa y se re-exporta para que los
// componentes .astro tengan autocompletado y no dependan de la forma del YAML.

import { parse } from 'yaml';
import rawYaml from '../content/site.yaml?raw';

const raw = parse(rawYaml);

export const site = {
  name: 'Alandar Paseo Residencial',
  shortName: 'Alandar',
  tagline: raw.hero.title as string,
  description: raw.seo.description as string,
  locale: 'es_MX',
  phoneDisplay: raw.contact.phoneDisplay as string,
  phoneWhatsapp: raw.contact.phoneWhatsapp as string,
  email: raw.contact.email as string,
  address: {
    street: 'San Antonio Hool',
    locality: 'Mérida',
    region: 'Yucatán',
    country: 'MX',
  },
} as const;

export const hero = raw.hero as { title: string; subtitle: string };

export const nav = [
  { href: '#proyecto', label: 'Proyecto' },
  { href: '#master-plan', label: 'Master Plan' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#amenidades', label: 'Amenidades' },
  { href: '#avance', label: 'Avance de obra' },
  { href: '#financiamiento', label: 'Financiamiento' },
  { href: '#cotizador', label: 'Cotizador' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
] as const;

type Copy = { eyebrow: string; title: string; body: string };
type Stat = { value: string; label: string };

export const project = raw.project as Copy & { stats: Stat[] };
export const stats = project.stats;

export type MasterPlanPin = { id: string; title: string; desc: string; icon: string; x: number; y: number };

const pinPositions: Record<string, { icon: string; x: number; y: number }> = {
  casa: { icon: 'casa', x: 11, y: 18 },
  zona: { icon: 'zona', x: 7, y: 31 },
  botanico: { icon: 'botanico', x: 28, y: 20 },
  holistico: { icon: 'holistico', x: 47, y: 20 },
  canchas: { icon: 'canchas', x: 68, y: 19 },
  gym1: { icon: 'gym', x: 90, y: 22 },
  active: { icon: 'gym', x: 13, y: 69 },
  multi: { icon: 'multi', x: 25, y: 69 },
  infantil: { icon: 'infantil', x: 38, y: 70 },
  pet: { icon: 'pet', x: 50, y: 72 },
  picnic: { icon: 'picnic', x: 59, y: 82 },
};

export const masterPlan = raw.masterPlan as Copy;
export const masterPlanPins: MasterPlanPin[] = (raw.masterPlan.pins as { id: string; title: string; desc: string }[])
  .filter((pin) => pinPositions[pin.id])
  .map((pin) => ({ ...pin, ...pinPositions[pin.id] }));

export const location = raw.location as Copy;
export const locationStats = raw.location.stats as Stat[];

export const amenitiesSection = raw.amenities as Copy;
export const amenities = raw.amenities.items as { title: string; desc: string; img: string }[];

export const cta = raw.cta as { title: string; body: string };

type VideoConfig = { provider: 'local' | 'vimeo'; vimeoId: string; localSrc: string };
export const progress = raw.progress as Copy & { video: VideoConfig };

export const financingSection = raw.financing as Copy;
export const financing = raw.financing.items as { label: string; value: string; note: string }[];

export const quote = raw.quote as Copy;
export const gallerySection = raw.gallery as Copy;
export const contactSection = raw.contactSection as Copy;
export const footerContent = raw.footer as { description: string; legal: string };

export const gallery = [
  'galeria-1', 'galeria-2', 'galeria-3', 'galeria-4', 'galeria-5', 'galeria-6', 'galeria-7', 'galeria-8',
] as const;

export const budgetOptions = [
  'Menos de $900,000',
  'De $900,000 a $1,500,000',
  'De $1,500,000 a $2,000,000',
  'Más de $2,000,000',
] as const;

export const timelineOptions = ['Inmediatamente', 'De 1 a 3 meses', 'Más de 3 meses'] as const;

export const paymentOptions = [
  'Recurso propio',
  'Crédito hipotecario',
  'Combinado: recurso propio y crédito',
] as const;
