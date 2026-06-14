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
  { id: "s2", name: "Valentina Castro", role: "colorist", specialty: "Colorista · Color tendencia", photo: avatar("Valentina Castro"), daysOff: [0], pin: "2222" },
  { id: "s3", name: "Romina Suárez", role: "colorist", specialty: "Colorista · Mechas platinum", photo: avatar("Romina Suárez"), daysOff: [0], pin: "3333" },
  { id: "s4", name: "Martín Acosta", role: "stylist", specialty: "Estilista · Cortes y peinados", photo: avatar("Martín Acosta"), daysOff: [0], pin: "4444" },
  { id: "s5", name: "Diego Núñez", role: "stylist", specialty: "Estilista · Cortes caballero", photo: avatar("Diego Núñez"), daysOff: [0], pin: "5555" },
  { id: "s6", name: "Camila Fernández", role: "stylist", specialty: "Estilista · Brushing y tratamientos", photo: avatar("Camila Fernández"), daysOff: [0], pin: "6666" },
  { id: "s7", name: "Sofía Giménez", role: "nail", specialty: "Manicurista · Semipermanente", photo: avatar("Sofía Giménez"), daysOff: [0], pin: "7777" },
  { id: "s8", name: "Paola Méndez", role: "nail", specialty: "Manicurista · Nail art", photo: avatar("Paola Méndez"), daysOff: [0], pin: "8888" },
  { id: "s9", name: "Julieta Aguirre", role: "nail", specialty: "Manicurista · Pedicuría spa", photo: avatar("Julieta Aguirre"), daysOff: [0], pin: "1212" },
  { id: "s10", name: "Andrea Vega", role: "stylist", specialty: "Maquillaje y tratamientos", photo: avatar("Andrea Vega"), daysOff: [0], pin: "1010" },
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

const APPT_KEY = "morena_appointments_v6";
const RECEPTION_KEY = "morena_reception_mode";
const NOTIF_KEY = "morena_notifications_v3";
const RECEPTION_PIN = "9999";

const REVIEW_KEY = "morena_reviews_v2";
const USERS_KEY = "morena_users_v2";
const SESSION_KEY = "morena_session_v2";
const ADMIN_KEY = "morena_admin_mode";
const STAFF_SESSION_KEY = "morena_staff_session_v2";
const LEGACY_USER_KEY = "morena_user";

const todayStr = () => new Date().toISOString().slice(0, 10);

// ============================================================
// SIMULATED TIME — the entire app behaves as if it is 14:00.
// All "now" comparisons (queue, in-progress, no-shows, walk-ins,
// check-ins, notifications) must use these helpers instead of
// new Date().getHours() / Date.now().
// ============================================================
export const SIMULATED_NOW_MIN = 14 * 60; // 14:00
export const SIMULATED_NOW_HHMM = "14:00";
export function getNowMin(): number { return SIMULATED_NOW_MIN; }
export function getNowHHMM(): string { return SIMULATED_NOW_HHMM; }
// Stable epoch anchor so seeded notification timestamps are deterministic.
const SIM_EPOCH = (() => {
  const d = new Date();
  d.setHours(14, 0, 0, 0);
  return d.getTime();
})();

const _hhmm = (m: number) =>
  `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String(((m % 60) + 60) % 60).padStart(2, "0")}`;

// ----------- Seed builder: a busy Tuesday at 14:00 -----------
type SeedRow = {
  id: string;
  time: string;
  name: string;
  phone: string;
  items: { svc: string; role: Role; off: number; dur: number; price: number; staffId: string; notes?: string; completed?: boolean }[];
  status?: AppointmentStatus;
  arrival?: ArrivalStatus;
  arrivedAt?: string;
  walkIn?: boolean;
  productsUsed?: string[];
  category?: string;
};

function rowToAppt(r: SeedRow): Appointment {
  const price = r.items.reduce((s, it) => s + it.price, 0);
  const totalDuration = r.items.reduce((m, it) => Math.max(m, it.off + it.dur), 0);
  return {
    id: r.id,
    service: r.items.map((it) => it.svc).join(" + "),
    category: r.category ?? "",
    date: todayStr(),
    time: r.time,
    name: r.name,
    phone: r.phone,
    status: r.status ?? "Confirmado",
    price,
    totalDuration,
    items: r.items.map((it) => ({
      serviceName: it.svc, role: it.role, startMinutes: it.off, durationMinutes: it.dur,
      price: it.price, staffId: it.staffId, notes: it.notes, completed: it.completed,
    })),
    arrival: r.arrival,
    arrivedAt: r.arrivedAt,
    walkIn: r.walkIn,
    productsUsed: r.productsUsed,
  };
}

function buildTodaySeed(): Appointment[] {
  const rows: SeedRow[] = [];

  // ===== 22 COMPLETED (before 14:00) =====
  const completed: SeedRow[] = [
    { id: "c01", time: "09:00", name: "Mercedes Vidal", phone: "1144000001", arrival: "done", status: "Completado",
      items: [{ svc: "Color completo", role: "colorist", off: 0, dur: 90, price: 42500, staffId: "s1", completed: true }] },
    { id: "c02", time: "09:00", name: "Rocío Méndez", phone: "1144000002", arrival: "done", status: "Completado",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s4", completed: true }] },
    { id: "c03", time: "09:00", name: "Bianca Romero", phone: "1144000003", arrival: "done", status: "Completado",
      items: [{ svc: "Semipermanente OPI", role: "nail", off: 0, dur: 50, price: 21000, staffId: "s7", completed: true }] },
    { id: "c04", time: "09:15", name: "Tomás Acosta", phone: "1144000004", arrival: "done", status: "Completado",
      items: [{ svc: "Corte Caballeros", role: "stylist", off: 0, dur: 30, price: 15000, staffId: "s5", completed: true }] },
    { id: "c05", time: "09:30", name: "Pilar Domínguez", phone: "1144000005", arrival: "done", status: "Completado",
      items: [{ svc: "Manicuría", role: "nail", off: 0, dur: 40, price: 13000, staffId: "s8", completed: true }] },
    { id: "c06", time: "09:30", name: "Marina Cabrera", phone: "1144000006", arrival: "done", status: "Completado",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s6", completed: true }] },
    { id: "c07", time: "09:45", name: "Carla Espósito", phone: "1144000007", arrival: "done", status: "Completado",
      items: [{ svc: "Pedicuría", role: "nail", off: 0, dur: 50, price: 17000, staffId: "s9", completed: true }] },
    { id: "c08", time: "10:00", name: "Ana Lucía Bravo", phone: "1144000008", arrival: "done", status: "Completado",
      items: [{ svc: "Reflejos con papel", role: "colorist", off: 0, dur: 120, price: 57000, staffId: "s2", completed: true }] },
    { id: "c09", time: "10:30", name: "Belén Maidana", phone: "1144000009", arrival: "done", status: "Completado",
      items: [{ svc: "Manicuría", role: "nail", off: 0, dur: 40, price: 13000, staffId: "s7", completed: true }] },
    { id: "c10", time: "10:30", name: "Carolina Ortiz", phone: "1144000010", arrival: "done", status: "Completado",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s4", completed: true }] },
    { id: "c11", time: "10:30", name: "Sabrina López", phone: "1144000011", arrival: "done", status: "Completado",
      items: [{ svc: "Maquillaje social", role: "stylist", off: 0, dur: 60, price: 32000, staffId: "s10", completed: true }],
      productsUsed: ["MAC Studio Fix", "Charlotte Tilbury Pillow Talk"] },
    { id: "c12", time: "11:00", name: "Magalí Pereyra", phone: "1144000012", arrival: "done", status: "Completado",
      items: [{ svc: "Botox Capilar", role: "stylist", off: 0, dur: 90, price: 120000, staffId: "s6", completed: true }],
      productsUsed: ["L'Oréal Absolut Repair"] },
    { id: "c13", time: "11:00", name: "Lourdes Vázquez", phone: "1144000013", arrival: "done", status: "Completado",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s4", completed: true }] },
    { id: "c14", time: "11:15", name: "Inés Salaberry", phone: "1144000014", arrival: "done", status: "Completado",
      items: [{ svc: "Semipermanente OPI", role: "nail", off: 0, dur: 50, price: 21000, staffId: "s8", completed: true }] },
    { id: "c15", time: "11:30", name: "Florencia Aguirre", phone: "1144000015", arrival: "done", status: "Completado",
      items: [{ svc: "Color Inoa", role: "colorist", off: 0, dur: 90, price: 53000, staffId: "s1", completed: true }],
      productsUsed: ["L'Oréal INOA 6.0"] },
    { id: "c16", time: "11:30", name: "Daniela Pessoa", phone: "1144000016", arrival: "done", status: "Completado",
      items: [{ svc: "Pedicuría", role: "nail", off: 0, dur: 50, price: 17000, staffId: "s9", completed: true }] },
    { id: "c17", time: "12:00", name: "Mariela Quiroga", phone: "1144000017", arrival: "done", status: "Completado",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s6", completed: true }] },
    { id: "c18", time: "12:00", name: "Eugenia Sotelo", phone: "1144000018", arrival: "done", status: "Completado",
      items: [{ svc: "Corte Caballeros", role: "stylist", off: 0, dur: 30, price: 15000, staffId: "s5", completed: true }] },
    { id: "c19", time: "12:15", name: "Constanza Rivero", phone: "1144000019", arrival: "done", status: "Completado",
      items: [{ svc: "Manicuría", role: "nail", off: 0, dur: 40, price: 13000, staffId: "s7", completed: true }] },
    { id: "c20", time: "12:30", name: "Helena Martín", phone: "1144000020", arrival: "done", status: "Completado",
      items: [{ svc: "Reflexología", role: "stylist", off: 0, dur: 45, price: 25000, staffId: "s10", completed: true }] },
    { id: "c21", time: "12:45", name: "Aldana Bertone", phone: "1144000021", arrival: "done", status: "Completado",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s4", completed: true }] },
    { id: "c22", time: "13:00", name: "Camila Rodríguez", phone: "1166889977", arrival: "done", status: "Completado",
      items: [
        { svc: "Color Inoa", role: "colorist", off: 0, dur: 30, price: 53000, staffId: "s2", completed: true },
        { svc: "Ritual Morena (con peinado)", role: "stylist", off: 30, dur: 60, price: 38500, staffId: "s6", completed: true },
      ], productsUsed: ["L'Oréal INOA 7.5", "Kérastase Rituel Therapiste"] },
  ];

  // ===== 8 IN PROGRESS at 14:00 =====
  // Valentina García: color processing with Lucía (s1), nails during processing (Sofía s7)
  const inProgress: SeedRow[] = [
    { id: "ip01", time: "13:30", name: "Valentina García", phone: "1144556677", arrival: "in_progress", arrivedAt: "13:25",
      items: [
        { svc: "Color Inoa", role: "colorist", off: 0, dur: 90, price: 53000, staffId: "s1", notes: "INOA 7.5 raíz · clienta sensible al amoníaco" },
        { svc: "Manicuría", role: "nail", off: 15, dur: 40, price: 13000, staffId: "s7", notes: "Asignada durante procesado · OPI Bubble Bath" },
      ] },
    { id: "ip02", time: "13:00", name: "Julieta Ramos", phone: "1177889900", arrival: "in_progress", arrivedAt: "12:55",
      items: [{ svc: "Color completo", role: "colorist", off: 0, dur: 90, price: 42500, staffId: "s2", notes: "Retoque base + glaseado" }] },
    { id: "ip03", time: "12:00", name: "Renata Torres", phone: "1166554433", arrival: "in_progress", arrivedAt: "11:55",
      items: [{ svc: "Mechas Platinum", role: "colorist", off: 0, dur: 150, price: 80000, staffId: "s3", notes: "Decoloración + matizado violeta" }] },
    { id: "ip04", time: "13:30", name: "Camila Méndez", phone: "1144556601", arrival: "in_progress", arrivedAt: "13:28",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s5", notes: "Despunte + capas largas" }] },
    { id: "ip05", time: "13:30", name: "Florencia Mansilla", phone: "1144556602", arrival: "in_progress", arrivedAt: "13:25",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s6" }] },
    { id: "ip06", time: "13:20", name: "Bianca Ortiz", phone: "1144556603", arrival: "in_progress", arrivedAt: "13:15",
      items: [{ svc: "Semipermanente OPI", role: "nail", off: 0, dur: 50, price: 21000, staffId: "s8", notes: "Rojo clásico" }] },
    { id: "ip07", time: "13:30", name: "Marisol Vega", phone: "1144556604", arrival: "in_progress", arrivedAt: "13:25",
      items: [{ svc: "Pedicuría", role: "nail", off: 0, dur: 50, price: 17000, staffId: "s9" }] },
    { id: "ip08", time: "13:10", name: "Sabrina Costa", phone: "1144556605", arrival: "in_progress", arrivedAt: "13:05",
      items: [{ svc: "Masaje descontracturante", role: "stylist", off: 0, dur: 60, price: 28500, staffId: "s10" }] },
  ];

  // ===== 3 NO-SHOWS (scheduled before 14:00, never arrived) =====
  const noShows: SeedRow[] = [
    { id: "ns01", time: "10:00", name: "Sandra Quiroga", phone: "1133445566", arrival: "pending",
      items: [{ svc: "Color completo", role: "colorist", off: 0, dur: 90, price: 42500, staffId: "s2" }] },
    { id: "ns02", time: "11:30", name: "Luciana Pérez", phone: "1199887766", arrival: "pending",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s5" }] },
    { id: "ns03", time: "13:00", name: "Romina Ortiz", phone: "1199887701", arrival: "pending",
      items: [{ svc: "Semipermanente OPI", role: "nail", off: 0, dur: 50, price: 21000, staffId: "s8" }] },
  ];

  // ===== 2 ARRIVED & WAITING =====
  const waiting: SeedRow[] = [
    { id: "wt01", time: "14:30", name: "Antonella López", phone: "1133221199", arrival: "arrived", arrivedAt: "13:55",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s4" }] },
    { id: "wt02", time: "14:30", name: "Paula Giménez", phone: "1188776655", arrival: "arrived", arrivedAt: "13:58",
      items: [{ svc: "Manicuría", role: "nail", off: 0, dur: 40, price: 13000, staffId: "s9" }] },
  ];

  // ===== 1 WALK-IN added at 13:45 =====
  const walkIns: SeedRow[] = [
    { id: "wi01", time: "14:10", name: "Lorena Suárez", phone: "1100990011", arrival: "arrived", arrivedAt: "13:45", walkIn: true,
      items: [{ svc: "Lavado Loreal / Wella SP", role: "stylist", off: 0, dur: 20, price: 6000, staffId: "s6", notes: "Walk-in agregada por recepción" }] },
  ];

  // ===== 14 UPCOMING (14:00 – 18:00, pending) =====
  const upcoming: SeedRow[] = [
    // Auto-scheduled haircut for Valentina García during her color processing
    { id: "up01", time: "14:45", name: "Valentina García", phone: "1144556677", arrival: "pending",
      items: [{ svc: "Corte Damas", role: "stylist", off: 0, dur: 45, price: 21000, staffId: "s4", notes: "Auto-asignado durante procesado de color" }] },
    { id: "up02", time: "14:30", name: "Bruno Díaz", phone: "1144332211", arrival: "pending",
      items: [{ svc: "Corte Caballeros", role: "stylist", off: 0, dur: 30, price: 15000, staffId: "s5" }] },
    { id: "up03", time: "14:30", name: "Roxana López", phone: "1144332212", arrival: "pending",
      items: [{ svc: "Reflexología", role: "stylist", off: 0, dur: 45, price: 25000, staffId: "s10" }] },
    { id: "up04", time: "14:45", name: "Yamila Castro", phone: "1144332213", arrival: "pending",
      items: [{ svc: "Manicuría", role: "nail", off: 0, dur: 40, price: 13000, staffId: "s7" }] },
    { id: "up05", time: "14:45", name: "Catalina Ríos", phone: "1144332214", arrival: "pending",
      items: [{ svc: "Reflejos con papel", role: "colorist", off: 0, dur: 120, price: 57000, staffId: "s3" }] },
    { id: "up06", time: "15:00", name: "Mora Acuña", phone: "1144332215", arrival: "pending",
      items: [{ svc: "Belleza de pies", role: "nail", off: 0, dur: 50, price: 19500, staffId: "s9" }] },
    { id: "up07", time: "15:30", name: "Daniela Torres", phone: "1144332216", arrival: "pending",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s6" }] },
    { id: "up08", time: "15:30", name: "Federico Páez", phone: "1144332217", arrival: "pending",
      items: [{ svc: "Corte Caballeros", role: "stylist", off: 0, dur: 30, price: 15000, staffId: "s5" }] },
    { id: "up09", time: "15:30", name: "Agustina Pérez", phone: "1144332218", arrival: "pending",
      items: [{ svc: "Color Inoa", role: "colorist", off: 0, dur: 90, price: 53000, staffId: "s1" }] },
    { id: "up10", time: "15:00", name: "Bárbara Núñez", phone: "1144332219", arrival: "pending",
      items: [{ svc: "Color Inoa", role: "colorist", off: 0, dur: 90, price: 53000, staffId: "s2" }] },
    { id: "up11", time: "16:00", name: "Lara Bianchi", phone: "1144332220", arrival: "pending",
      items: [{ svc: "Semipermanente OPI", role: "nail", off: 0, dur: 50, price: 21000, staffId: "s7" }] },
    { id: "up12", time: "16:30", name: "Tomás Ruiz", phone: "1144332221", arrival: "pending",
      items: [{ svc: "Corte Caballeros", role: "stylist", off: 0, dur: 30, price: 15000, staffId: "s4" }] },
    // Romina fully booked until 18:00 — adds two more colorist blocks back-to-back
    { id: "up13", time: "16:45", name: "Noelia Vega", phone: "1144332222", arrival: "pending",
      items: [{ svc: "Color completo", role: "colorist", off: 0, dur: 75, price: 42500, staffId: "s3", notes: "Romina · agenda llena hasta 18:00" }] },
    { id: "up14", time: "17:30", name: "Mariana Olivera", phone: "1100112233", arrival: "pending",
      items: [{ svc: "Ondas", role: "stylist", off: 0, dur: 30, price: 24000, staffId: "s10" }] },
  ];

  // ===== 1 CANCELLATION (frees an amber slot in timeline) =====
  const cancelled: SeedRow[] = [
    { id: "cn01", time: "15:00", name: "Verónica Salas", phone: "1100112255", status: "Cancelado",
      items: [{ svc: "Brushing Premium", role: "stylist", off: 0, dur: 40, price: 19500, staffId: "s4" }] },
  ];

  rows.push(...completed, ...inProgress, ...noShows, ...waiting, ...walkIns, ...upcoming, ...cancelled);

  const A: Appointment[] = rows.map(rowToAppt);

  // Loyalty history for the demo logged-in user (Valentina García) — 4/5 points
  A.push({ id: "h1", service: "Ritual Morena (con peinado)", category: "Lavados y tratamientos", date: "2026-04-15", time: "11:00", name: "Valentina García", phone: "1144556677", status: "Completado", price: 38500, productsUsed: ["Kérastase Rituel Therapiste", "Kérastase Elixir Ultime"] });
  A.push({ id: "h2", service: "Color Inoa", category: "Coloración", date: "2026-05-20", time: "14:30", name: "Valentina García", phone: "1144556677", status: "Completado", price: 53000, productsUsed: ["L'Oréal INOA 7.5"] });
  A.push({ id: "h3", service: "Semipermanente OPI", category: "Manos y pies", date: "2026-03-02", time: "16:00", name: "Valentina García", phone: "1144556677", status: "Completado", price: 21000 });
  A.push({ id: "h4", service: "Brushing Premium", category: "Peinados", date: "2026-06-01", time: "10:00", name: "Valentina García", phone: "1144556677", status: "Completado", price: 19500 });

  return A;
}

const SEED_APPTS: Appointment[] = buildTodaySeed();

export const ADMIN_SEED_APPTS_TODAY = (): Appointment[] =>
  apptStore.list().filter((a) => a.date === todayStr() && a.status !== "Cancelado");

const SEED_REVIEWS: Review[] = [
  { id: "r0", name: "Camila Rodríguez", rating: 5, comment: "Salí feliz, el color quedó impecable. Lucía es una genia. ¡Y el Ritual Morena es un mimo!", service: "Color Inoa + Ritual Morena", date: todayStr() },
  { id: "r1", name: "Sofía Martínez", rating: 5, comment: "Hermoso lugar y trato increíble. Salí feliz con mi color.", service: "Color Inoa", date: "2026-04-12" },
  { id: "r2", name: "Lucía Paredes", rating: 5, comment: "El Ritual Morena es una experiencia única.", service: "Ritual Morena (con peinado)", date: "2026-03-28" },
  { id: "r3", name: "Camila Romero", rating: 4, comment: "Excelente atención. El brushing me encantó.", service: "Brushing Premium", date: "2026-03-10" },
  { id: "r4", name: "Florencia Aguirre", rating: 5, comment: "Profesionalismo y calidez. Ya soy clienta fija.", service: "Mechas Platinum", date: "2026-02-22" },
  { id: "r5", name: "Valentina González", rating: 5, comment: "Las chicas son divinas y el lugar es precioso.", service: "Semipermanente OPI", date: "2026-05-18" },
];

const SEED_NOTIFS: Notification[] = [
  { id: "n_seed_s1", staffId: "s1", apptId: "ip01", message: "Tu clienta, Valentina García, ya llegó!", createdAt: SIM_EPOCH - 35 * 60 * 1000, read: false },
  { id: "n_seed_s7", staffId: "s7", apptId: "ip01", message: "Manicuría asignada: Valentina García (durante procesado de color).", createdAt: SIM_EPOCH - 18 * 60 * 1000, read: false },
  { id: "n_seed_s3", staffId: "s3", apptId: "ip03", message: "Tu clienta, Renata Torres, ya llegó!", createdAt: SIM_EPOCH - 125 * 60 * 1000, read: false },
  { id: "n_seed_s4", staffId: "s4", apptId: "wt01", message: "Tu clienta, Antonella López, ya llegó! Está esperando.", createdAt: SIM_EPOCH - 5 * 60 * 1000, read: false },
  { id: "n_seed_s9", staffId: "s9", apptId: "wt02", message: "Tu clienta, Paula Giménez, ya llegó! Está esperando.", createdAt: SIM_EPOCH - 2 * 60 * 1000, read: false },
  { id: "n_seed_s6", staffId: "s6", apptId: "wi01", message: "Walk-in: Lorena Suárez llegó para Lavado Loreal / Wella SP.", createdAt: SIM_EPOCH - 15 * 60 * 1000, read: false },
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
  list: (): Notification[] => read<Notification[]>(NOTIF_KEY, SEED_NOTIFS),
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
