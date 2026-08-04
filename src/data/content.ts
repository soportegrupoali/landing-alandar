// Contenido central de la landing de Alandar Paseo Residencial.
// Editar aquí los textos/datos: los componentes solo los renderizan.

export const site = {
  name: 'Alandar Paseo Residencial',
  shortName: 'Alandar',
  tagline: 'La tierra que conecta tus raíces con la vida moderna.',
  description:
    'Alandar Paseo Residencial: privada de 600 lotes residenciales en San Antonio Hool, al norte de Mérida. Casa club, áreas verdes, parques y amenidades para vivir hacia afuera.',
  locale: 'es_MX',
  phoneDisplay: '+52 999 000 0000', // TODO: confirmar número real de ventas con Danny
  phoneWhatsapp: '5219990000000', // TODO: confirmar número real (formato E.164 sin "+")
  email: 'ventas@alandarmerida.com', // TODO: confirmar correo real de ventas
  address: {
    street: 'San Antonio Hool',
    locality: 'Mérida',
    region: 'Yucatán',
    country: 'MX',
  },
} as const;

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

export const stats = [
  { value: '600', label: 'Lotes residenciales' },
  { value: '7', label: 'Etapas' },
  { value: '250 m²', label: 'Desde' },
] as const;

export type MasterPlanPin = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  x: number; // % desde la izquierda
  y: number; // % desde arriba
};

export const masterPlanPins: MasterPlanPin[] = [
  { id: 'casa', title: 'Casa Club', desc: 'Área de convivencia y deportivo para fortalecer la vida en comunidad.', icon: 'casa', x: 11, y: 18 },
  { id: 'zona', title: 'Zona Comercial', desc: 'Espacio destinado a tiendas y servicios para mayor comodidad.', icon: 'zona', x: 7, y: 31 },
  { id: 'botanico', title: 'Jardín botánico/sensorial', desc: 'Espacios verdes con vegetación variada para relajación.', icon: 'botanico', x: 28, y: 20 },
  { id: 'holistico', title: 'Jardín holístico', desc: 'Lugar diseñado para actividades de bienestar y meditación.', icon: 'holistico', x: 47, y: 20 },
  { id: 'canchas', title: 'Cancha de pádel y básquetbol', desc: 'Instalaciones deportivas para actividades recreativas.', icon: 'canchas', x: 68, y: 19 },
  { id: 'gym1', title: 'Gimnasio al aire libre', desc: 'Área con equipo para ejercicio en exterior.', icon: 'gym', x: 90, y: 22 },
  { id: 'active', title: 'Active Park', desc: 'Equipamiento de gimnasio exterior, áreas verdes y mobiliario urbano.', icon: 'gym', x: 13, y: 69 },
  { id: 'multi', title: 'Multifuncional/Yoga', desc: 'Espacios abiertos para actividades deportivas y relajación.', icon: 'multi', x: 25, y: 69 },
  { id: 'infantil', title: 'Juegos infantiles', desc: 'Áreas diseñadas para la diversión de los niños.', icon: 'infantil', x: 38, y: 70 },
  { id: 'pet', title: 'Pet Park', desc: 'Espacio recreativo para mascotas.', icon: 'pet', x: 50, y: 72 },
  { id: 'picnic', title: 'Picnic/reunión/terrazas', desc: 'Zonas de convivencia al aire libre.', icon: 'picnic', x: 59, y: 82 },
];

export const locationStats = [
  { value: '8 min', label: 'al periférico' },
  { value: '20 min', label: 'a la costa' },
  { value: 'A pasos', label: 'de servicios' },
] as const;

export const amenities = [
  { title: 'Alberca recreativa', desc: 'Pausas reales entre el sol, el agua y la naturaleza.', img: 'amenidad-1' },
  { title: 'Carril de nado', desc: 'Bienestar activo dentro de tu propia comunidad.', img: 'amenidad-2' },
  { title: 'Canchas', desc: 'Espacios deportivos para compartir y mantenerte activo.', img: 'amenidad-3' },
  { title: 'Casa Club', desc: 'El corazón social de Alandar.', img: 'amenidad-4' },
  { title: 'Cowork', desc: 'Un entorno cómodo para trabajar y crear.', img: 'amenidad-5' },
  { title: 'Ludoteca', desc: 'Espacio seguro para aprender y jugar.', img: 'amenidad-6' },
  { title: 'Gimnasio', desc: 'Rutina constante sin salir de casa.', img: 'amenidad-7' },
] as const;

export const financing = [
  { label: 'Apartado', value: '$10 Mil', note: '' },
  { label: 'Hasta', value: '36 MSI', note: '' },
  { label: 'Descuento', value: '14%', note: '*Últimas 3 unidades seleccionadas' },
] as const;

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
