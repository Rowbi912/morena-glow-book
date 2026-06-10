export type Role = "stylist" | "colorist" | "nail";

export type Staff = {
  id: string;
  name: string;
  role: Role;
  specialty: string;
  photo: string;
  daysOff: number[]; // 0=Sun..6=Sat
  pin: string;
};

const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C9A96E&color=FAF8F5&size=200&font-size=0.4&bold=true`;

export const STAFF: Staff[] = [
  { id: "s1", name: "Lucía Romero", role: "colorist", specialty: "Colorista master · Balayage", photo: avatar("Lucía Romero"), daysOff: [0], pin: "1111" },
  { id: "s2", name: "Valentina Suárez", role: "colorist", specialty: "Colorista · Mechas platinum", photo: avatar("Valentina Suárez"), daysOff: [0, 1], pin: "2222" },
  { id: "s3", name: "Martín Acosta", role: "stylist", specialty: "Estilista · Cortes y peinados", photo: avatar("Martín Acosta"), daysOff: [0], pin: "3333" },
  { id: "s4", name: "Camila Fernández", role: "stylist", specialty: "Estilista · Brushing y tratamientos", photo: avatar("Camila Fernández"), daysOff: [0], pin: "4444" },
  { id: "s5", name: "Sofía Giménez", role: "nail", specialty: "Manicurista · Semipermanente", photo: avatar("Sofía Giménez"), daysOff: [0], pin: "5555" },
  { id: "s6", name: "Brenda Lara", role: "stylist", specialty: "Estilista · Color asistente", photo: avatar("Brenda Lara"), daysOff: [0, new Date().getDay() === 2 ? -1 : 2], pin: "6666" },
];

export type Service = {
  name: string;
  price: number;
  duration: number; // total client time in minutes (display)
  role: Role;
  // For color services: split between active application and passive processing.
  // If not provided, applicationMinutes = duration, processingMinutes = 0.
  applicationMinutes?: number;
  processingMinutes?: number;
};

export type ServiceCategory = { id: string; name: string; icon: string; services: Service[] };

// Prices already multiplied by 2.5 (150% increase over previous mock prices).
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "lavados",
    name: "Lavados y tratamientos",
    icon: "Droplets",
    services: [
      { name: "Lavado Neutro / Alcalino", price: 4500, duration: 15, role: "stylist" },
      { name: "Lavado Loreal / Wella SP", price: 6000, duration: 20, role: "stylist" },
      { name: "Baño de crema Kerastase", price: 18500, duration: 45, role: "stylist" },
      { name: "Ritual Morena (con peinado)", price: 38500, duration: 60, role: "stylist" },
      { name: "Alisado progresivo", price: 162500, duration: 180, role: "stylist" },
      { name: "Botox Capilar", price: 120000, duration: 90, role: "stylist" },
      { name: "Morena Keratin Shock", price: 137500, duration: 90, role: "stylist" },
    ],
  },
  {
    id: "cortes",
    name: "Cortes",
    icon: "Scissors",
    services: [
      { name: "Corte Damas", price: 21000, duration: 45, role: "stylist" },
      { name: "Corte Caballeros", price: 15000, duration: 30, role: "stylist" },
      { name: "Corte Niños", price: 12500, duration: 20, role: "stylist" },
      { name: "Flequillo", price: 8000, duration: 15, role: "stylist" },
    ],
  },
  {
    id: "peinados",
    name: "Peinados",
    icon: "Wind",
    services: [
      { name: "Brushing Premium", price: 19500, duration: 40, role: "stylist" },
      { name: "Ondas", price: 24000, duration: 50, role: "stylist" },
      { name: "Recogido", price: 32000, duration: 60, role: "stylist" },
      { name: "Medio Recogido", price: 27500, duration: 60, role: "stylist" },
    ],
  },
  {
    id: "coloracion",
    name: "Coloración",
    icon: "Palette",
    services: [
      { name: "Color completo", price: 42500, duration: 90, role: "colorist", applicationMinutes: 30, processingMinutes: 60 },
      { name: "Reflejos con papel", price: 57000, duration: 120, role: "colorist", applicationMinutes: 30, processingMinutes: 90 },
      { name: "Mechas Platinum", price: 80000, duration: 150, role: "colorist", applicationMinutes: 30, processingMinutes: 120 },
      { name: "Color Inoa", price: 53000, duration: 90, role: "colorist", applicationMinutes: 30, processingMinutes: 60 },
    ],
  },
  {
    id: "manos-pies",
    name: "Manos y pies",
    icon: "Hand",
    services: [
      { name: "Manicuría", price: 13000, duration: 40, role: "nail" },
      { name: "Semipermanente OPI", price: 21000, duration: 50, role: "nail" },
      { name: "Pedicuría", price: 17000, duration: 50, role: "nail" },
      { name: "Belleza de pies", price: 19500, duration: 50, role: "nail" },
    ],
  },
  {
    id: "spa",
    name: "Maquillaje, Masajes y Reflexología",
    icon: "Sparkles",
    services: [
      { name: "Maquillaje social", price: 32000, duration: 60, role: "stylist" },
      { name: "Maquillaje novia", price: 67500, duration: 90, role: "stylist" },
      { name: "Masaje descontracturante", price: 28500, duration: 60, role: "stylist" },
      { name: "Reflexología", price: 25000, duration: 45, role: "stylist" },
    ],
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  stylist: "Estilista",
  colorist: "Colorista",
  nail: "Manicurista",
};

export type AppointmentStatus = "Confirmado" | "Completado" | "Cancelado";

// One scheduled item inside an appointment
export type ScheduledItem = {
  serviceName: string;
  role: Role;
  startMinutes: number; // offset from appointment start
  durationMinutes: number; // active time professional is engaged
  price: number;
  staffId?: string;
  notes?: string;
  completed?: boolean;
};

export type ArrivalStatus = "pending" | "arrived" | "in_progress" | "done";

export type Appointment = {
  id: string;
  service: string; // joined names for display
  category: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: AppointmentStatus;
  price: number;
  totalDuration?: number;
  items?: ScheduledItem[];
  productsUsed?: string[];
  arrival?: ArrivalStatus;
  arrivedAt?: string;
  walkIn?: boolean;
};

export type Notification = {
  id: string;
  staffId: string;
  apptId: string;
  message: string;
  createdAt: number;
  read?: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service?: string;
  date: string;
};

export type UserAccount = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

const APPT_KEY = "morena_appointments_v3";
const RECEPTION_KEY = "morena_reception_mode";
const NOTIF_KEY = "morena_notifications_v1";
const RECEPTION_PIN = "9999";

const REVIEW_KEY = "morena_reviews";
const USERS_KEY = "morena_users_v2";
const SESSION_KEY = "morena_session_v2";
const ADMIN_KEY = "morena_admin_mode";
const STAFF_SESSION_KEY = "morena_staff_session";
const LEGACY_USER_KEY = "morena_user";

const todayStr = () => new Date().toISOString().slice(0, 10);

const SEED_APPTS: Appointment[] = [
  { id: "a1", service: "Ritual Morena (con peinado)", category: "Lavados y tratamientos", date: "2026-04-15", time: "11:00", name: "Cliente", phone: "1153074500", status: "Completado", price: 38500, productsUsed: ["Kérastase Rituel Therapiste", "Kérastase Elixir Ultime"] },
  { id: "a2", service: "Color Inoa", category: "Coloración", date: "2026-05-20", time: "14:30", name: "Cliente", phone: "1153074500", status: "Completado", price: 53000, productsUsed: ["L'Oréal INOA 7.5", "Shampoo Vitamino Color"] },
  { id: "a3", service: "Semipermanente OPI", category: "Manos y pies", date: "2026-03-02", time: "16:00", name: "Cliente", phone: "1153074500", status: "Completado", price: 21000, productsUsed: ["OPI Bubble Bath", "OPI Top Coat"] },
  // Today's seed bookings (drive admin/staff dashboards + conflict prevention)
  { id: "td1", service: "Brushing Premium", category: "Peinados", date: todayStr(), time: "10:00", name: "Valentina G.", phone: "1144556677", status: "Confirmado", price: 19500, totalDuration: 40,
    items: [{ serviceName: "Brushing Premium", role: "stylist", startMinutes: 0, durationMinutes: 40, price: 19500, staffId: "s3" }] },
  { id: "td2", service: "Color Inoa", category: "Coloración", date: todayStr(), time: "11:30", name: "Martina Fernández", phone: "1133221100", status: "Confirmado", price: 53000, totalDuration: 90,
    items: [{ serviceName: "Color Inoa", role: "colorist", startMinutes: 0, durationMinutes: 30, price: 53000, staffId: "s1", notes: "INOA 7.5 raíz" }] },
  { id: "td3", service: "Ritual Morena (con peinado)", category: "Lavados y tratamientos", date: todayStr(), time: "14:00", name: "Catalina Pérez", phone: "1122334455", status: "Confirmado", price: 38500, totalDuration: 60,
    items: [{ serviceName: "Ritual Morena (con peinado)", role: "stylist", startMinutes: 0, durationMinutes: 60, price: 38500, staffId: "s4" }] },
  { id: "td4", service: "Manicuría", category: "Manos y pies", date: todayStr(), time: "16:30", name: "Florencia A.", phone: "1166778899", status: "Confirmado", price: 13000, totalDuration: 40,
    items: [{ serviceName: "Manicuría", role: "nail", startMinutes: 0, durationMinutes: 40, price: 13000, staffId: "s5" }] },
  { id: "td5", service: "Mechas Platinum", category: "Coloración", date: todayStr(), time: "15:30", name: "Julieta Ramos", phone: "1177889900", status: "Confirmado", price: 80000, totalDuration: 150,
    items: [{ serviceName: "Mechas Platinum", role: "colorist", startMinutes: 0, durationMinutes: 30, price: 80000, staffId: "s2", notes: "Retoque mechas, papel" }] },
];

export const ADMIN_SEED_APPTS_TODAY = (): Appointment[] =>
  apptStore.list().filter((a) => a.date === todayStr() && a.status !== "Cancelado");

const SEED_REVIEWS: Review[] = [
  { id: "r1", name: "Sofía Martínez", rating: 5, comment: "Hermoso lugar y trato increíble. Salí feliz con mi color.", service: "Color Inoa", date: "2026-04-12" },
  { id: "r2", name: "Lucía Paredes", rating: 5, comment: "El Ritual Morena es una experiencia única.", service: "Ritual Morena (con peinado)", date: "2026-03-28" },
  { id: "r3", name: "Camila Romero", rating: 4, comment: "Excelente atención. El brushing me encantó.", service: "Brushing Premium", date: "2026-03-10" },
  { id: "r4", name: "Florencia Aguirre", rating: 5, comment: "Profesionalismo y calidez. Ya soy clienta fija.", service: "Mechas Platinum", date: "2026-02-22" },
  { id: "r5", name: "Valentina González", rating: 5, comment: "Las chicas son divinas y el lugar es precioso.", service: "Semipermanente OPI", date: "2026-05-18" },
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
    const next = [a, ...apptStore.list()];
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

// ------------ Auth (mock localStorage) ------------
export const authStore = {
  listUsers: (): UserAccount[] => read<UserAccount[]>(USERS_KEY, []),
  current: (): UserAccount | null => {
    if (typeof window === "undefined") return null;
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    return authStore.listUsers().find((u) => u.email === email) ?? null;
  },
  signup: (u: UserAccount): { ok: boolean; error?: string } => {
    const users = authStore.listUsers();
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
      return { ok: false, error: "Ya existe una cuenta con ese email." };
    }
    write(USERS_KEY, [...users, u]);
    localStorage.setItem(SESSION_KEY, u.email);
    return { ok: true };
  },
  login: (email: string, password: string): { ok: boolean; error?: string } => {
    const user = authStore.listUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, error: "Cuenta no encontrada." };
    if (user.password !== password) return { ok: false, error: "Contraseña incorrecta." };
    localStorage.setItem(SESSION_KEY, user.email);
    return { ok: true };
  },
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
  },
  update: (patch: Partial<UserAccount>) => {
    const cur = authStore.current();
    if (!cur) return null;
    const updated = { ...cur, ...patch };
    const users = authStore.listUsers().map((u) => (u.email === cur.email ? updated : u));
    write(USERS_KEY, users);
    if (patch.email && patch.email !== cur.email) {
      localStorage.setItem(SESSION_KEY, patch.email);
    }
    return updated;
  },
  // Migrate legacy "morena_user" name into a placeholder account
  migrateLegacy: () => {
    if (typeof window === "undefined") return;
    const legacy = localStorage.getItem(LEGACY_USER_KEY);
    if (!legacy) return;
    if (authStore.current()) {
      localStorage.removeItem(LEGACY_USER_KEY);
      return;
    }
    // Keep the name visible but don't auto-create an account; just remove.
    localStorage.removeItem(LEGACY_USER_KEY);
  },
};

// Legacy export kept so older code paths still compile.
export const userStore = {
  get: (): string | null => authStore.current()?.name ?? null,
  set: (_name: string) => { /* deprecated */ },
  clear: () => authStore.logout(),
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

// Loyalty
export const POINTS_GOAL = 5;
export function getPointsInfo() {
  const completed = apptStore.list().filter((a) => a.status === "Completado");
  const total = completed.length;
  const current = total % POINTS_GOAL;
  const rewards = Math.floor(total / POINTS_GOAL);
  return { total, current, goal: POINTS_GOAL, rewards, history: completed };
}

// ------------ Availability ------------
// Pre-populated occupied slots per weekday (0=Sun..6=Sat).
// Each entry is a "HH:mm" the salon shows as Occupied.
const BUSY_BY_WEEKDAY: Record<number, string[]> = {
  1: ["10:00", "10:30", "11:00", "11:30", "15:30", "16:00"], // Monday busy 10–12 + late
  2: ["09:30", "12:00", "14:30", "17:00"],
  3: ["14:00", "14:30", "15:00", "15:30"], // Wednesday 14–16 partially
  4: ["10:30", "11:30", "16:30"],
  5: ["09:30", "11:00", "13:00", "15:30", "17:30"],
  6: ["09:00", "09:30", "10:00", "11:00", "11:30", "12:00", "13:30", "14:00", "15:00", "16:00", "16:30", "17:00"], // Saturday almost full
};

export type Slot = { time: string; status: "available" | "occupied" };

export function getSlotsForDate(date: Date): Slot[] {
  const day = date.getDay();
  if (day === 0) return [];
  const busy = new Set(BUSY_BY_WEEKDAY[day] ?? []);
  const slots: Slot[] = [];
  for (let h = 9; h < 18; h++) {
    for (const m of ["00", "30"]) {
      const t = `${String(h).padStart(2, "0")}:${m}`;
      slots.push({ time: t, status: busy.has(t) ? "occupied" : "available" });
    }
  }
  return slots;
}

// Back-compat helper (returns only available)
export function getAvailableSlots(date: Date): string[] {
  return getSlotsForDate(date).filter((s) => s.status === "available").map((s) => s.time);
}

// ------------ Smart scheduling ------------
// Given selected services, produce a sequenced list with start offsets in minutes.
// Rules:
//  - Color services (role=colorist) start at t=0, colorist active for applicationMinutes only.
//  - Nail services scheduled during color processing if room; otherwise after.
//  - Stylist services (cuts, brushing, treatments) scheduled AFTER color total time
//    (application + processing) so a haircut after color starts 90+ min later.
//  - With no color: simple sequential by selection order.
export function buildSchedule(selected: Service[]): { items: ScheduledItem[]; totalMinutes: number } {
  const colors = selected.filter((s) => s.role === "colorist");
  const nails = selected.filter((s) => s.role === "nail");
  const stylists = selected.filter((s) => s.role === "stylist");

  const items: ScheduledItem[] = [];

  if (colors.length === 0) {
    // Sequential per-role: stylists first then nails (could be parallel but simulate serial chair time)
    let t = 0;
    for (const s of stylists) {
      items.push({ serviceName: s.name, role: s.role, startMinutes: t, durationMinutes: s.duration, price: s.price });
      t += s.duration;
    }
    let tn = 0;
    for (const s of nails) {
      items.push({ serviceName: s.name, role: s.role, startMinutes: tn, durationMinutes: s.duration, price: s.price });
      tn += s.duration;
    }
    return { items, totalMinutes: Math.max(t, tn) };
  }

  // With color: place color first
  let colorEnd = 0;
  let colorProcessingStart = 0;
  let colorProcessingEnd = 0;
  for (const c of colors) {
    const app = c.applicationMinutes ?? c.duration;
    const proc = c.processingMinutes ?? 0;
    items.push({ serviceName: c.name, role: "colorist", startMinutes: 0, durationMinutes: app, price: c.price });
    colorProcessingStart = app;
    colorProcessingEnd = app + proc;
    colorEnd = colorProcessingEnd;
  }

  // Nails during processing window
  let nailCursor = colorProcessingStart;
  for (const n of nails) {
    items.push({ serviceName: n.name, role: "nail", startMinutes: nailCursor, durationMinutes: n.duration, price: n.price });
    nailCursor += n.duration;
  }

  // Stylist services after processing
  let stylCursor = colorEnd;
  for (const s of stylists) {
    items.push({ serviceName: s.name, role: "stylist", startMinutes: stylCursor, durationMinutes: s.duration, price: s.price });
    stylCursor += s.duration;
  }

  const total = Math.max(colorEnd, nailCursor, stylCursor);
  return { items, totalMinutes: total };
}

export function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

// ------------ Conflict prevention & staff assignment ------------
export const SALON_OPEN_MIN = 9 * 60;
export const SALON_CLOSE_MIN = 18 * 60;

export function hhmmToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export type Busy = { staffId: string; start: number; end: number; apptId: string };

export function getBusyOn(date: string): Busy[] {
  const busy: Busy[] = [];
  for (const a of apptStore.list()) {
    if (a.date !== date || a.status === "Cancelado") continue;
    const baseMin = hhmmToMin(a.time);
    const items = a.items ?? [];
    for (const it of items) {
      if (!it.staffId) continue;
      busy.push({
        staffId: it.staffId,
        start: baseMin + it.startMinutes,
        end: baseMin + it.startMinutes + it.durationMinutes,
        apptId: a.id,
      });
    }
  }
  return busy;
}

function staffWorksOn(s: Staff, date: string): boolean {
  const day = new Date(date + "T00:00:00").getDay();
  return !s.daysOff.includes(day);
}

/**
 * Try to assign a staff member to each scheduled item.
 * Honors preferredStaffId when role matches and availability permits.
 * Returns { ok: true, items } with staffId populated, or { ok: false, conflicts }.
 */
export function assignStaff(
  items: ScheduledItem[],
  date: string,
  startTime: string,
  preferredStaffId?: string,
): { ok: true; items: ScheduledItem[] } | { ok: false; conflicts: string[] } {
  const baseMin = hhmmToMin(startTime);
  const busy = getBusyOn(date);
  const localBusy: Busy[] = [...busy];
  const assigned: ScheduledItem[] = [];
  const conflicts: string[] = [];

  for (const it of items) {
    const start = baseMin + it.startMinutes;
    const end = start + it.durationMinutes;
    if (end > SALON_CLOSE_MIN) {
      conflicts.push(it.serviceName);
      continue;
    }
    const candidates = STAFF.filter((s) => s.role === it.role && staffWorksOn(s, date));
    const ordered = preferredStaffId
      ? [...candidates].sort((a, b) => (a.id === preferredStaffId ? -1 : b.id === preferredStaffId ? 1 : 0))
      : candidates;
    const chosen = ordered.find(
      (s) => !localBusy.some((b) => b.staffId === s.id && !(end <= b.start || start >= b.end)),
    );
    if (!chosen) {
      conflicts.push(it.serviceName);
      continue;
    }
    localBusy.push({ staffId: chosen.id, start, end, apptId: "new" });
    assigned.push({ ...it, staffId: chosen.id });
  }

  if (conflicts.length) return { ok: false, conflicts };
  return { ok: true, items: assigned };
}

export function findAlternativeSlots(
  items: ScheduledItem[],
  date: Date,
  preferredStaffId: string | undefined,
  count = 3,
): string[] {
  const dateStr = date.toISOString().slice(0, 10);
  const all = getSlotsForDate(date);
  const out: string[] = [];
  for (const s of all) {
    if (s.status !== "available") continue;
    const res = assignStaff(items, dateStr, s.time, preferredStaffId);
    if (res.ok) out.push(s.time);
    if (out.length >= count) break;
  }
  return out;
}

export function getSlotsForBooking(
  date: Date,
  items: ScheduledItem[],
  preferredStaffId?: string,
): Slot[] {
  const base = getSlotsForDate(date);
  if (items.length === 0) return base;
  const dateStr = date.toISOString().slice(0, 10);
  return base.map((s) => {
    if (s.status === "occupied") return s;
    const res = assignStaff(items, dateStr, s.time, preferredStaffId);
    return res.ok ? s : { time: s.time, status: "occupied" as const };
  });
}

// ------------ Staff session (employee login) ------------
export const staffSession = {
  current: (): Staff | null => {
    if (typeof window === "undefined") return null;
    const id = localStorage.getItem(STAFF_SESSION_KEY);
    if (!id) return null;
    return STAFF.find((s) => s.id === id) ?? null;
  },
  login: (staffId: string, pin: string): { ok: boolean; error?: string } => {
    const s = STAFF.find((x) => x.id === staffId);
    if (!s) return { ok: false, error: "Profesional no encontrado." };
    if (s.pin !== pin) return { ok: false, error: "PIN incorrecto." };
    localStorage.setItem(STAFF_SESSION_KEY, staffId);
    return { ok: true };
  },
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STAFF_SESSION_KEY);
  },
};

// Mark a single item completed inside an appointment
export function setItemCompleted(apptId: string, itemIndex: number, completed: boolean) {
  const list = apptStore.list().map((a) => {
    if (a.id !== apptId || !a.items) return a;
    const items = a.items.map((it, i) => (i === itemIndex ? { ...it, completed } : it));
    const allDone = items.every((it) => it.completed);
    return { ...a, items, status: allDone ? ("Completado" as const) : a.status };
  });
  write(APPT_KEY, list);
  return list;
}

export function getStaffAgenda(staffId: string, date: string) {
  return apptStore
    .list()
    .filter((a) => a.date === date && a.status !== "Cancelado" && a.items?.some((it) => it.staffId === staffId))
    .flatMap((a) =>
      (a.items ?? [])
        .map((it, idx) => ({ appt: a, item: it, index: idx }))
        .filter((x) => x.item.staffId === staffId),
    )
    .sort((a, b) => hhmmToMin(a.appt.time) + a.item.startMinutes - (hhmmToMin(b.appt.time) + b.item.startMinutes));
}


// ------------ Notifications (in-app push) ------------
export const notifStore = {
  list: (): Notification[] => read<Notification[]>(NOTIF_KEY, []),
  forStaff: (staffId: string): Notification[] =>
    notifStore.list().filter((n) => n.staffId === staffId).sort((a, b) => b.createdAt - a.createdAt),
  unreadForStaff: (staffId: string): Notification[] =>
    notifStore.forStaff(staffId).filter((n) => !n.read),
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) => {
    const all = notifStore.list();
    const item: Notification = { ...n, id: "n" + Date.now() + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), read: false };
    write(NOTIF_KEY, [item, ...all]);
    return item;
  },
  markRead: (id: string) => {
    write(NOTIF_KEY, notifStore.list().map((n) => (n.id === id ? { ...n, read: true } : n)));
  },
  markAllRead: (staffId: string) => {
    write(NOTIF_KEY, notifStore.list().map((n) => (n.staffId === staffId ? { ...n, read: true } : n)));
  },
};

// ------------ Reception session ------------
export const receptionSession = {
  isOn: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(RECEPTION_KEY) === "1";
  },
  login: (pin: string): { ok: boolean; error?: string } => {
    if (pin !== RECEPTION_PIN) return { ok: false, error: "PIN incorrecto. Probá 9999." };
    localStorage.setItem(RECEPTION_KEY, "1");
    return { ok: true };
  },
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(RECEPTION_KEY);
  },
};

// ------------ Arrival / check-in ------------
export function checkInClient(apptId: string): { ok: boolean; error?: string } {
  const list = apptStore.list();
  const appt = list.find((a) => a.id === apptId);
  if (!appt) return { ok: false, error: "Turno no encontrado" };
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const next = list.map((a) =>
    a.id === apptId ? { ...a, arrival: "arrived" as ArrivalStatus, arrivedAt: hhmm } : a,
  );
  write(APPT_KEY, next);
  // Notify each assigned staff member
  const seen = new Set<string>();
  for (const it of appt.items ?? []) {
    if (!it.staffId || seen.has(it.staffId)) continue;
    seen.add(it.staffId);
    notifStore.push({
      staffId: it.staffId,
      apptId: appt.id,
      message: `Tu clienta, ${appt.name}, ya llegó!`,
    });
  }
  return { ok: true };
}

export function setArrivalStatus(apptId: string, status: ArrivalStatus) {
  write(
    APPT_KEY,
    apptStore.list().map((a) => (a.id === apptId ? { ...a, arrival: status } : a)),
  );
}

export function rescheduleAppt(apptId: string, date: string, time: string) {
  write(
    APPT_KEY,
    apptStore.list().map((a) => (a.id === apptId ? { ...a, date, time } : a)),
  );
}

export function logProductsUsed(apptId: string, products: string[]) {
  write(
    APPT_KEY,
    apptStore.list().map((a) => (a.id === apptId ? { ...a, productsUsed: products } : a)),
  );
}

// ------------ Walk-in booking ------------
export type WalkInResult = { ok: true; appt: Appointment } | { ok: false; error: string };

export function createWalkIn(serviceName: string, clientName: string, phone: string): WalkInResult {
  // Find the service definition
  let svc: Service | undefined;
  let category = "";
  for (const c of SERVICE_CATEGORIES) {
    const f = c.services.find((s) => s.name === serviceName);
    if (f) { svc = f; category = c.name; break; }
  }
  if (!svc) return { ok: false, error: "Servicio no encontrado" };

  const { items } = buildSchedule([svc]);
  const date = todayStr();
  const now = new Date();
  // Try current half-hour rounded up, then forward
  const startCandidates: string[] = [];
  let h = now.getHours();
  let m = now.getMinutes() < 30 ? 30 : 0;
  if (m === 0) h += 1;
  for (; h < 18; h++) {
    for (const mm of (h === now.getHours() ? [m] : [0, 30])) {
      startCandidates.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    }
  }
  for (const t of startCandidates) {
    const res = assignStaff(items, date, t);
    if (res.ok) {
      const appt: Appointment = {
        id: "w" + Date.now(),
        service: svc.name,
        category,
        date,
        time: t,
        name: clientName,
        phone,
        status: "Confirmado",
        price: svc.price,
        totalDuration: svc.duration,
        items: res.items,
        arrival: "arrived",
        arrivedAt: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        walkIn: true,
      };
      apptStore.add(appt);
      // Notify staff
      const seen = new Set<string>();
      for (const it of appt.items ?? []) {
        if (!it.staffId || seen.has(it.staffId)) continue;
        seen.add(it.staffId);
        notifStore.push({ staffId: it.staffId, apptId: appt.id, message: `Walk-in: ${clientName} llegó para ${svc.name}.` });
      }
      return { ok: true, appt };
    }
  }
  return { ok: false, error: "No hay profesionales disponibles para hoy" };
}
