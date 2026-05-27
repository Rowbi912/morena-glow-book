export type Service = { name: string; price: number; duration: number };
export type ServiceCategory = { id: string; name: string; icon: string; services: Service[] };

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "lavados",
    name: "Lavados y tratamientos",
    icon: "Droplets",
    services: [
      { name: "Neutro / Alcalino", price: 8500, duration: 45 },
      { name: "Baño de crema Kerastase", price: 14000, duration: 60 },
      { name: "Ritual Morena (con peinado)", price: 22000, duration: 90 },
      { name: "Alisado progresivo", price: 65000, duration: 180 },
      { name: "Botox Capilar", price: 48000, duration: 120 },
      { name: "Morena Keratin Shock", price: 55000, duration: 150 },
    ],
  },
  {
    id: "cortes",
    name: "Cortes",
    icon: "Scissors",
    services: [
      { name: "Damas", price: 12000, duration: 45 },
      { name: "Caballeros", price: 8500, duration: 30 },
      { name: "Niños", price: 7000, duration: 30 },
      { name: "Flequillo", price: 4500, duration: 15 },
    ],
  },
  {
    id: "peinados",
    name: "Peinados",
    icon: "Wind",
    services: [
      { name: "Brushing Premium", price: 11000, duration: 45 },
      { name: "Ondas", price: 13500, duration: 60 },
      { name: "Recogido", price: 18000, duration: 75 },
      { name: "Medio Recogido", price: 15500, duration: 60 },
    ],
  },
  {
    id: "coloracion",
    name: "Coloración",
    icon: "Palette",
    services: [
      { name: "Color", price: 24000, duration: 90 },
      { name: "Reflejos con papel", price: 32000, duration: 120 },
      { name: "Mechas Platinum", price: 45000, duration: 150 },
      { name: "Cambio total de color", price: 52000, duration: 180 },
      { name: "Color Inoa", price: 30000, duration: 90 },
    ],
  },
  {
    id: "manos-pies",
    name: "Manos y pies",
    icon: "Hand",
    services: [
      { name: "Manicuría", price: 7500, duration: 45 },
      { name: "Semipermanente OPI", price: 12000, duration: 60 },
      { name: "Pedicuría", price: 9500, duration: 60 },
      { name: "Belleza de pies", price: 11000, duration: 60 },
    ],
  },
  {
    id: "spa",
    name: "Maquillaje, Masajes y Reflexología",
    icon: "Sparkles",
    services: [
      { name: "Maquillaje social", price: 18000, duration: 60 },
      { name: "Maquillaje novia", price: 38000, duration: 90 },
      { name: "Masaje descontracturante", price: 16000, duration: 60 },
      { name: "Reflexología", price: 14000, duration: 45 },
    ],
  },
];

export type AppointmentStatus = "Confirmado" | "Completado" | "Cancelado";
export type Appointment = {
  id: string;
  service: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  name: string;
  phone: string;
  status: AppointmentStatus;
  price: number;
  productsUsed?: string[];
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service?: string;
  date: string;
};

const APPT_KEY = "morena_appointments";
const REVIEW_KEY = "morena_reviews";
const USER_KEY = "morena_user";
const ADMIN_KEY = "morena_admin_mode";

const SEED_APPTS: Appointment[] = [
  { id: "a1", service: "Ritual Morena (con peinado)", category: "Lavados y tratamientos", date: "2026-04-15", time: "11:00", name: "Cliente", phone: "1153074500", status: "Completado", price: 22000, productsUsed: ["Kérastase Rituel Therapiste", "Kérastase Elixir Ultime — aceite de terminación"] },
  { id: "a2", service: "Color Inoa", category: "Coloración", date: "2026-05-20", time: "14:30", name: "Cliente", phone: "1153074500", status: "Completado", price: 30000, productsUsed: ["L'Oréal INOA 7.5", "L'Oréal INOA 3.0 raíces", "Shampoo post-color Vitamino Color"] },
  { id: "a3", service: "Semipermanente OPI", category: "Manos y pies", date: "2026-03-02", time: "16:00", name: "Cliente", phone: "1153074500", status: "Completado", price: 12000, productsUsed: ["OPI Infinite Shine — Bubble Bath", "OPI Top Coat"] },
];

const ADMIN_SEED_APPTS_TODAY = (): Appointment[] => {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { id: "t1", service: "Brushing Premium", category: "Peinados", date: today, time: "10:00", name: "Valentina G.", phone: "1144556677", status: "Confirmado", price: 11000 },
    { id: "t2", service: "Color Inoa", category: "Coloración", date: today, time: "11:30", name: "Martina Fernández", phone: "1133221100", status: "Confirmado", price: 30000 },
    { id: "t3", service: "Ritual Morena (con peinado)", category: "Lavados y tratamientos", date: today, time: "14:00", name: "Catalina Pérez", phone: "1122334455", status: "Confirmado", price: 22000 },
    { id: "t4", service: "Manicuría", category: "Manos y pies", date: today, time: "16:30", name: "Florencia Aguirre", phone: "1166778899", status: "Confirmado", price: 7500 },
  ];
};

const SEED_REVIEWS: Review[] = [
  { id: "r1", name: "Sofía Martínez", rating: 5, comment: "Hermoso lugar y trato increíble. Salí feliz con mi color.", service: "Color Inoa", date: "2026-04-12" },
  { id: "r2", name: "Lucía Paredes", rating: 5, comment: "El Ritual Morena es una experiencia única. Mi pelo quedó espectacular.", service: "Ritual Morena (con peinado)", date: "2026-03-28" },
  { id: "r3", name: "Camila Romero", rating: 4, comment: "Excelente atención. El brushing me encantó.", service: "Brushing Premium", date: "2026-03-10" },
  { id: "r4", name: "Florencia Aguirre", rating: 5, comment: "Profesionalismo y calidez. Ya soy clienta fija.", service: "Mechas Platinum", date: "2026-02-22" },
  { id: "r5", name: "Valentina González", rating: 5, comment: "Las chicas son divinas y el lugar es precioso. Súper recomendable.", service: "Semipermanente OPI", date: "2026-05-18" },
];

function read<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw) as T; } catch { return seed; }
}
function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}

export const apptStore = {
  list: () => read<Appointment[]>(APPT_KEY, SEED_APPTS),
  add: (a: Appointment) => {
    const all = apptStore.list();
    const next = [a, ...all];
    write(APPT_KEY, next);
    return next;
  },
  cancel: (id: string) => {
    const next = apptStore.list().map((a) => (a.id === id ? { ...a, status: "Cancelado" as const } : a));
    write(APPT_KEY, next);
    return next;
  },
  todayForAdmin: () => ADMIN_SEED_APPTS_TODAY(),
};

export const reviewStore = {
  list: () => read<Review[]>(REVIEW_KEY, SEED_REVIEWS),
  add: (r: Review) => {
    const next = [r, ...reviewStore.list()];
    write(REVIEW_KEY, next);
    return next;
  },
};

export const userStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_KEY);
  },
  set: (name: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, name);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },
};

export const adminStore = {
  isOn: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ADMIN_KEY) === "1";
  },
  set: (on: boolean) => {
    if (typeof window === "undefined") return;
    if (on) localStorage.setItem(ADMIN_KEY, "1");
    else localStorage.removeItem(ADMIN_KEY);
  },
};

// Loyalty: 5 visits = free haircut. Counts Completados.
export const POINTS_GOAL = 5;
export function getPointsInfo() {
  const completed = apptStore.list().filter((a) => a.status === "Completado");
  const total = completed.length;
  const current = total % POINTS_GOAL;
  const rewards = Math.floor(total / POINTS_GOAL);
  return { total, current, goal: POINTS_GOAL, rewards, history: completed };
}

// Mock availability — returns time slots for a given date (Mon–Sat 9–18)
export function getAvailableSlots(date: Date): string[] {
  const day = date.getDay(); // 0 sun
  if (day === 0) return [];
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    for (const m of ["00", "30"]) {
      const key = `${date.getDate()}-${h}-${m}`;
      const hash = [...key].reduce((s, c) => s + c.charCodeAt(0), 0);
      if (hash % 7 === 0) continue;
      slots.push(`${String(h).padStart(2, "0")}:${m}`);
    }
  }
  return slots;
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}
