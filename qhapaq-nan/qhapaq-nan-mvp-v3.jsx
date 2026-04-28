import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MapPin, Search, Star, Shield, MessageCircle, Heart, Camera, Award,
  X, Compass, Users, User, ChevronRight, ChevronDown, ChevronLeft, Sparkles, Wifi, Home,
  Briefcase, Mountain, CheckCircle2, Image as ImageIcon, Send,
  TrendingUp, Route, FileText, Lock, BookOpen, Zap, Filter, ArrowRight,
  Calendar, Download, Utensils, Package, Bus, Music, ArrowUp, Hash,
  Plus, Crown, AlertTriangle, MessageSquare, Pin,
  ShoppingBag, Tag, Truck, Stethoscope, BookMarked, Box,
  CircleDollarSign, Phone, Anchor, FileCheck, ShieldCheck, Eye, Upload,
  CreditCard, Loader2, Bell, Menu, Trophy,
} from "lucide-react";

// =============================================================
// Datos de muestra basados en el padrón oficial MINSA SERUMS 2026-I
// =============================================================
const PLAZAS = [
  { id: 1, institucion: "AMAZONAS", profesion: "MEDICINA", departamento: "AMAZONAS", provincia: "LUYA", distrito: "OCUMAL", gd: "GD-5", codigo: "00004844", establecimiento: "SAN JUAN DE OCUMAL", categoria: "I-2", zaf: true, ze: false, lat: -6.405, lng: -78.166, rating: 4.2, reviews: 8, plazas: 1 },
  { id: 2, institucion: "AMAZONAS", profesion: "MEDICINA", departamento: "AMAZONAS", provincia: "BAGUA", distrito: "IMAZA", gd: "GD-5", codigo: "00005070", establecimiento: "IMAZA", categoria: "I-3", zaf: true, ze: false, lat: -5.135, lng: -78.291, rating: 3.8, reviews: 12, plazas: 2 },
  { id: 3, institucion: "ANCASH", profesion: "ENFERMERIA", departamento: "ANCASH", provincia: "HUARI", distrito: "PONTO", gd: "GD-5", codigo: "00001834", establecimiento: "SAN MIGUEL DE PONTO", categoria: "I-1", zaf: false, ze: false, lat: -9.073, lng: -77.143, rating: 3.4, reviews: 5, plazas: 1 },
  { id: 4, institucion: "MINSA", profesion: "MEDICINA", departamento: "JUNIN", provincia: "SATIPO", distrito: "PANGOA", gd: "GD-5", codigo: "00012458", establecimiento: "NAYLAMP DE SONOMORO", categoria: "I-2", zaf: false, ze: true, lat: -11.787, lng: -74.508, rating: 4.6, reviews: 23, plazas: 1 },
  { id: 5, institucion: "MINSA", profesion: "ENFERMERIA", departamento: "HUANCAVELICA", provincia: "HUANCAVELICA", distrito: "HUACHOCOLPA", gd: "GD-5", codigo: "00003857", establecimiento: "HUACHOCOLPA", categoria: "I-2", zaf: true, ze: true, lat: -12.706, lng: -74.787, rating: 3.1, reviews: 14, plazas: 1 },
  { id: 6, institucion: "ESSALUD", profesion: "MEDICINA", departamento: "MADRE DE DIOS", provincia: "TAMBOPATA", distrito: "INAMBARI", gd: "GD-2", codigo: "00009318", establecimiento: "POSTA MEDICA MAZUKO", categoria: "I-2", zaf: false, ze: false, lat: -13.072, lng: -70.395, rating: 4.4, reviews: 19, plazas: 1 },
  { id: 7, institucion: "ESSALUD", profesion: "MEDICINA", departamento: "PASCO", provincia: "OXAPAMPA", distrito: "POZUZO", gd: "GD-4", codigo: "00009758", establecimiento: "POSTA MEDICA DE POZUZO", categoria: "I-2", zaf: false, ze: false, lat: -10.073, lng: -75.547, rating: 4.8, reviews: 31, plazas: 1 },
  { id: 8, institucion: "MINSA", profesion: "MEDICINA", departamento: "PIURA", provincia: "HUANCABAMBA", distrito: "SONDORILLO", gd: "GD-5", codigo: "00002266", establecimiento: "SONDORILLO", categoria: "I-3", zaf: true, ze: false, lat: -5.337, lng: -79.480, rating: 3.9, reviews: 17, plazas: 2 },
  { id: 9, institucion: "ESSALUD", profesion: "MEDICINA", departamento: "PIURA", provincia: "AYABACA", distrito: "AYABACA", gd: "GD-5", codigo: "00019914", establecimiento: "POSTA MÉDICA AYABACA", categoria: "I-2", zaf: true, ze: false, lat: -4.642, lng: -79.715, rating: 4.0, reviews: 9, plazas: 1 },
  { id: 10, institucion: "MINSA", profesion: "OBSTETRICIA", departamento: "AMAZONAS", provincia: "CHACHAPOYAS", distrito: "LA JALCA", gd: "GD-4", codigo: "00004951", establecimiento: "NUEVA ESPERANZA", categoria: "I-1", zaf: false, ze: false, lat: -6.470, lng: -77.750, rating: 4.1, reviews: 6, plazas: 1 },
  { id: 11, institucion: "MINSA", profesion: "MEDICINA", departamento: "LORETO", provincia: "MAYNAS", distrito: "INDIANA", gd: "GD-4", codigo: "00007021", establecimiento: "INDIANA", categoria: "I-3", zaf: false, ze: false, lat: -3.493, lng: -73.046, rating: 3.7, reviews: 22, plazas: 2 },
  { id: 12, institucion: "MINSA", profesion: "PSICOLOGIA", departamento: "AYACUCHO", provincia: "HUAMANGA", distrito: "VINCHOS", gd: "GD-4", codigo: "00006891", establecimiento: "VINCHOS", categoria: "I-3", zaf: false, ze: true, lat: -13.221, lng: -74.367, rating: 4.3, reviews: 11, plazas: 1 },
  { id: 13, institucion: "MINSA", profesion: "ENFERMERIA", departamento: "PUNO", provincia: "AZANGARO", distrito: "MUÑANI", gd: "GD-5", codigo: "00007890", establecimiento: "MUÑANI", categoria: "I-2", zaf: true, ze: false, lat: -14.770, lng: -69.951, rating: 3.5, reviews: 8, plazas: 1 },
  { id: 14, institucion: "MINSA", profesion: "ODONTOLOGIA", departamento: "CUSCO", provincia: "PAUCARTAMBO", distrito: "CHALLABAMBA", gd: "GD-4", codigo: "00008543", establecimiento: "CHALLABAMBA", categoria: "I-3", zaf: false, ze: false, lat: -13.225, lng: -71.617, rating: 4.5, reviews: 16, plazas: 1 },
  { id: 15, institucion: "MINSA", profesion: "MEDICINA", departamento: "HUANUCO", provincia: "HUACAYBAMBA", distrito: "PINRA", gd: "GD-5", codigo: "00000884", establecimiento: "CAJAS", categoria: "I-2", zaf: true, ze: false, lat: -8.879, lng: -77.029, rating: 3.2, reviews: 7, plazas: 1 },
  { id: 16, institucion: "MINSA", profesion: "NUTRICION", departamento: "UCAYALI", provincia: "CORONEL PORTILLO", distrito: "MASISEA", gd: "GD-4", codigo: "00011256", establecimiento: "MASISEA", categoria: "I-3", zaf: false, ze: false, lat: -8.702, lng: -74.343, rating: 4.0, reviews: 10, plazas: 1 },
  { id: 17, institucion: "ESSALUD", profesion: "ENFERMERIA", departamento: "AREQUIPA", provincia: "CARAVELI", distrito: "CHALA", gd: "GD-3", codigo: "00010876", establecimiento: "CENTRO MEDICO CHALA", categoria: "I-2", zaf: false, ze: false, lat: -15.852, lng: -74.245, rating: 4.4, reviews: 14, plazas: 1 },
  { id: 18, institucion: "MINSA", profesion: "MEDICINA", departamento: "TUMBES", provincia: "ZARUMILLA", distrito: "PAPAYAL", gd: "GD-2", codigo: "00002089", establecimiento: "PAPAYAL", categoria: "I-3", zaf: false, ze: false, lat: -3.595, lng: -80.286, rating: 4.7, reviews: 18, plazas: 1 },
];

const CURRENT_USER = {
  name: "Carla Mendoza",
  profession: "Medicina Humana",
  professionKey: "MEDICINA",
  university: "UNMSM",
  level: 3,
  karma: 247,
  verified: true,
  avatar: "CM",
  contributions: 14,
  badge: "Veterana de la Sierra",
  // Nuevo modelo: solo dos tipos. Profesional + nivel de validación (0-3).
  userType: "profesional",
  nivelValidacion: 3,
  verifiedSince: "marzo 2026",
  plazaActiva: { centro: "Posta Médica de Pozuzo", departamento: "Pasco", periodo: "2026-I" },
  dni: "70485132",
  resolucion: "RM N° 142-2026/MINSA",
  // Permite escribirle por DM (consentimiento mutuo). Default: cerrado.
  dmAbiertoPara: "todos", // "todos" | "validacion>=2" | "validacion>=3" | "nadie"
  recorrido: [
    {
      tipo: "serums",
      activo: true,
      titulo: "SERUMS · Médico Cirujano",
      lugar: "Posta Médica de Pozuzo",
      ubicacion: "Pozuzo, Pasco",
      periodo: "abril 2026 — abril 2027",
      duracion: "12 meses",
      verificado: true,
      detalles: "Plaza remunerada · MINSA · GD V — frontera",
    },
    {
      tipo: "trabajo",
      titulo: "Médica CAS",
      lugar: "Hospital Regional Daniel Alcides Carrión",
      ubicacion: "Cerro de Pasco",
      periodo: "junio 2025 — marzo 2026",
      duracion: "9 meses",
      verificado: false,
      detalles: "Servicio de emergencia · turnos 24h",
    },
    {
      tipo: "internado",
      titulo: "Internado de Medicina",
      lugar: "Hospital Cayetano Heredia",
      ubicacion: "Lima",
      periodo: "marzo 2024 — febrero 2025",
      duracion: "12 meses",
      verificado: false,
      detalles: "Rotaciones completas · Distinción académica",
    },
    {
      tipo: "estudios",
      titulo: "Medicina Humana",
      lugar: "Universidad Nacional Mayor de San Marcos",
      ubicacion: "Lima",
      periodo: "marzo 2018 — diciembre 2023",
      duracion: "6 años",
      verificado: false,
      detalles: "Egresada · cuarto superior",
    },
  ],
};

// =============================================================
// Tipos de usuario (solo dos) y niveles de validación incremental
// =============================================================
// Decisión arquitectural: visitante = lector. Profesional = todo lo demás.
// La credibilidad NO viene del "tipo" sino del NIVEL de validación que el
// profesional acumule. Esto reduce complejidad de roles y le da al usuario
// una métrica clara y progresiva de cuánto vale su voz.
const USER_TYPES = {
  visitante: {
    id: "visitante",
    label: "Usuario",
    short: "Lector",
    color: "#6B5F4F",
    bg: "#F1EFE8",
    iconBg: "#888780",
    icon: Eye,
    description:
      "Acceso de lectura completo. Explora el mapa, los foros y las reseñas. Si quieres aportar, registrate como profesional.",
    permissions: [
      { has: true, label: "Explorar mapa y plazas" },
      { has: true, label: "Leer foros y publicaciones" },
      { has: true, label: "Leer reseñas y boletines gratuitos" },
      { has: false, label: "Publicar, comentar o reseñar" },
      { has: false, label: "Vender en Marketplace o iniciar pedidos" },
    ],
  },
  profesional: {
    id: "profesional",
    label: "Profesional de salud",
    short: "Profesional",
    color: "#8E3F11",
    bg: "#FBF4E4",
    iconBg: "#B85820",
    icon: CheckCircle2,
    description:
      "Profesional o estudiante de ciencias de la salud. Tu credibilidad sube según el nivel de validación que acredites — empezás con email y podés llegar hasta plaza verificada en padrón oficial.",
    permissions: [
      { has: true, label: "Todo lo del visitante" },
      { has: true, label: "Publicar y comentar en feed y foros" },
      { has: true, label: "Reseñar plazas (peso según tu nivel)" },
      { has: true, label: "Vender e iniciar pedidos en Marketplace" },
      { has: true, label: "Logros validados desbloqueables por carrera" },
    ],
  },
};

// Niveles de validación dentro de "profesional".
// Cada nivel incrementa el peso del voto del usuario y desbloquea funciones.
// El usuario puede vivir feliz en N0 — la presión por subir es social
// (más credibilidad) y funcional (más peso en reseñas, más logros).
const VALIDATION_LEVELS = [
  {
    nivel: 0,
    id: "email",
    label: "Cuenta básica",
    short: "Sin verificar",
    description:
      "Email confirmado. Carrera autodeclarada. Tus aportes son visibles pero pesan menos en reseñas y rankings.",
    requiere: ["Email confirmado"],
    color: "#9C8F7C",
    bg: "#F1EFE8",
    iconBg: "#888780",
    weight: 1,
    badge: "○",
    desbloquea: ["Publicar en feed y foros", "Comentar", "Logros sin validación"],
  },
  {
    nivel: 1,
    id: "identidad",
    label: "Identidad verificada",
    short: "Identidad",
    description:
      "DNI peruano y prueba de vida. Sabemos que detrás de la cuenta hay una persona real con ese nombre — no una bot ni un perfil falso.",
    requiere: ["DNI vigente", "Selfie con detección de vida"],
    color: "#6B3E1F",
    bg: "#F7EDD8",
    iconBg: "#8B5A2B",
    weight: 2,
    badge: "◐",
    desbloquea: ["Vender en Marketplace", "Iniciar pedidos colectivos", "Reportar contenido"],
  },
  {
    nivel: 2,
    id: "profesion",
    label: "Profesión acreditada",
    short: "Acreditado",
    description:
      "Diploma de bachiller/título profesional o constancia de colegio profesional (CMP, CEP, COP, CTMP, COL del Perú). Sabemos que sos efectivamente profesional o estudiante de tu carrera.",
    requiere: ["Diploma o constancia de colegio profesional", "Cruce con base oficial cuando aplica"],
    color: "#1F3F26",
    bg: "#E1F5EE",
    iconBg: "#2D5938",
    weight: 4,
    badge: "●",
    desbloquea: ["Reseñas con peso doble", "Logros validados de tu carrera", "Acceso a foros profesionales cerrados"],
  },
  {
    nivel: 3,
    id: "experiencia",
    label: "Experiencia validada",
    short: "Verificado en sede",
    description:
      "Resolución SERUMS o constancia laboral cruzada con padrón MINSA / RENIPRESS. Sabemos en qué centro estás o estuviste, en qué período, con qué profesión.",
    requiere: ["Resolución SERUMS o constancia laboral", "Cruce con padrón MINSA / RENIPRESS"],
    color: "#7A1810",
    bg: "#FAECE7",
    iconBg: "#9A2A1F",
    weight: 6,
    badge: "★",
    desbloquea: [
      "Reseña verificada en tu centro (peso máximo)",
      "Logros geográficos y de zona (VRAEM, frontera, selva, sierra alta)",
      "Posibilidad de moderar el foro del centro",
    ],
  },
];

// =============================================================
// Sistema de logros — vanity (sin validación) y status (con validación)
// =============================================================
// Filosofía: los logros sin validación son JUEGO — la mayoría los va a tener,
// nadie debería sentirse excluido por no tenerlos. Los logros validados son
// CREDENCIALES blandas: dan status real porque cruzan con datos verificables
// (geografía de la plaza, padrón, número de reseñas con consenso, etc.).
// La rareza es informativa, no clasista.
const RAREZA_LOGRO = {
  comun:       { label: "Común",       color: "#6B5F4F", bg: "#F1EFE8" },
  rara:        { label: "Rara",        color: "#8E3F11", bg: "#FBF4E4" },
  epica:       { label: "Épica",       color: "#7A1810", bg: "#FAECE7" },
  legendaria:  { label: "Legendaria",  color: "#5A4214", bg: "#FAEEDA" },
};

const LOGROS_GENERALES = [
  // Sin validación — sociales / de uso. La mayoría los tiene.
  { id: "primer_post",       carrera: "TODAS", titulo: "Primer paso",         descripcion: "Publicaste tu primera entrada.",                              validado: false, rareza: "comun",      icon: "MessageCircle" },
  { id: "diez_comentarios",  carrera: "TODAS", titulo: "Buen vecino",         descripcion: "Dejaste 10 comentarios útiles a otros profesionales.",       validado: false, rareza: "comun",      icon: "MessageSquare" },
  { id: "explorador_mapa",   carrera: "TODAS", titulo: "Explorador",          descripcion: "Visitaste 20+ plazas en el mapa.",                            validado: false, rareza: "comun",      icon: "Compass"       },
  { id: "trasnochador",      carrera: "TODAS", titulo: "Búho de guardia",     descripcion: "Posteaste entre 12am y 5am — los que entienden, entienden.", validado: false, rareza: "comun",      icon: "Mountain"      },
  { id: "voz_andina",        carrera: "TODAS", titulo: "Voz andina",          descripcion: "Posteaste contenido en quechua, aymara o lengua originaria.", validado: false, rareza: "rara",      icon: "BookOpen"      },

  // Con validación — credenciales blandas verificables.
  { id: "veterano_vraem",    carrera: "TODAS", titulo: "Veterano del VRAEM",  descripcion: "Servicio verificado en zona declarada en emergencia.",        validado: true,  rareza: "epica",      icon: "Shield",        requiereValidacion: 3, requiereDato: "ze=true" },
  { id: "selvatico",         carrera: "TODAS", titulo: "Selvático",           descripcion: "Servicio verificado en selva baja (Loreto, MdD, Ucayali).",  validado: true,  rareza: "rara",       icon: "Mountain",      requiereValidacion: 3, requiereDato: "departamento in [LORETO,MADRE DE DIOS,UCAYALI,AMAZONAS]" },
  { id: "sierra_alta",       carrera: "TODAS", titulo: "Sierra alta",         descripcion: "Servicio verificado a más de 3,500 msnm.",                    validado: true,  rareza: "rara",       icon: "Mountain",      requiereValidacion: 3, requiereDato: "altitud>3500" },
  { id: "frontera",          carrera: "TODAS", titulo: "Guardián de frontera", descripcion: "Servicio verificado en distrito fronterizo.",                validado: true,  rareza: "epica",      icon: "Anchor",        requiereValidacion: 3, requiereDato: "distrito.frontera=true" },
  { id: "resenista",         carrera: "TODAS", titulo: "Reseñista de oficio", descripcion: "5+ reseñas con consenso positivo de la comunidad.",          validado: true,  rareza: "rara",       icon: "Star",          requiereValidacion: 2 },
  { id: "mentor",            carrera: "TODAS", titulo: "Mentor de comunidad", descripcion: "Moderador activo de un foro por más de 6 meses.",            validado: true,  rareza: "legendaria", icon: "Crown",         requiereValidacion: 3 },
];

const LOGROS_POR_CARRERA = {
  MEDICINA: [
    { id: "med_primer_parto",  titulo: "Primer parto atendido",   descripcion: "Atención de parto documentada en zona rural.",                  validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "Heart"      },
    { id: "med_emergencia",    titulo: "Emergencia resuelta",     descripcion: "Atención de emergencia obstétrica o trauma documentada.",       validado: true,  rareza: "epica", requiereValidacion: 2, icon: "Zap"        },
    { id: "med_campana_vac",   titulo: "Campaña de vacunación",   descripcion: "Coordinó o ejecutó campaña con cobertura >85%.",                validado: true,  rareza: "rara",  requiereValidacion: 3, icon: "Shield"     },
    { id: "med_microred",      titulo: "Microred completa",       descripcion: "Cubrió todos los EESS de su microred al menos una vez.",        validado: true,  rareza: "epica", requiereValidacion: 3, icon: "MapPin"     },
    { id: "med_referencia",    titulo: "Sistema de referencia",   descripcion: "Refirió pacientes a hospital nivel II o III por primera vez.",  validado: false, rareza: "comun",                        icon: "ArrowRight" },
  ],
  ENFERMERIA: [
    { id: "enf_triaje",        titulo: "Maestra del triaje",      descripcion: "Triaje en posta rural sin médico de guardia.",                  validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "TrendingUp" },
    { id: "enf_aiepi",         titulo: "AIEPI certificada",       descripcion: "Estrategia AIEPI aplicada y documentada.",                      validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "Heart"      },
    { id: "enf_visita_dom",    titulo: "Visita domiciliaria",     descripcion: "Hiciste tu primer round de visita domiciliaria.",               validado: false, rareza: "comun",                        icon: "Home"       },
  ],
  OBSTETRICIA: [
    { id: "obs_partos",        titulo: "Partera de río",          descripcion: "30+ partos documentados en zona ribereña o ZAF.",               validado: true,  rareza: "epica", requiereValidacion: 3, icon: "Heart"      },
    { id: "obs_prenatal",      titulo: "Control prenatal completo", descripcion: "Acompañó 20+ gestantes con todos sus controles.",             validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "CheckCircle2" },
    { id: "obs_intercultural", titulo: "Parto intercultural",     descripcion: "Atención documentada en comunidad nativa o quechua-hablante.", validado: true,  rareza: "epica", requiereValidacion: 2, icon: "BookOpen"   },
  ],
  ODONTOLOGIA: [
    { id: "odo_campana",       titulo: "Sonrisa rural",           descripcion: "Campaña con 50+ atenciones documentadas.",                      validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "Sparkles"   },
    { id: "odo_fluor",         titulo: "Apóstol del flúor",       descripcion: "Convencer a una comunidad escéptica de fluorizar.",             validado: false, rareza: "comun",                        icon: "Sparkles"   },
  ],
  PSICOLOGIA: [
    { id: "psi_intercultural", titulo: "Terapia en lengua originaria", descripcion: "Sesiones documentadas en quechua, aymara o asháninka.",   validado: true,  rareza: "epica", requiereValidacion: 2, icon: "BookOpen"   },
    { id: "psi_post_emerg",    titulo: "Apoyo en post-emergencia", descripcion: "Intervención tras desastre natural o crisis comunitaria.",    validado: true,  rareza: "epica", requiereValidacion: 3, icon: "Shield"     },
    { id: "psi_grupo",         titulo: "Facilitador de grupos",   descripcion: "Tu primer grupo terapéutico completo.",                         validado: false, rareza: "comun",                        icon: "Users"      },
  ],
  NUTRICION: [
    { id: "nut_anemia",        titulo: "Combatiente de anemia",   descripcion: "Programa contra anemia infantil con resultados documentados.", validado: true,  rareza: "rara",  requiereValidacion: 3, icon: "TrendingUp" },
    { id: "nut_alimentaria",   titulo: "Seguridad alimentaria",   descripcion: "Programa comunitario de soberanía alimentaria documentado.",   validado: true,  rareza: "rara",  requiereValidacion: 2, icon: "Utensils"   },
    { id: "nut_recetario",     titulo: "Recetario rural",         descripcion: "Documentaste 10+ recetas con productos locales.",               validado: false, rareza: "comun",                        icon: "Utensils"   },
  ],
};

// Para el demo, asumimos que Carla (MEDICINA, nivel 3) tiene desbloqueados:
const LOGROS_DESBLOQUEADOS_DEMO = [
  "primer_post", "diez_comentarios", "explorador_mapa", "trasnochador",
  "veterano_vraem", "resenista",
  "med_primer_parto", "med_emergencia", "med_referencia",
];

const REVIEWS = {
  4: [
    {
      author: "Diego Quispe", profession: "Médico", year: "2024-II",
      avatar: "DQ", verified: true, level: 4,
      ratings: { vivienda: 4, equipo: 3, jefatura: 5, conectividad: 2, seguridad: 4, carga: 3 },
      text: "Plaza dura pero formativa. Comunidad asháninka, mucho aprendizaje cultural. La conectividad es casi nula, llevar libros físicos. Jefe de microred excepcional, te respalda en emergencias. Lleven antimaláricos preventivos.",
      pros: ["Jefe de microred muy presente", "Vivienda decente con cocina", "Comunidad receptiva"],
      cons: ["Sin señal de celular", "2h en moto al hospital de referencia", "Riesgo de paludismo"],
      photos: 3, likes: 47, helpful: 38, daysAgo: 12,
    },
    {
      author: "María Llanos", profession: "Enfermera", year: "2024-I",
      avatar: "ML", verified: true, level: 5,
      ratings: { vivienda: 4, equipo: 3, jefatura: 5, conectividad: 2, seguridad: 4, carga: 4 },
      text: "Hice mi SERUMS aquí y volvería. Hay que adaptarse al ritmo de la selva. Bono ZE compensa. Lleven ropa ligera, repelente potente y paciencia para los apagones de luz.",
      pros: ["Bono ZE pagado puntual", "Equipo médico unido", "Buena experiencia clínica"],
      cons: ["Apagones frecuentes", "Mercado pequeño", "Lluvia 4 meses al año"],
      photos: 6, likes: 52, helpful: 41, daysAgo: 45,
    },
  ],
  7: [
    {
      author: "Andrés Ríos", profession: "Médico", year: "2025-I",
      avatar: "AR", verified: true, level: 3,
      ratings: { vivienda: 5, equipo: 4, jefatura: 5, conectividad: 4, seguridad: 5, carga: 3 },
      text: "Pozuzo es una sorpresa. Pueblo de descendientes austriacos, todo ordenado, vivienda excelente provista por el centro. Casuística variada y manejable. Recomendado para primer SERUMS.",
      pros: ["Vivienda como hotel", "Comunidad europea acogedora", "Carga laboral razonable"],
      cons: ["Lejos de Lima (12h bus)", "Sin bono ZAF/ZE"],
      photos: 8, likes: 73, helpful: 65, daysAgo: 30,
    },
  ],
};

const FEED_POSTS = [
  { id: 1, author: "Diego Quispe", avatar: "DQ", verified: true, level: 4, location: "Naylamp de Sonomoro, Junín", time: "hace 2h",
    profesion: "MEDICINA", departamento: "JUNIN", provincia: "SATIPO", distrito: "PANGOA", establecimiento: "NAYLAMP DE SONOMORO", modalidad: "remunerado",
    text: "Tercer mes en VRAEM. Hoy atendimos un parto complicado a las 3am. No hubiera podido sin la enfermera que ya lleva 4 años aquí. La experiencia que dan estos lugares no la enseñan en ninguna universidad.",
    likes: 124, comments: 18, type: "reflection",
    media: { type: "video", scene: "selva", duration: "1:24" } },
  { id: 2, author: "María Llanos", avatar: "ML", verified: true, level: 5, location: "Lima → buscando SERUMS", time: "hace 5h",
    profesion: "ENFERMERIA", departamento: "PIURA", provincia: "AYABACA", distrito: "AYABACA", establecimiento: "POSTA MÉDICA AYABACA", modalidad: "remunerado",
    text: "PREGUNTA para quienes hicieron SERUMS en costa norte: ¿cómo es realmente el tema vivienda en Ayabaca alta? El centro provee algo o hay que alquilar? Mi familia me presiona por ir a la sierra pero quiero datos reales 🙏",
    likes: 67, comments: 34, type: "question", media: null },
  { id: 3, author: "Sofía Ramírez", avatar: "SR", verified: true, level: 3, location: "Pozuzo, Pasco", time: "hace 1d",
    profesion: "MEDICINA", departamento: "PASCO", provincia: "OXAPAMPA", distrito: "POZUZO", establecimiento: "POSTA MEDICA DE POZUZO", modalidad: "remunerado",
    text: "Mini-guía para quien venga acá: 1) Bus desde Lima sale 7pm, llegas 8am 2) La vivienda está incluida y es ESPECTACULAR 3) Hay señal de Movistar y Claro 4) El alemán y el quechua se mezclan, escucharás ambos.",
    likes: 203, comments: 41, type: "guide",
    media: { type: "photo", scene: "andes" } },
  { id: 4, author: "José Huamán", avatar: "JH", verified: true, level: 3, location: "Challabamba, Cusco", time: "hace 1d",
    profesion: "ODONTOLOGIA", departamento: "CUSCO", provincia: "PAUCARTAMBO", distrito: "CHALLABAMBA", establecimiento: "CHALLABAMBA", modalidad: "remunerado",
    text: "Acabo de terminar mi primera campaña de salud bucal en Challabamba. Atendimos a 87 niños en 3 días. Lo más difícil no fue clínico — fue convencer a las madres de que la flúor no es veneno. La salud pública es 70% comunicación.",
    likes: 89, comments: 12, type: "reflection",
    media: { type: "photo", scene: "community" } },
  { id: 5, author: "Lucía Paredes", avatar: "LP", verified: true, level: 4, location: "Vinchos, Ayacucho", time: "hace 2d",
    profesion: "PSICOLOGIA", departamento: "AYACUCHO", provincia: "HUAMANGA", distrito: "VINCHOS", establecimiento: "VINCHOS", modalidad: "remunerado",
    text: "PREGUNTA: ¿alguien tiene material en quechua chanka para terapia con adultos? Estoy traduciendo todo sobre la marcha y siento que pierdo matices clínicos importantes. Cualquier referencia ayuda 🙏",
    likes: 41, comments: 27, type: "question", media: null },
  { id: 6, author: "Roberto Aliaga", avatar: "RA", verified: true, level: 4, location: "Mazuko, Madre de Dios", time: "hace 3d",
    profesion: "ENFERMERIA", departamento: "MADRE DE DIOS", provincia: "TAMBOPATA", distrito: "INAMBARI", establecimiento: "POSTA MEDICA MAZUKO", modalidad: "remunerado",
    text: "Mineros informales, fiebre amarilla, pacientes que llegan deshidratados después de 6 horas en bote. Mazuko es intenso pero EsSalud paga puntual y la posta tiene buen stock. Si vienen, traigan ropa que no extrañen — el polvo rojo no se va.",
    likes: 156, comments: 22, type: "guide",
    media: { type: "video", scene: "travel", duration: "0:48" } },
  { id: 7, author: "Patricia Núñez", avatar: "PN", verified: true, level: 3, location: "Indiana, Loreto", time: "hace 4d",
    profesion: "OBSTETRICIA", departamento: "LORETO", provincia: "MAYNAS", distrito: "INDIANA", establecimiento: "INDIANA", modalidad: "equivalente",
    text: "Plaza equivalente en Indiana. Sin remuneración pero la experiencia obstétrica es brutal — atiendo en promedio 4 partos a la semana. Las gestantes vienen en peque-peque desde comunidades río arriba. Estoy aprendiendo más en 2 meses que en 6 meses de internado.",
    likes: 78, comments: 19, type: "reflection", media: null },
  { id: 8, author: "Andrés Castillo", avatar: "AC", verified: true, level: 5, location: "Sondorillo, Piura", time: "hace 5d",
    profesion: "MEDICINA", departamento: "PIURA", provincia: "HUANCABAMBA", distrito: "SONDORILLO", establecimiento: "SONDORILLO", modalidad: "remunerado",
    text: "Una cosa que nadie te cuenta del SERUMS en sierra alta: el frío de las 4am cuando hay parto y el grupo electrógeno se apagó. Comprenles a sus pacientes una manta térmica si pueden. La diferencia es real.",
    likes: 234, comments: 45, type: "guide",
    media: { type: "photo", scene: "clinic-night" } },
];

const BOLETINES = [
  {
    id: 1, tipo: "Edición especial · Quincenal",
    fechas: "1 — 15 octubre 2026",
    titulo: "VRAEM: voces desde la trinchera",
    subtitulo: "Análisis de 47 publicaciones de serumistas en zonas declaradas en emergencia",
    cover: { from: "#9A2A1F", via: "#6B3E1F", to: "#2A1410" },
    resumen: "Patrones recurrentes en condiciones laborales, seguridad operacional, manejo de salud mental y estrategias de adaptación cultural. Incluye entrevistas adicionales y enlaces directos a las publicaciones originales que sirvieron de base.",
    topics: ["VRAEM", "Bono ZE", "Seguridad", "Salud mental"],
    postsAnalizados: 47,
    actividadesIncluidas: 3,
    paginas: 18,
    precio: 14.90,
    free: false,
    destacado: true,
    autor: "Síntesis IA · Curado por equipo Qhapaq Ñan",
    secciones: [
      "Mapa de riesgos por sub-zona del VRAEM",
      "Protocolos no oficiales de seguridad personal",
      "Manejo de carga emocional sostenida",
      "3 actividades académicas exclusivas (webinars de psicología en zona crítica)",
    ],
  },
  {
    id: 2, tipo: "Boletín semanal",
    fechas: "8 — 14 octubre 2026",
    titulo: "Selva alta: Oxapampa y Satipo bajo la lupa",
    subtitulo: "32 publicaciones, 8 sedes, una región en transformación",
    cover: { from: "#2D5938", via: "#1F3F26", to: "#0E2014" },
    resumen: "Comparativa de vivienda, conectividad, transporte y dinámica comunitaria entre Pozuzo, Villa Rica, Puerto Bermúdez y otras 5 sedes. Ranking de aceptación según testimonios verificados.",
    topics: ["Selva alta", "Oxapampa", "Satipo", "Vivienda"],
    postsAnalizados: 32,
    actividadesIncluidas: 2,
    paginas: 12,
    precio: 9.90,
    free: false,
  },
  {
    id: 3, tipo: "Boletín fundacional · Permanente",
    fechas: "Edición continua",
    titulo: "Los primeros 30 días",
    subtitulo: "Guía colectiva sintetizada de 200+ testimonios verificados",
    cover: { from: "#B85820", via: "#8E3F11", to: "#4A1F08" },
    resumen: "Lo que toda persona debería saber antes de su primer día de SERUMS — equipaje, adaptación cultural, primeras decisiones administrativas, errores comunes y atajos descubiertos por quienes ya pasaron por ahí.",
    topics: ["Primer SERUMS", "Equipaje", "Adaptación", "Trámites"],
    postsAnalizados: 217,
    actividadesIncluidas: 5,
    paginas: 24,
    precio: 0,
    free: true,
    destacado: false,
  },
  {
    id: 4, tipo: "Boletín especial · Mensual",
    fechas: "Septiembre 2026",
    titulo: "Salud mental del serumista",
    subtitulo: "El costo emocional invisible del servicio rural",
    cover: { from: "#6B3E1F", via: "#4A2A14", to: "#1F1410" },
    resumen: "Análisis cualitativo de 89 testimonios sobre aislamiento, ansiedad clínica, síndrome del impostor y mecanismos de afronte que emergen orgánicamente en la comunidad.",
    topics: ["Salud mental", "Aislamiento", "Burnout"],
    postsAnalizados: 89,
    actividadesIncluidas: 4,
    paginas: 22,
    precio: 19.90,
    free: false,
  },
];

const PROFESIONES = ["MEDICINA", "ENFERMERIA", "OBSTETRICIA", "ODONTOLOGIA", "PSICOLOGIA", "NUTRICION"];

// =============================================================
// Foros — comunidades persistentes por centro de salud
// =============================================================
const FORO_CATEGORIES = [
  { id: "general", label: "General", icon: MessageCircle, color: "#6B5F4F" },
  { id: "cocina", label: "Cocina", icon: Utensils, color: "#B85820" },
  { id: "vivienda", label: "Vivienda", icon: Home, color: "#2D5938" },
  { id: "equipaje", label: "Equipaje", icon: Package, color: "#6B3E1F" },
  { id: "viajes", label: "Viajes", icon: Bus, color: "#8B2418" },
  { id: "esparcimiento", label: "Esparcimiento", icon: Music, color: "#D9A02D" },
  { id: "casuistica", label: "Casuística", icon: Briefcase, color: "#9A2A1F" },
  { id: "recursos", label: "Recursos", icon: BookOpen, color: "#2D5938" },
];

const FOROS = [
  {
    id: "pozuzo",
    plazaId: 7,
    centro: "Posta Médica de Pozuzo",
    departamento: "PASCO",
    provincia: "OXAPAMPA",
    distrito: "POZUZO",
    miembros: 142,
    activosHoy: 23,
    posts: 89,
    color: "#2D5938",
    descripcion: "Comunidad de profesionales SERUMS pasados, presentes y futuros de Pozuzo. Compartimos vivencias, recetas, recomendaciones y nos cuidamos entre todos.",
    reglas: [
      "Respeto mutuo. Sin ataques personales ni a la comunidad pozuzina.",
      "No identificar pacientes ni compartir información clínica sensible.",
      "Verificación obligatoria para postear: tu paso por Pozuzo se valida.",
      "Promociones comerciales solo en hilo correspondiente.",
      "Idioma libre: español, alemán, quechua — todos somos comunidad.",
    ],
    moderadores: [
      { name: "Sofía Ramírez", avatar: "SR", level: 5 },
      { name: "Andrés Ríos", avatar: "AR", level: 4 },
    ],
    suscrito: true,
  },
  {
    id: "sonomoro",
    plazaId: 4,
    centro: "Naylamp de Sonomoro",
    departamento: "JUNIN",
    provincia: "SATIPO",
    distrito: "PANGOA",
    miembros: 87,
    activosHoy: 11,
    posts: 56,
    color: "#9A2A1F",
    descripcion: "Foro VRAEM. Información práctica para vivir y trabajar en zona declarada en emergencia. Aquí prima la seguridad, el respaldo mutuo y el cuidado.",
    reglas: [
      "Cero información de operativos militares o policiales en hilos públicos.",
      "Discreción geográfica al hablar de movimientos personales.",
      "Reportar al moderador cualquier intento de filtración externa.",
      "No identificar comunidades nativas en situaciones de riesgo.",
    ],
    moderadores: [{ name: "Diego Quispe", avatar: "DQ", level: 4 }],
    suscrito: true,
  },
  {
    id: "indiana",
    plazaId: 11,
    centro: "Indiana, Loreto",
    departamento: "LORETO",
    provincia: "MAYNAS",
    distrito: "INDIANA",
    miembros: 64,
    activosHoy: 7,
    posts: 38,
    color: "#1F3F26",
    descripcion: "Foro de profesionales en la Amazonía baja. Casuística tropical, navegación fluvial, vida en comunidad ribereña.",
    reglas: [
      "Respeto absoluto a las comunidades indígenas de la zona.",
      "Compartir conocimiento sobre medicina tropical es bienvenido.",
      "Documentar avistamientos de fauna peligrosa con fecha y ubicación general.",
    ],
    moderadores: [{ name: "Patricia Núñez", avatar: "PN", level: 3 }],
    suscrito: false,
  },
  {
    id: "challabamba",
    plazaId: 14,
    centro: "Challabamba, Cusco",
    departamento: "CUSCO",
    provincia: "PAUCARTAMBO",
    distrito: "CHALLABAMBA",
    miembros: 53,
    activosHoy: 4,
    posts: 27,
    color: "#B85820",
    descripcion: "Sierra cusqueña en altura. Quechua de uso diario, gastronomía andina, manejo de soroche y experiencias en comunidad.",
    reglas: [
      "Respeto a tradiciones quechuas y andinas.",
      "Quechua bienvenido — postea en el idioma que prefieras.",
      "Comparte recetas y costumbres con respeto cultural.",
    ],
    moderadores: [{ name: "José Huamán", avatar: "JH", level: 3 }],
    suscrito: false,
  },
  {
    id: "vinchos",
    plazaId: 12,
    centro: "Vinchos, Ayacucho",
    departamento: "AYACUCHO",
    provincia: "HUAMANGA",
    distrito: "VINCHOS",
    miembros: 41,
    activosHoy: 3,
    posts: 19,
    color: "#6B3E1F",
    descripcion: "Comunidad de salud mental y atención primaria en sierra ayacuchana. Foco en abordaje culturalmente situado.",
    reglas: [
      "Cuidado al hablar de memoria histórica de la zona — sensibilidad alta.",
      "Salud mental: máxima discreción profesional.",
    ],
    moderadores: [{ name: "Lucía Paredes", avatar: "LP", level: 4 }],
    suscrito: true,
  },
  {
    id: "mazuko",
    plazaId: 6,
    centro: "Posta Mazuko, Madre de Dios",
    departamento: "MADRE DE DIOS",
    provincia: "TAMBOPATA",
    distrito: "INAMBARI",
    miembros: 38,
    activosHoy: 5,
    posts: 22,
    color: "#D9A02D",
    descripcion: "Selva sur, minería informal, casuística infectológica intensa. Para quienes trabajan en el corredor minero.",
    reglas: [
      "Cero comentarios sobre actividades mineras específicas.",
      "Reporte de exposición a mercurio: usar el hilo dedicado.",
    ],
    moderadores: [{ name: "Roberto Aliaga", avatar: "RA", level: 4 }],
    suscrito: false,
  },
];

const FORO_POSTS = [
  // Pozuzo
  {
    id: 1, foroId: "pozuzo", categoria: "cocina", pinned: true,
    titulo: "Receta austriaca-peruana: Schnitzel con ají amarillo",
    autor: "Sofía Ramírez", avatar: "SR", level: 3, verified: true, time: "hace 3h",
    body: "Esta receta me la enseñó la dueña del hostal Tirol. Funciona con cualquier carne de chancho de la zona. La clave es el ají amarillo en la salsa de mostaza — le da el toque peruano sin perder la base austriaca…",
    upvotes: 47, comments: 8,
  },
  {
    id: 2, foroId: "pozuzo", categoria: "viajes",
    titulo: "Bus nocturno desde Lima en 2026: ¿cuál es la mejor empresa?",
    autor: "Andrés Ríos", avatar: "AR", level: 4, verified: true, time: "hace 1d",
    body: "He probado tres empresas en estos meses. Comparativa rápida de precio, comodidad y puntualidad. Spoiler: una es claramente la mejor pero la más cara…",
    upvotes: 23, comments: 14,
  },
  {
    id: 3, foroId: "pozuzo", categoria: "equipaje",
    titulo: "Lista actualizada de qué traer (versión post-3 meses)",
    autor: "Sofía Ramírez", avatar: "SR", level: 3, verified: true, time: "hace 2d",
    body: "Después de 3 meses acá actualizo la lista que me pasaron antes de venir. Lo que sobra, lo que falta y lo que nadie te dice…",
    upvotes: 89, comments: 22,
  },
  {
    id: 4, foroId: "pozuzo", categoria: "esparcimiento",
    titulo: "Cataratas El Encanto: vale la caminata?",
    autor: "Andrés Ríos", avatar: "AR", level: 4, verified: true, time: "hace 4d",
    body: "Hicimos la caminata el domingo pasado. 2h de ida, 1.5h de vuelta. Vale 100%. Llevar zapatos que se mojen.",
    upvotes: 31, comments: 6,
  },
  {
    id: 5, foroId: "pozuzo", categoria: "general",
    titulo: "Bienvenida — léelo antes de tu primer post",
    autor: "Sofía Ramírez", avatar: "SR", level: 3, verified: true, time: "hace 2 sem", pinned: true,
    body: "Si recién llegas a este foro, gracias por unirte. Antes de publicar, lee las reglas y cuéntanos quién eres en el hilo de presentaciones…",
    upvotes: 156, comments: 47,
  },
  // Sonomoro / VRAEM
  {
    id: 6, foroId: "sonomoro", categoria: "general", pinned: true,
    titulo: "⚠️ Protocolo de comunicación segura del foro",
    autor: "Diego Quispe", avatar: "DQ", level: 4, verified: true, time: "hace 1 sem",
    body: "Recordatorio importante sobre qué NO se publica en este foro. Cualquier duda, MD al moderador antes de postear.",
    upvotes: 78, comments: 12,
  },
  {
    id: 7, foroId: "sonomoro", categoria: "vivienda",
    titulo: "Vivienda en Sonomoro: la realidad de la posta vs alquilar",
    autor: "Diego Quispe", avatar: "DQ", level: 4, verified: true, time: "hace 3d",
    body: "La posta tiene un cuarto pero está pegado al consultorio. Para 12 meses, considera alquilar un cuarto a 2 cuadras. Acá el detalle de costos y dónde buscar.",
    upvotes: 42, comments: 18,
  },
  {
    id: 8, foroId: "sonomoro", categoria: "casuistica",
    titulo: "Manejo de paludismo: lo que no aparece en las guías oficiales",
    autor: "Diego Quispe", avatar: "DQ", level: 4, verified: true, time: "hace 5d",
    body: "Casuística práctica sobre cuándo derivar y cuándo manejar localmente. Conversado con la enfermera que lleva 4 años acá.",
    upvotes: 67, comments: 23,
  },
  // Vinchos
  {
    id: 9, foroId: "vinchos", categoria: "recursos",
    titulo: "Material clínico en quechua chanka — recopilación colectiva",
    autor: "Lucía Paredes", avatar: "LP", level: 4, verified: true, time: "hace 1 sem",
    body: "Estoy armando una carpeta compartida con material útil. Si tienen recursos, súmenlos al hilo. Por ahora tengo: cuestionarios validados, glosarios y…",
    upvotes: 54, comments: 16,
  },
  {
    id: 10, foroId: "vinchos", categoria: "general",
    titulo: "Tema sensible: memoria histórica al atender adultos mayores",
    autor: "Lucía Paredes", avatar: "LP", level: 4, verified: true, time: "hace 2 sem",
    body: "Reflexión sobre cómo abordar consultas de adultos mayores que vivieron el conflicto. Llevo varios meses en esto y creo importante compartir aprendizajes.",
    upvotes: 91, comments: 34,
  },
];

// =============================================================
// Marketplace — venta entre serumistas
// =============================================================
const MARKET_CATEGORIES = [
  { id: "pruebas", label: "Pruebas psicológicas", icon: BookMarked, color: "#9A2A1F" },
  { id: "equipo", label: "Equipo médico", icon: Stethoscope, color: "#2D5938" },
  { id: "libros", label: "Libros y atlas", icon: BookOpen, color: "#6B3E1F" },
  { id: "software", label: "Software / cursos", icon: Zap, color: "#B85820" },
  { id: "mobiliario", label: "Mobiliario", icon: Home, color: "#D9A02D" },
  { id: "transporte", label: "Transporte", icon: Bus, color: "#8B2418" },
  { id: "otros", label: "Otros", icon: Box, color: "#6B5F4F" },
];

const MARKET_LISTINGS = [
  {
    id: 1, categoria: "pruebas", titulo: "WISC-V completo · manual + protocolos + carpeta",
    precio: 1850, precioOriginal: 2900, condicion: "casi_nuevo",
    descripcion: "Batería completa de WISC-V que usé durante mi SERUMS. Manuales de aplicación e interpretación incluidos, juego completo de carpeta de estímulos y 12 protocolos sin usar. Una sola dueña, cuidado al detalle.",
    seller: { name: "Lucía Paredes", avatar: "LP", level: 4, verified: true, ventasPrev: 3 },
    ubicacion: "Vinchos, Ayacucho", departamento: "AYACUCHO", profesion: "PSICOLOGIA",
    envio: true, recojo: true, fotos: 4, vistas: 47, time: "hace 2d",
  },
  {
    id: 2, categoria: "equipo", titulo: "Estetoscopio Littmann Cardiology IV",
    precio: 480, precioOriginal: 780, condicion: "casi_nuevo",
    descripcion: "Cardiology IV negro, comprado hace 8 meses para SERUMS. Funciona perfecto, viene con caja, manual y placa de identificación grabada (puede pulirse). Lo vendo porque me cambié a uno electrónico.",
    seller: { name: "Diego Quispe", avatar: "DQ", level: 4, verified: true, ventasPrev: 1 },
    ubicacion: "Sonomoro, Junín", departamento: "JUNIN", profesion: "MEDICINA",
    envio: true, recojo: false, fotos: 3, vistas: 89, time: "hace 5h",
  },
  {
    id: 3, categoria: "pruebas", titulo: "Test PROLEC-R · manual + cuadernillo + 20 protocolos",
    precio: 320, precioOriginal: 550, condicion: "usado",
    descripcion: "Batería de evaluación de procesos lectores. Lo usé bastante en niños de primaria de la zona. Tiene marcas leves de uso pero todo funcional. Incluye 20 protocolos sin usar.",
    seller: { name: "Lucía Paredes", avatar: "LP", level: 4, verified: true, ventasPrev: 3 },
    ubicacion: "Vinchos, Ayacucho", departamento: "AYACUCHO", profesion: "PSICOLOGIA",
    envio: true, recojo: true, fotos: 2, vistas: 34, time: "hace 3d",
  },
  {
    id: 4, categoria: "transporte", titulo: "Honda XR 150L · 2024 · ideal SERUMS rural",
    precio: 8900, precioOriginal: 12500, condicion: "usado",
    descripcion: "Moto que me acompañó todo el SERUMS en Pozuzo. 18,000 km, mantenimientos al día, papeles en regla, llantas nuevas. Perfecta para selva alta. Cambio de turno me obliga a venderla.",
    seller: { name: "Sofía Ramírez", avatar: "SR", level: 3, verified: true, ventasPrev: 0 },
    ubicacion: "Pozuzo, Pasco", departamento: "PASCO", profesion: "MEDICINA",
    envio: false, recojo: true, fotos: 8, vistas: 156, time: "hace 1d",
  },
  {
    id: 5, categoria: "libros", titulo: "Atlas de Anatomía Netter · 7ma edición",
    precio: 180, precioOriginal: 320, condicion: "usado",
    descripcion: "Edición en español, tapa dura. Tiene subrayados a lápiz en algunas láminas (todas borrables). Sin páginas faltantes ni rotas. Compañero indispensable de SERUMS.",
    seller: { name: "Andrés Castillo", avatar: "AC", level: 5, verified: true, ventasPrev: 7 },
    ubicacion: "Sondorillo, Piura", departamento: "PIURA", profesion: "MEDICINA",
    envio: true, recojo: false, fotos: 3, vistas: 28, time: "hace 4d",
  },
  {
    id: 6, categoria: "equipo", titulo: "Otoscopio Welch Allyn 3.5V · maletín completo",
    precio: 720, precioOriginal: 1200, condicion: "casi_nuevo",
    descripcion: "Otoscopio profesional con cargador, 3 espéculos reusables y caja de espéculos descartables. Lo usé en un año de SERUMS pediátrico. Como nuevo.",
    seller: { name: "Patricia Núñez", avatar: "PN", level: 3, verified: true, ventasPrev: 2 },
    ubicacion: "Indiana, Loreto", departamento: "LORETO", profesion: "OBSTETRICIA",
    envio: true, recojo: true, fotos: 5, vistas: 62, time: "hace 6d",
  },
  {
    id: 7, categoria: "pruebas", titulo: "Test de Bender · sistema de puntuación Koppitz",
    precio: 95, precioOriginal: 180, condicion: "usado",
    descripcion: "Set completo de tarjetas + manual + 30 protocolos. Tarjetas en buen estado, sin dobleces ni manchas. Ideal para evaluación visomotora en niños.",
    seller: { name: "Lucía Paredes", avatar: "LP", level: 4, verified: true, ventasPrev: 3 },
    ubicacion: "Vinchos, Ayacucho", departamento: "AYACUCHO", profesion: "PSICOLOGIA",
    envio: true, recojo: true, fotos: 2, vistas: 19, time: "hace 1 sem",
  },
  {
    id: 8, categoria: "mobiliario", titulo: "Refrigeradora pequeña Miray · perfecta para vivienda SERUMS",
    precio: 380, precioOriginal: 650, condicion: "usado",
    descripcion: "Frigobar Miray 75L. Funciona perfecto, congelador chico pero útil. La dejaba en mi cuarto en la posta. Solo recojo en Pozuzo.",
    seller: { name: "Sofía Ramírez", avatar: "SR", level: 3, verified: true, ventasPrev: 0 },
    ubicacion: "Pozuzo, Pasco", departamento: "PASCO", profesion: "MEDICINA",
    envio: false, recojo: true, fotos: 3, vistas: 41, time: "hace 2d",
  },
  {
    id: 9, categoria: "software", titulo: "Curso online · Pediatría rural · acceso 1 año",
    precio: 150, precioOriginal: 380, condicion: "nuevo",
    descripcion: "Transferencia de licencia del curso de Pediatría Rural de SOPERU. Vence en agosto 2027. 40 horas de contenido, certificable. Lo compré pero ya no lo voy a usar.",
    seller: { name: "Diego Quispe", avatar: "DQ", level: 4, verified: true, ventasPrev: 1 },
    ubicacion: "Solo digital", departamento: "JUNIN", profesion: "MEDICINA",
    envio: true, recojo: false, fotos: 1, vistas: 23, time: "hace 3d",
  },
  {
    id: 10, categoria: "equipo", titulo: "Tensiómetro digital Omron HEM-7120",
    precio: 130, precioOriginal: 220, condicion: "casi_nuevo",
    descripcion: "Tensiómetro de brazo digital con manguito ajustable. Lo usaba para visitas domiciliarias. Pilas nuevas, funciona perfecto.",
    seller: { name: "Patricia Núñez", avatar: "PN", level: 3, verified: true, ventasPrev: 2 },
    ubicacion: "Indiana, Loreto", departamento: "LORETO", profesion: "OBSTETRICIA",
    envio: true, recojo: true, fotos: 2, vistas: 17, time: "hace 1 sem",
  },
  {
    id: 11, categoria: "libros", titulo: "Pack 8 libros · medicina interna y pediatría",
    precio: 240, precioOriginal: 600, condicion: "usado",
    descripcion: "Harrison de medicina interna (compendio), Nelson pediatría, Goodman farmacología, MIPSP de cirugía menor, AIEPI manuales y 3 libros de bolsillo. Algunos con anotaciones útiles.",
    seller: { name: "Andrés Castillo", avatar: "AC", level: 5, verified: true, ventasPrev: 7 },
    ubicacion: "Sondorillo, Piura", departamento: "PIURA", profesion: "MEDICINA",
    envio: true, recojo: false, fotos: 4, vistas: 51, time: "hace 5d",
  },
  {
    id: 12, categoria: "mobiliario", titulo: "Colchón 1.5 plazas + somier · solo recojo",
    precio: 220, precioOriginal: 480, condicion: "usado",
    descripcion: "Colchón Paraíso 1.5 plazas + somier de madera. Lo usé un año. Limpio, sin manchas, condición decente. Solo recojo en Sonomoro.",
    seller: { name: "Diego Quispe", avatar: "DQ", level: 4, verified: true, ventasPrev: 1 },
    ubicacion: "Sonomoro, Junín", departamento: "JUNIN", profesion: "MEDICINA",
    envio: false, recojo: true, fotos: 2, vistas: 14, time: "hace 4d",
  },
];

const CONDICION_LABELS = {
  nuevo: { label: "Nuevo · cerrado", color: "#2D5938", bg: "#E1F5EE" },
  casi_nuevo: { label: "Casi nuevo", color: "#0F6E56", bg: "#E1F5EE" },
  usado: { label: "Usado", color: "#854F0B", bg: "#FAEEDA" },
  muy_usado: { label: "Muy usado", color: "#993C1D", bg: "#FAECE7" },
};

// =============================================================
// Pedidos — compras colectivas
// =============================================================
const URGENCIA_LABELS = {
  urgente: { label: "Urgente", color: "#9A2A1F", bg: "#FAECE7" },
  pronto: { label: "Próximos meses", color: "#854F0B", bg: "#FAEEDA" },
  sin_prisa: { label: "Sin prisa", color: "#5F5E5A", bg: "#F1EFE8" },
};

const ESTADO_PEDIDO = {
  recolectando: {
    label: "Recolectando solicitudes",
    color: "#6B5F4F",
    bg: "#F1EFE8",
    accent: "#9C8F7C",
  },
  negociando: {
    label: "Negociando con proveedores",
    color: "#8E3F11",
    bg: "#FBF4E4",
    accent: "#B85820",
  },
  disponible: {
    label: "Disponible · precio grupal",
    color: "#1F3F26",
    bg: "#E1F5EE",
    accent: "#2D5938",
  },
};

const PEDIDOS = [
  {
    id: 1, categoria: "pruebas",
    titulo: "WISC-V nuevo · batería completa",
    descripcion: "Edición original sin uso, manuales de aplicación e interpretación, todos los protocolos sin abrir y carpeta de estímulos. Para evaluación clínica e investigación.",
    precioReferencia: 2900, precioMaximoColectivo: 1850,
    urgencia: "pronto", estado: "negociando",
    solicitantes: 47, umbral: 25,
    regiones: ["Ayacucho", "Cusco", "Junín", "Apurímac", "Huancavelica", "Puno"],
    descuentoEstimado: 36, profesion: "PSICOLOGIA",
    initiator: { name: "Lucía Paredes", avatar: "LP", level: 4 },
    time: "hace 1 sem",
  },
  {
    id: 2, categoria: "equipo",
    titulo: "Set quirúrgico menor Aspen · 12 piezas acero inoxidable",
    descripcion: "Para procedimientos menores en posta rural: pinzas, porta-agujas, tijeras, separadores. Calidad médica certificada con esterilización autoclave.",
    precioReferencia: 850, precioMaximoColectivo: 590,
    urgencia: "pronto", estado: "negociando",
    solicitantes: 32, umbral: 20,
    regiones: ["Loreto", "Madre de Dios", "Junín", "Pasco", "Ucayali"],
    descuentoEstimado: 30, profesion: "MEDICINA",
    initiator: { name: "Diego Quispe", avatar: "DQ", level: 4 },
    time: "hace 2 sem",
  },
  {
    id: 3, categoria: "software",
    titulo: "Curso intensivo PALS · soporte vital pediátrico AHA",
    descripcion: "Certificación oficial reconocida por American Heart Association. Modalidad híbrida con sesiones presenciales en 2 fines de semana.",
    precioReferencia: 1200, precioMaximoColectivo: 750,
    urgencia: "urgente", estado: "recolectando",
    solicitantes: 18, umbral: 25,
    regiones: ["Lima", "Arequipa", "La Libertad", "Lambayeque"],
    descuentoEstimado: 38, profesion: "MEDICINA",
    initiator: { name: "Patricia Núñez", avatar: "PN", level: 3 },
    time: "hace 3 días",
  },
  {
    id: 4, categoria: "equipo",
    titulo: "Lámpara fototerapia neonatal portátil · LED con batería",
    descripcion: "Para postas rurales sin sala neonatal. Equipo portátil LED con batería de respaldo de 4+ horas. Tratamiento de hiperbilirrubinemia en zona rural.",
    precioReferencia: 4200, precioMaximoColectivo: 2890,
    urgencia: "pronto", estado: "recolectando",
    solicitantes: 14, umbral: 20,
    regiones: ["Amazonas", "Loreto", "Madre de Dios", "Pasco"],
    descuentoEstimado: 31, profesion: "OBSTETRICIA",
    initiator: { name: "Andrés Ríos", avatar: "AR", level: 3 },
    time: "hace 5 días",
  },
  {
    id: 5, categoria: "libros",
    titulo: "Tarjetero plastificado · dosis pediátricas por peso",
    descripcion: "Tarjetas con tablas de dosificación pediátrica por peso, plastificadas, formato bolsillo. Imprescindibles en consulta sin internet ni señal.",
    precioReferencia: 95, precioMaximoColectivo: 35,
    urgencia: "sin_prisa", estado: "disponible",
    solicitantes: 73, umbral: 30,
    regiones: ["Alta demanda en todas las regiones"],
    descuentoEstimado: 63, profesion: "MEDICINA",
    initiator: { name: "Roberto Aliaga", avatar: "RA", level: 4 },
    time: "disponible desde hace 1 sem",
  },
  {
    id: 6, categoria: "libros",
    titulo: "Manual quechua chanka · vocabulario médico básico",
    descripcion: "Recurso bilingüe para consulta clínica básica: frases comunes, anatomía, síntomas, signos. Pensado para SERUMS en sierra sur.",
    precioReferencia: 180, precioMaximoColectivo: 89,
    urgencia: "pronto", estado: "recolectando",
    solicitantes: 8, umbral: 20,
    regiones: ["Ayacucho", "Apurímac", "Huancavelica"],
    descuentoEstimado: 50, profesion: "PSICOLOGIA",
    initiator: { name: "Lucía Paredes", avatar: "LP", level: 4 },
    time: "hace 1 sem",
  },
];

const RATING_DIMENSIONS = [
  { key: "vivienda", label: "Vivienda", icon: Home },
  { key: "equipo", label: "Equipamiento", icon: Briefcase },
  { key: "jefatura", label: "Jefatura", icon: Users },
  { key: "conectividad", label: "Conectividad", icon: Wifi },
  { key: "seguridad", label: "Seguridad", icon: Shield },
  { key: "carga", label: "Carga laboral", icon: TrendingUp },
];

// =============================================================
// Estilos — definidos como CSS real para evitar el bug de
// arbitrary values de Tailwind en el sandbox del artefacto
// =============================================================
const QN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --qn-bg: #F5EFE3;
    --qn-paper: #FFFFFF;
    --qn-soft: #FBF4E4;
    --qn-muted: #ECE2CC;
    --qn-warm: #FCF8EE;
    --qn-ink: #1A1410;
    --qn-text: #2A241B;
    --qn-text-muted: #6B5F4F;
    --qn-text-subtle: #9C8F7C;
    --qn-border: #DDD0B5;
    --qn-border-soft: #E8DDC4;
    --qn-terracotta: #B85820;
    --qn-terracotta-dark: #8E3F11;
    --qn-forest: #2D5938;
    --qn-forest-dark: #1F3F26;
    --qn-gold: #D9A02D;
    --qn-rust: #8B2418;
    --qn-brown: #6B3E1F;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background-color: var(--qn-bg);
    color: var(--qn-ink);
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background-color: var(--qn-gold); color: var(--qn-ink); }

  /* Backgrounds */
  .qn-bg { background-color: var(--qn-bg); }
  .qn-bg-paper { background-color: var(--qn-paper); }
  .qn-bg-soft { background-color: var(--qn-soft); }
  .qn-bg-muted { background-color: var(--qn-muted); }
  .qn-bg-warm { background-color: var(--qn-warm); }
  .qn-bg-ink { background-color: var(--qn-ink); }
  .qn-bg-terracotta { background-color: var(--qn-terracotta); }
  .qn-bg-forest { background-color: var(--qn-forest); }
  .qn-bg-gold { background-color: var(--qn-gold); }
  .qn-bg-rust { background-color: var(--qn-rust); }
  .qn-bg-brown { background-color: var(--qn-brown); }

  .qn-bg-paper-glass {
    background-color: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .qn-bg-cream-glass {
    background-color: rgba(245, 239, 227, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* Text */
  .qn-text-ink { color: var(--qn-ink); }
  .qn-text { color: var(--qn-text); }
  .qn-text-muted { color: var(--qn-text-muted); }
  .qn-text-subtle { color: var(--qn-text-subtle); }
  .qn-text-terracotta { color: var(--qn-terracotta); }
  .qn-text-forest { color: var(--qn-forest); }
  .qn-text-gold { color: var(--qn-gold); }
  .qn-text-rust { color: var(--qn-rust); }
  .qn-text-cream { color: var(--qn-bg); }
  .qn-text-paper { color: var(--qn-paper); }

  /* Borders */
  .qn-border { border-color: var(--qn-border); }
  .qn-border-soft { border-color: var(--qn-border-soft); }
  .qn-border-ink { border-color: var(--qn-ink); }
  .qn-border-terracotta { border-color: var(--qn-terracotta); }

  /* Typography */
  .qn-display { font-family: 'Fraunces', Georgia, serif; font-weight: 500; }
  .qn-display-italic { font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 500; }
  .qn-sans { font-family: 'Outfit', sans-serif; }
  .qn-tracking-wide { letter-spacing: 0.18em; }
  .qn-tracking-extra { letter-spacing: 0.22em; }

  /* Hovers */
  .qn-hover-soft { transition: background-color 200ms ease; }
  .qn-hover-soft:hover { background-color: var(--qn-soft); }
  .qn-hover-warm:hover { background-color: var(--qn-warm); }
  .qn-hover-muted:hover { background-color: var(--qn-muted); }

  /* Inputs */
  .qn-input {
    background-color: var(--qn-paper);
    border: 1px solid var(--qn-border);
    color: var(--qn-ink);
    transition: border-color 150ms ease;
  }
  .qn-input::placeholder { color: var(--qn-text-subtle); }
  .qn-input:focus { outline: none; border-color: var(--qn-terracotta); }

  /* Animations */
  @keyframes qn-slide-in-right {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes qn-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .qn-panel-anim { animation: qn-slide-in-right 320ms cubic-bezier(0.16, 1, 0.3, 1); }
  .qn-fade { animation: qn-fade-in 280ms ease; }

  /* Andean textile pattern overlay */
  .qn-tocapu {
    background-image:
      linear-gradient(135deg, rgba(184, 88, 32, 0.05) 25%, transparent 25%),
      linear-gradient(225deg, rgba(184, 88, 32, 0.05) 25%, transparent 25%),
      linear-gradient(45deg, rgba(45, 89, 56, 0.04) 25%, transparent 25%),
      linear-gradient(315deg, rgba(45, 89, 56, 0.04) 25%, transparent 25%);
    background-size: 28px 28px;
    background-position: 0 0, 14px 0, 14px -14px, 0 14px;
  }

  /* Difficulty pills */
  .qn-gd-1 { background-color: #ECFDF5; color: #064E3B; border: 1px solid #A7F3D0; }
  .qn-gd-2 { background-color: #F7FEE7; color: #365314; border: 1px solid #BEF264; }
  .qn-gd-3 { background-color: #FEF3C7; color: #78350F; border: 1px solid #FDE68A; }
  .qn-gd-4 { background-color: #FFEDD5; color: #7C2D12; border: 1px solid #FED7AA; }
  .qn-gd-5 { background-color: #FFE4E6; color: #881337; border: 1px solid #FECDD3; }

  /* Filter chips */
  .qn-chip {
    background-color: var(--qn-paper);
    border: 1px solid var(--qn-border);
    color: var(--qn-text-muted);
    transition: all 150ms ease;
    font-family: 'Outfit', sans-serif;
  }
  .qn-chip:hover { border-color: var(--qn-terracotta); color: var(--qn-ink); }
  .qn-chip-active {
    background-color: var(--qn-ink);
    border-color: var(--qn-ink);
    color: var(--qn-bg);
  }

  /* Subtle scrollbar */
  .qn-scroll::-webkit-scrollbar { width: 8px; }
  .qn-scroll::-webkit-scrollbar-track { background: transparent; }
  .qn-scroll::-webkit-scrollbar-thumb {
    background: var(--qn-border);
    border-radius: 4px;
  }
  .qn-scroll::-webkit-scrollbar-thumb:hover { background: var(--qn-text-subtle); }

  /* Decorative divider */
  .qn-divider-stones {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
  }
  .qn-divider-stones span {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--qn-text-subtle);
  }
  .qn-divider-stones span:nth-child(2) { width: 6px; height: 6px; background: var(--qn-terracotta); }

  /* Leaflet customizations — alinea el mapa con la identidad visual */
  .leaflet-container {
    background-color: #DEE7E5 !important;
    font-family: 'Outfit', sans-serif;
  }
  .leaflet-control-zoom {
    border: 1px solid var(--qn-border) !important;
    border-radius: 12px !important;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(26, 20, 16, 0.08) !important;
  }
  .leaflet-control-zoom a {
    background-color: rgba(255, 255, 255, 0.95) !important;
    color: var(--qn-ink) !important;
    border-color: var(--qn-border-soft) !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 400 !important;
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
  }
  .leaflet-control-zoom a:hover {
    background-color: var(--qn-soft) !important;
    color: var(--qn-terracotta) !important;
  }
  .leaflet-control-attribution {
    background-color: rgba(255, 255, 255, 0.85) !important;
    font-size: 10px !important;
    color: var(--qn-text-subtle) !important;
    padding: 2px 8px !important;
    border-top-left-radius: 6px;
  }
  .leaflet-control-attribution a {
    color: var(--qn-text-muted) !important;
  }
  .qn-marker {
    background: transparent !important;
    border: none !important;
  }
  .qn-popup .leaflet-popup-content-wrapper {
    background-color: var(--qn-paper);
    border: 1px solid var(--qn-border);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(26, 20, 16, 0.12);
  }
  .qn-popup .leaflet-popup-tip { background-color: var(--qn-paper); }
  .qn-popup .leaflet-popup-content {
    margin: 10px 14px;
    font-family: 'Outfit', sans-serif;
    color: var(--qn-ink);
  }
`;

// =============================================================
// Reusable bits
// =============================================================
const ChakanaIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 2 H15 V5 H18 V8 H21 V16 H18 V19 H15 V22 H9 V19 H6 V16 H3 V8 H6 V5 H9 Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
    <rect x="11" y="11" width="2" height="2" fill="var(--qn-bg)" />
  </svg>
);

const Star5 = ({ value, size = 14 }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        fill={i <= Math.round(value) ? "var(--qn-terracotta)" : "transparent"}
        color={i <= Math.round(value) ? "var(--qn-terracotta)" : "var(--qn-border)"}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

const institucionColor = (inst) => {
  if (inst === "MINSA") return { bg: "#B85820", border: "#8E3F11" };
  if (inst === "ESSALUD") return { bg: "#2D5938", border: "#1F3F26" };
  return { bg: "#6B3E1F", border: "#4A2A14" };
};

// =============================================================
// Components
// =============================================================
function Header({ view, setView }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const noLeidas = NOTIFICACIONES_DEMO.filter((n) => !n.leido).length;

  const tabs = [
    { id: "map",     label: "Mapa",        icon: MapPin },
    { id: "foros",   label: "Foros",       icon: Hash },
    { id: "feed",    label: "Comunidad",   icon: Users },
    { id: "market",  label: "Marketplace", icon: ShoppingBag },
    { id: "profile", label: "Mi perfil",   icon: User },
  ];

  const handleNav = (id) => {
    setView(id);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="qn-bg-cream-glass sticky top-0 z-30 border-b qn-border">
        <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <button
            onClick={() => handleNav("map")}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full qn-bg-ink flex items-center justify-center">
              <ChakanaIcon size={18} color="var(--qn-gold)" />
            </div>
            <div className="text-left">
              <div
                className="qn-display-italic qn-text-ink leading-none"
                style={{ fontSize: 20 }}
              >
                qhapaq ñan
              </div>
              <div className="qn-tracking-extra text-[9px] sm:text-[10px] uppercase qn-text-subtle qn-sans mt-0.5 sm:mt-1 hidden sm:block">
                SERUMS · El gran camino
              </div>
            </div>
          </button>

          {/* Desktop search — hidden on mobile */}
          <div className="flex-1 max-w-xl hidden lg:block">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 qn-text-subtle"
              />
              <input
                placeholder="Buscar plaza, distrito, establecimiento…"
                className="qn-input qn-sans w-full rounded-full h-10 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`flex items-center gap-2 h-10 px-3 lg:px-4 rounded-full text-sm qn-sans transition-all ${
                  view === tab.id ? "qn-bg-ink qn-text-cream" : "qn-text-muted qn-hover-muted"
                }`}
              >
                <tab.icon size={15} strokeWidth={1.8} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right cluster: notifications bell + avatar (always visible) + mobile hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full qn-hover-warm flex items-center justify-center qn-text-ink"
              aria-label="Notificaciones"
            >
              <Bell size={17} strokeWidth={1.8} />
              {noLeidas > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 qn-bg-terracotta qn-text-cream rounded-full text-[9px] flex items-center justify-center qn-sans"
                  style={{
                    minWidth: 16,
                    height: 16,
                    fontWeight: 700,
                    border: "2px solid var(--qn-bg)",
                    padding: "0 4px",
                  }}
                >
                  {noLeidas}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav("profile")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full qn-bg-forest qn-text-cream flex items-center justify-center text-xs"
              style={{ fontWeight: 500 }}
              aria-label="Mi perfil"
            >
              {CURRENT_USER.avatar}
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-9 h-9 rounded-full qn-hover-warm flex items-center justify-center qn-text-ink"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer nav */}
        {mobileOpen && (
          <div className="md:hidden border-t qn-border-soft qn-bg-paper-glass qn-fade">
            <div className="p-3">
              <div className="relative mb-3">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 qn-text-subtle"
                />
                <input
                  placeholder="Buscar plaza, distrito…"
                  className="qn-input qn-sans w-full rounded-full h-10 pl-10 pr-4 text-sm"
                />
              </div>
              <nav className="grid grid-cols-1 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleNav(tab.id)}
                    className={`flex items-center gap-3 h-11 px-4 rounded-xl text-sm qn-sans transition-all ${
                      view === tab.id
                        ? "qn-bg-ink qn-text-cream"
                        : "qn-text-ink qn-hover-warm"
                    }`}
                  >
                    <tab.icon size={16} strokeWidth={1.8} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 h-7 rounded-full ${active ? "qn-chip-active" : "qn-chip"}`}
    >
      {children}
    </button>
  );
}

function PlazaListItem({ plaza, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b qn-border-soft transition-colors ${
        selected ? "qn-bg-soft" : "qn-hover-warm"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="qn-display qn-text-ink leading-tight" style={{ fontSize: 15 }}>
          {plaza.establecimiento}
        </div>
        <span
          className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded qn-sans qn-gd-${plaza.gd.split("-")[1]}`}
        >
          {plaza.gd}
        </span>
      </div>
      <div className="text-xs qn-text-subtle qn-sans mb-2">
        {plaza.distrito} · {plaza.provincia} · {plaza.departamento}
      </div>
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] qn-sans qn-text-ink qn-bg-muted"
          style={{ fontWeight: 500, letterSpacing: "0.04em" }}
        >
          {plaza.profesion}
        </span>
        {plaza.reviews > 0 && (
          <span className="flex items-center gap-1 qn-text-muted qn-sans">
            <Star size={11} fill="var(--qn-terracotta)" color="var(--qn-terracotta)" />
            {plaza.rating} · {plaza.reviews} reseñas
          </span>
        )}
        {plaza.zaf && (
          <span className="text-[10px] px-1.5 py-0.5 rounded qn-bg-forest qn-text-cream qn-sans">
            ZAF
          </span>
        )}
        {plaza.ze && (
          <span className="text-[10px] px-1.5 py-0.5 rounded qn-bg-rust qn-text-cream qn-sans">
            ZE
          </span>
        )}
      </div>
    </button>
  );
}

function LeafletMap({ plazas, selectedId, onSelectPlaza }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(false);

  // Load Leaflet from CDN (allowed: cdnjs.cloudflare.com)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) {
      setReady(true);
      return;
    }

    const cssId = "qn-leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    const scriptId = "qn-leaflet-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => setReady(true);
      document.head.appendChild(script);
    } else {
      setReady(true);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(containerRef.current, {
      center: [-9.2, -75.0],
      zoom: 6,
      minZoom: 5,
      maxZoom: 17,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: false,
    });

    // CARTO Voyager — clean professional basemap with country borders, terrain shading, cities
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Restrict panning to Peru's bounding box (with a buffer)
    map.setMaxBounds([
      [-19.5, -82.5],
      [0.5, -67.5],
    ]);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [ready]);

  // Render markers
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    plazas.forEach((plaza) => {
      const isSelected = plaza.id === selectedId;
      const isHot = plaza.reviews > 15;
      const c = institucionColor(plaza.institucion);
      const size = isSelected ? 38 : isHot ? 30 : 24;
      const h = Math.round(size * 1.3);

      const html = `
        <div style="position:relative;width:${size}px;height:${h}px;filter:drop-shadow(0 ${isSelected ? 4 : 2}px ${isSelected ? 8 : 4}px rgba(0,0,0,${isSelected ? 0.3 : 0.2}));">
          <svg width="${size}" height="${h}" viewBox="0 0 24 30" style="display:block;">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z"
              fill="${c.bg}" stroke="${isSelected ? "#1A1410" : c.border}" stroke-width="${isSelected ? "2" : "1"}"/>
            <circle cx="12" cy="12" r="5" fill="#FCF8EE"/>
          </svg>
          ${
            isHot
              ? `<div style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#D9A02D;border:1px solid #1A1410;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#1A1410;line-height:1;">★</div>`
              : ""
          }
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: "qn-marker",
        iconSize: [size, h],
        iconAnchor: [size / 2, h],
      });

      const marker = L.marker([plaza.lat, plaza.lng], { icon, riseOnHover: true })
        .addTo(mapRef.current);
      marker.on("click", () => onSelectPlaza(plaza));
      markersRef.current.push(marker);
    });
  }, [plazas, selectedId, onSelectPlaza, ready]);

  // Fly to the selected plaza when it changes
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const plaza = plazas.find((p) => p.id === selectedId);
    if (plaza) {
      const targetZoom = Math.max(mapRef.current.getZoom(), 9);
      mapRef.current.flyTo([plaza.lat, plaza.lng], targetZoom, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [selectedId, plazas]);

  // "Reset to Peru" handler
  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([-9.2, -75.0], 6, { duration: 0.7 });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 1 }} />

      {!ready && (
        <div
          className="absolute inset-0 flex items-center justify-center qn-bg"
          style={{ zIndex: 5 }}
        >
          <div className="text-center">
            <div className="qn-display-italic qn-text-terracotta mb-1" style={{ fontSize: 18 }}>
              cargando el camino…
            </div>
            <div className="qn-divider-stones">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        className="absolute bottom-5 left-5 qn-bg-paper-glass border qn-border rounded-xl p-4 qn-sans"
        style={{ boxShadow: "0 8px 24px rgba(26, 20, 16, 0.08)", zIndex: 1001 }}
      >
        <div
          className="text-[10px] qn-tracking-wide uppercase qn-text-subtle mb-2.5"
          style={{ fontWeight: 500 }}
        >
          Institución
        </div>
        <div className="space-y-2">
          {[
            { name: "MINSA", color: "#B85820" },
            { name: "EsSalud", color: "#2D5938" },
            { name: "Otros", color: "#6B3E1F" },
          ].map((it) => (
            <div key={it.name} className="flex items-center gap-2.5 text-xs qn-text-ink">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: it.color }} />
              {it.name}
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t qn-border-soft flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full qn-bg-gold flex items-center justify-center"
            style={{ fontSize: 8, fontWeight: 700, color: "var(--qn-ink)" }}
          >
            ★
          </div>
          <span className="text-[10px] qn-text-muted">15+ reseñas</span>
        </div>
      </div>

      {/* Stats overlay + reset button */}
      <div
        className="absolute top-5 right-5 qn-bg-paper-glass border qn-border rounded-xl qn-sans overflow-hidden"
        style={{ boxShadow: "0 8px 24px rgba(26, 20, 16, 0.08)", zIndex: 1001 }}
      >
        <div className="px-4 py-3">
          <div
            className="text-[10px] qn-tracking-wide uppercase qn-text-subtle"
            style={{ fontWeight: 500 }}
          >
            SERUMS 2026-I
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="qn-display qn-text-ink" style={{ fontSize: 28 }}>
              {plazas.length}
            </span>
            <span className="text-xs qn-text-muted">plazas en vista</span>
          </div>
        </div>
        <button
          onClick={resetView}
          className="w-full px-4 py-2 text-xs qn-text-terracotta border-t qn-border-soft qn-hover-warm transition-colors flex items-center justify-center gap-1.5"
          style={{ fontWeight: 500 }}
        >
          <Compass size={12} strokeWidth={1.8} /> Centrar en Perú
        </button>
      </div>
    </div>
  );
}

function PlazaDetailPanel({ plaza, onClose }) {
  // Hooks must run unconditionally — Rules of Hooks
  const reviews = useMemo(
    () => (plaza ? (REVIEWS[plaza.id] || []) : []),
    [plaza]
  );
  const avgRatings = useMemo(() => {
    if (reviews.length === 0) return null;
    const sums = {};
    RATING_DIMENSIONS.forEach((d) => {
      sums[d.key] = reviews.reduce((s, r) => s + r.ratings[d.key], 0) / reviews.length;
    });
    return sums;
  }, [reviews]);

  if (!plaza) return null;

  return (
    <div
      className="qn-panel-anim qn-bg fixed inset-y-0 right-0 w-full overflow-y-auto qn-scroll border-l qn-border z-40"
      style={{ maxWidth: 580, boxShadow: "-20px 0 60px rgba(26, 20, 16, 0.15)" }}
    >
      {/* Hero */}
      <div className="qn-bg-ink qn-text-cream relative px-7 py-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: "rgba(245, 239, 227, 0.1)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245, 239, 227, 0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(245, 239, 227, 0.1)")}
        >
          <X size={16} />
        </button>
        <div
          className="text-[10px] qn-tracking-extra uppercase qn-text-gold qn-sans mb-3"
          style={{ fontWeight: 500 }}
        >
          {plaza.institucion} · Categoría {plaza.categoria}
        </div>
        <h2 className="qn-display leading-tight pr-8 mb-3" style={{ fontSize: 30, lineHeight: 1.1 }}>
          {plaza.establecimiento}
        </h2>
        <div className="text-sm qn-sans mb-5" style={{ color: "rgba(245, 239, 227, 0.7)" }}>
          {plaza.distrito} — {plaza.provincia} — {plaza.departamento}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-3 py-1 rounded-full qn-sans qn-gd-${plaza.gd.split("-")[1]}`}
          >
            {plaza.gd} · Dificultad
          </span>
          <span
            className="text-xs px-3 py-1 rounded-full qn-sans"
            style={{
              backgroundColor: "rgba(245, 239, 227, 0.1)",
              color: "var(--qn-bg)",
              border: "1px solid rgba(245, 239, 227, 0.2)",
            }}
          >
            {plaza.profesion}
          </span>
          {plaza.zaf && (
            <span className="text-xs px-3 py-1 rounded-full qn-bg-forest qn-text-cream qn-sans">
              Bono ZAF
            </span>
          )}
          {plaza.ze && (
            <span className="text-xs px-3 py-1 rounded-full qn-bg-rust qn-text-cream qn-sans">
              Bono ZE · VRAEM
            </span>
          )}
        </div>
      </div>

      <div className="px-7 py-7 space-y-7">
        {/* Official MINSA data */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="qn-text-forest" />
            <h3 className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans" style={{ fontWeight: 500 }}>
              Datos oficiales · MINSA
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 qn-bg-paper border qn-border rounded-2xl p-5 qn-sans">
            {[
              ["Código RENIPRESS", plaza.codigo],
              ["Plazas disponibles", plaza.plazas],
              ["Modalidad", "Remunerado"],
              ["Sede de adjudicación", "Sede Central"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle">{k}</div>
                <div className="text-sm qn-text-ink mt-1" style={{ fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div className="qn-divider-stones py-1">
          <span></span><span></span><span></span>
        </div>

        {/* Community ratings */}
        {reviews.length > 0 && avgRatings ? (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="qn-text-terracotta" />
                <h3 className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans" style={{ fontWeight: 500 }}>
                  Vivencias de la comunidad
                </h3>
              </div>
              <span className="text-[10px] qn-text-subtle qn-sans">
                {plaza.reviews} reseñas verificadas
              </span>
            </div>

            <div className="qn-bg-paper border qn-border rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="qn-display qn-text-ink" style={{ fontSize: 40 }}>
                      {plaza.rating}
                    </span>
                    <span className="text-sm qn-text-subtle qn-sans">/ 5.0</span>
                  </div>
                  <div className="mt-1">
                    <Star5 value={plaza.rating} size={14} />
                  </div>
                </div>
                <button className="text-xs qn-text-terracotta qn-sans hover:underline" style={{ fontWeight: 500 }}>
                  Ver todas →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {RATING_DIMENSIONS.map((d) => (
                  <div key={d.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <d.icon size={13} className="qn-text-subtle" strokeWidth={1.5} />
                      <span className="text-xs qn-text-ink qn-sans">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-16 h-1 rounded-full overflow-hidden qn-bg-muted"
                      >
                        <div
                          className="h-full qn-bg-terracotta"
                          style={{ width: `${(avgRatings[d.key] / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] qn-text-muted w-7 text-right qn-sans">
                        {avgRatings[d.key].toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent review */}
            {reviews.slice(0, 1).map((r, i) => (
              <article key={i} className="qn-bg-paper border qn-border rounded-2xl p-5">
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full qn-bg-forest qn-text-cream flex items-center justify-center text-xs"
                        style={{ fontWeight: 500 }}
                      >
                        {r.avatar}
                      </div>
                      {r.verified && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full qn-bg-terracotta flex items-center justify-center"
                          style={{ border: "2px solid white" }}
                        >
                          <CheckCircle2 size={10} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                        {r.author}
                      </div>
                      <div className="text-[11px] qn-text-subtle qn-sans">
                        {r.profession} · SERUMS {r.year} · Nivel {r.level}
                      </div>
                    </div>
                  </div>
                  <Star5 value={4.5} size={11} />
                </header>

                <p className="qn-display qn-text-ink mb-4 leading-relaxed" style={{ fontSize: 15, fontWeight: 400 }}>
                  "{r.text}"
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-[10px] qn-tracking-wide uppercase qn-text-forest mb-1.5 qn-sans" style={{ fontWeight: 600 }}>
                      A favor
                    </div>
                    <ul className="space-y-1">
                      {r.pros.map((p, i) => (
                        <li key={i} className="text-xs qn-text-ink flex items-start gap-1.5 qn-sans">
                          <span className="qn-text-forest mt-0.5" style={{ fontWeight: 700 }}>+</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] qn-tracking-wide uppercase qn-text-rust mb-1.5 qn-sans" style={{ fontWeight: 600 }}>
                      A considerar
                    </div>
                    <ul className="space-y-1">
                      {r.cons.map((c, i) => (
                        <li key={i} className="text-xs qn-text-ink flex items-start gap-1.5 qn-sans">
                          <span className="qn-text-rust mt-0.5" style={{ fontWeight: 700 }}>−</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <footer className="flex items-center justify-between pt-3 border-t qn-border-soft">
                  <div className="flex items-center gap-4 text-xs qn-text-subtle qn-sans">
                    <span className="flex items-center gap-1">
                      <Heart size={13} strokeWidth={1.5} /> {r.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} strokeWidth={1.5} /> {r.helpful} útiles
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon size={13} strokeWidth={1.5} /> {r.photos}
                    </span>
                  </div>
                  <span className="text-[11px] qn-text-subtle qn-sans">hace {r.daysAgo} días</span>
                </footer>
              </article>
            ))}
          </section>
        ) : (
          <section className="qn-bg-soft border qn-border rounded-2xl p-7 text-center">
            <div className="w-12 h-12 rounded-full qn-bg-muted mx-auto mb-3 flex items-center justify-center">
              <MessageCircle size={20} className="qn-text-subtle" strokeWidth={1.5} />
            </div>
            <h4 className="qn-display qn-text-ink text-base mb-1">Aún sin reseñas</h4>
            <p className="text-xs qn-text-muted mb-4 qn-sans">
              Sé la primera persona en compartir cómo es trabajar acá.
            </p>
            <button className="text-xs px-4 h-8 rounded-full qn-bg-ink qn-text-cream qn-sans">
              Escribir reseña
            </button>
          </section>
        )}

        {/* Validation note */}
        <div className="flex items-start gap-3 p-4 qn-bg-soft border qn-border rounded-2xl qn-sans">
          <Shield size={16} className="qn-text-forest mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="text-xs qn-text-muted leading-relaxed">
            Solo personas que demuestren haber trabajado en esta sede pueden dejar reseña.
            La verificación se hace con la resolución oficial de SERUMS.
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Comunidad — Feed + Boletines (síntesis IA monetizable)
// =============================================================
function SubTabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 h-12 px-1 text-sm qn-sans transition-colors ${
        active ? "qn-text-ink" : "qn-text-muted hover:qn-text-ink"
      }`}
      style={{ fontWeight: active ? 500 : 400 }}
    >
      {children}
      {active && (
        <span
          className="absolute bottom-0 left-0 right-0 h-[2px] qn-bg-terracotta"
          style={{ borderRadius: "2px 2px 0 0" }}
        />
      )}
    </button>
  );
}

function PostComposer() {
  return (
    <div className="qn-bg-paper border qn-border rounded-2xl p-5 mb-5">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full qn-bg-forest qn-text-cream flex items-center justify-center text-xs shrink-0"
          style={{ fontWeight: 500 }}
        >
          {CURRENT_USER.avatar}
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Comparte algo sobre tu experiencia SERUMS…"
            className="qn-display w-full text-sm qn-text-ink resize-none focus:outline-none bg-transparent"
            style={{ fontSize: 15 }}
            rows={2}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t qn-border-soft">
            <div className="flex items-center gap-1">
              {[Camera, ImageIcon, MapPin].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
                >
                  <Icon size={15} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <button className="text-xs px-4 h-9 rounded-full qn-bg-ink qn-text-cream flex items-center gap-1.5 qn-sans">
              <Send size={12} /> Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedFilters({ filters, setFilters, total, filtered }) {
  const uniq = (key) => Array.from(new Set(FEED_POSTS.map((p) => p[key]).filter(Boolean)));
  const profesiones = uniq("profesion");
  const provincias = uniq("provincia");
  const distritos = uniq("distrito");
  const establecimientos = uniq("establecimiento");

  const update = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? null : value }));

  const clearAll = () =>
    setFilters({
      profesion: null,
      modalidad: null,
      tipo: null,
      provincia: null,
      distrito: null,
      establecimiento: null,
    });

  const activeCount = Object.values(filters).filter(Boolean).length;

  const Section = ({ label, children }) => (
    <div>
      <div
        className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
        style={{ fontWeight: 500 }}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );

  return (
    <div className="space-y-5">
      {activeCount > 0 && (
        <div className="flex items-center justify-between qn-bg-soft border qn-border rounded-xl p-3">
          <span className="text-xs qn-text-ink qn-sans">
            <span style={{ fontWeight: 600 }}>{activeCount}</span> filtro
            {activeCount > 1 ? "s" : ""} activo{activeCount > 1 ? "s" : ""}
          </span>
          <button
            onClick={clearAll}
            className="text-xs qn-text-terracotta qn-sans hover:underline"
            style={{ fontWeight: 500 }}
          >
            Limpiar todo
          </button>
        </div>
      )}

      <Section label="Carrera">
        {profesiones.map((p) => (
          <FilterChip key={p} active={filters.profesion === p} onClick={() => update("profesion", p)}>
            {p}
          </FilterChip>
        ))}
      </Section>

      <Section label="Modalidad">
        <FilterChip
          active={filters.modalidad === "remunerado"}
          onClick={() => update("modalidad", "remunerado")}
        >
          Remunerado
        </FilterChip>
        <FilterChip
          active={filters.modalidad === "equivalente"}
          onClick={() => update("modalidad", "equivalente")}
        >
          Equivalente
        </FilterChip>
      </Section>

      <Section label="Tipo de publicación">
        <FilterChip active={filters.tipo === "reflection"} onClick={() => update("tipo", "reflection")}>
          Reflexión
        </FilterChip>
        <FilterChip active={filters.tipo === "question"} onClick={() => update("tipo", "question")}>
          Pregunta
        </FilterChip>
        <FilterChip active={filters.tipo === "guide"} onClick={() => update("tipo", "guide")}>
          Guía
        </FilterChip>
      </Section>

      <div className="pt-5 border-t qn-border-soft space-y-5">
        <div
          className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-sans"
          style={{ fontWeight: 600 }}
        >
          Ubicación geográfica
        </div>
        <Section label="Provincia">
          {provincias.map((p) => (
            <FilterChip key={p} active={filters.provincia === p} onClick={() => update("provincia", p)}>
              {p}
            </FilterChip>
          ))}
        </Section>
        <Section label="Distrito">
          {distritos.map((d) => (
            <FilterChip key={d} active={filters.distrito === d} onClick={() => update("distrito", d)}>
              {d}
            </FilterChip>
          ))}
        </Section>
        <Section label="Centro de salud">
          {establecimientos.map((e) => (
            <FilterChip
              key={e}
              active={filters.establecimiento === e}
              onClick={() => update("establecimiento", e)}
            >
              {e.length > 26 ? e.slice(0, 25) + "…" : e}
            </FilterChip>
          ))}
        </Section>
      </div>
    </div>
  );
}

function SceneIllustration({ scene }) {
  const common = {
    viewBox: "0 0 320 180",
    preserveAspectRatio: "xMidYMid slice",
    style: { display: "block", width: "100%", height: "100%" },
  };

  if (scene === "selva") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="selvaBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B6D11" />
            <stop offset="60%" stopColor="#173404" />
            <stop offset="100%" stopColor="#0A1A08" />
          </linearGradient>
          <linearGradient id="selvaRay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCDE5A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FCDE5A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill="url(#selvaBg)" />
        <polygon points="100,0 130,0 180,180 80,180" fill="url(#selvaRay)" />
        <polygon points="200,0 230,0 250,180 180,180" fill="url(#selvaRay)" opacity="0.6" />
        <circle cx="35" cy="40" r="38" fill="#0A1A08" />
        <circle cx="80" cy="50" r="30" fill="#0A1A08" />
        <circle cx="125" cy="35" r="34" fill="#0A1A08" />
        <circle cx="175" cy="48" r="32" fill="#0A1A08" />
        <circle cx="225" cy="32" r="36" fill="#0A1A08" />
        <circle cx="275" cy="50" r="30" fill="#0A1A08" />
        <ellipse cx="60" cy="165" rx="85" ry="28" fill="#0A1A08" opacity="0.9" />
        <ellipse cx="210" cy="172" rx="110" ry="22" fill="#0A1A08" />
      </svg>
    );
  }

  if (scene === "community") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="commSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFCC8A" />
            <stop offset="55%" stopColor="#E8763E" />
            <stop offset="100%" stopColor="#9A4F12" />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill="url(#commSky)" />
        <polygon points="0,180 0,90 80,55 160,75 240,50 320,80 320,180" fill="#5A3520" opacity="0.55" />
        <rect x="28" y="118" width="50" height="62" fill="#3A2410" />
        <polygon points="20,118 86,118 53,98" fill="#3A2410" />
        <rect x="100" y="108" width="60" height="72" fill="#1F1410" />
        <polygon points="92,108 168,108 130,82" fill="#1F1410" />
        <rect x="180" y="125" width="45" height="55" fill="#3A2410" />
        <polygon points="172,125 232,125 202,107" fill="#3A2410" />
        <rect x="245" y="115" width="55" height="65" fill="#1F1410" />
        <polygon points="237,115 305,115 271,95" fill="#1F1410" />
        <rect x="48" y="145" width="10" height="22" fill="#FCDE5A" opacity="0.9" />
        <rect x="120" y="135" width="10" height="22" fill="#FCDE5A" opacity="0.9" />
        <rect x="265" y="145" width="10" height="22" fill="#FCDE5A" opacity="0.9" />
        <ellipse cx="148" cy="172" rx="5.5" ry="11" fill="#1F1410" />
        <circle cx="148" cy="160" r="3.5" fill="#1F1410" />
        <ellipse cx="160" cy="173" rx="4" ry="8" fill="#1F1410" />
        <circle cx="160" cy="164" r="3" fill="#1F1410" />
        <ellipse cx="170" cy="173" rx="5" ry="10" fill="#1F1410" />
        <circle cx="170" cy="162" r="3.5" fill="#1F1410" />
      </svg>
    );
  }

  if (scene === "travel") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="travelSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9CC2E8" />
            <stop offset="55%" stopColor="#E0B879" />
            <stop offset="100%" stopColor="#B85820" />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill="url(#travelSky)" />
        <polygon points="0,180 0,100 70,70 140,80 220,55 320,85 320,180" fill="#6B3E1F" opacity="0.65" />
        <polygon points="0,180 0,120 50,92 120,108 200,88 280,112 320,102 320,180" fill="#3A2410" opacity="0.85" />
        <polygon points="0,180 320,180 320,125 0,140" fill="#5A3520" />
        <polygon points="155,95 178,95 232,180 92,180" fill="#1F1410" />
        <polygon points="164,108 168,108 168,124 162,124" fill="#FCDE5A" />
        <polygon points="160,138 170,138 170,156 156,156" fill="#FCDE5A" />
        <polygon points="152,168 174,168 174,178 144,178" fill="#FCDE5A" />
      </svg>
    );
  }

  if (scene === "clinic-night") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="clinicWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2A3A" />
            <stop offset="100%" stopColor="#0A1218" />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill="url(#clinicWall)" />
        <rect x="40" y="28" width="80" height="84" fill="#0A0F18" stroke="#3A4A5A" strokeWidth="1.5" />
        <circle cx="62" cy="48" r="0.9" fill="#FCDE5A" opacity="0.85" />
        <circle cx="84" cy="62" r="1.4" fill="#FFE886" opacity="0.95" />
        <circle cx="100" cy="42" r="1" fill="#FCDE5A" opacity="0.75" />
        <circle cx="55" cy="80" r="1.1" fill="#FCDE5A" opacity="0.8" />
        <circle cx="105" cy="92" r="0.8" fill="#FFE886" opacity="0.65" />
        <circle cx="74" cy="98" r="0.7" fill="#FCDE5A" opacity="0.6" />
        <line x1="80" y1="28" x2="80" y2="112" stroke="#3A4A5A" strokeWidth="1" />
        <line x1="40" y1="70" x2="120" y2="70" stroke="#3A4A5A" strokeWidth="1" />
        <rect x="180" y="68" width="42" height="82" fill="#2D3D4D" rx="3" />
        <circle cx="201" cy="88" r="8" fill="#5A6A7A" />
        <rect x="190" y="105" width="22" height="2.5" fill="#5A6A7A" />
        <rect x="190" y="113" width="22" height="2.5" fill="#5A6A7A" />
        <rect x="190" y="121" width="14" height="2.5" fill="#5A6A7A" />
        <rect x="240" y="52" width="52" height="100" fill="#1A2A3A" rx="3" />
        <rect x="246" y="58" width="40" height="22" fill="#0A1218" />
        <rect x="246" y="86" width="40" height="2" fill="#3A8FCF" opacity="0.8" />
        <rect x="246" y="94" width="40" height="2" fill="#3A8FCF" opacity="0.8" />
        <rect x="246" y="102" width="28" height="2" fill="#3A8FCF" opacity="0.8" />
        <circle cx="252" cy="120" r="3" fill="#5A6A7A" />
        <circle cx="262" cy="120" r="3" fill="#5A6A7A" />
        <rect x="0" y="150" width="320" height="30" fill="#050810" />
        <ellipse cx="160" cy="155" rx="160" ry="6" fill="#FCDE5A" opacity="0.06" />
      </svg>
    );
  }

  // Default: andes
  return (
    <svg {...common}>
      <defs>
        <linearGradient id="andesSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCDE5A" />
          <stop offset="40%" stopColor="#F2A623" />
          <stop offset="80%" stopColor="#9A4F12" />
          <stop offset="100%" stopColor="#5A3520" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#andesSky)" />
      <circle cx="240" cy="78" r="32" fill="#FCDE5A" opacity="0.3" />
      <circle cx="240" cy="78" r="20" fill="#FFE886" opacity="0.95" />
      <polygon points="0,180 0,110 40,80 90,95 140,65 200,90 250,75 320,95 320,180" fill="#7A4B2A" opacity="0.7" />
      <polygon points="0,180 0,135 60,100 130,125 190,90 260,115 320,100 320,180" fill="#4A2A14" opacity="0.85" />
      <polygon points="0,180 0,150 80,120 160,140 240,115 320,135 320,180" fill="#1F1410" />
    </svg>
  );
}

function PostMedia({ media }) {
  if (!media) return null;
  return (
    <div
      className="rounded-xl mb-3 overflow-hidden relative"
      style={{ aspectRatio: "16/9" }}
    >
      <SceneIllustration scene={media.scene} />
      {media.type === "video" && (
        <>
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1A1410">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div
            className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] qn-sans flex items-center gap-1"
            style={{
              backgroundColor: "rgba(26, 20, 16, 0.78)",
              color: "#FAF6F0",
              fontWeight: 500,
            }}
          >
            {media.duration}
          </div>
        </>
      )}
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="qn-bg-paper border qn-border rounded-2xl p-5 transition-colors">
      <header className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-full qn-bg-brown qn-text-cream flex items-center justify-center text-xs"
            style={{ fontWeight: 500 }}
          >
            {post.avatar}
          </div>
          {post.verified && (
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full qn-bg-terracotta flex items-center justify-center"
              style={{ border: "2px solid white" }}
            >
              <CheckCircle2 size={9} color="white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
              {post.author}
            </span>
            <span
              className="text-[10px] qn-tracking-wide uppercase qn-text-terracotta qn-bg-soft px-1.5 py-0.5 rounded qn-sans"
              style={{ fontWeight: 600 }}
            >
              Nivel {post.level}
            </span>
            <span
              className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-bg-muted px-1.5 py-0.5 rounded qn-sans"
              style={{ fontWeight: 500 }}
            >
              {post.profesion}
            </span>
            {post.modalidad === "equivalente" && (
              <span
                className="text-[10px] qn-tracking-wide uppercase px-1.5 py-0.5 rounded qn-sans"
                style={{ fontWeight: 500, backgroundColor: "#FEF3C7", color: "#78350F" }}
              >
                Equivalente
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] qn-text-subtle mt-0.5 qn-sans">
            <MapPin size={10} />
            {post.location}
            <span style={{ opacity: 0.5 }}>·</span>
            {post.time}
          </div>
        </div>
        {post.type === "question" && (
          <span className="text-[10px] qn-tracking-wide uppercase px-2 py-1 rounded-full qn-bg-forest qn-text-cream qn-sans shrink-0" style={{ fontWeight: 600 }}>
            Pregunta
          </span>
        )}
        {post.type === "guide" && (
          <span className="text-[10px] qn-tracking-wide uppercase px-2 py-1 rounded-full qn-bg-gold qn-text-ink qn-sans shrink-0" style={{ fontWeight: 600 }}>
            Guía
          </span>
        )}
      </header>

      <p
        className={`qn-display qn-text-ink mb-3 leading-relaxed ${
          !post.media ? "py-2" : ""
        }`}
        style={{ fontSize: !post.media ? 17 : 15, fontWeight: 400 }}
      >
        {post.text}
      </p>

      <PostMedia media={post.media} />

      <footer className="flex items-center gap-6 pt-3 border-t qn-border-soft text-xs qn-text-subtle qn-sans">
        <button className="flex items-center gap-1.5 transition-colors">
          <Heart size={14} strokeWidth={1.5} /> {post.likes}
        </button>
        <button className="flex items-center gap-1.5 transition-colors">
          <MessageCircle size={14} strokeWidth={1.5} /> {post.comments} comentarios
        </button>
      </footer>
    </article>
  );
}

function EmptyFeedState({ onClear }) {
  return (
    <div className="qn-bg-soft border qn-border rounded-2xl p-10 text-center">
      <div className="w-12 h-12 rounded-full qn-bg-muted mx-auto mb-3 flex items-center justify-center">
        <Search size={20} className="qn-text-subtle" strokeWidth={1.5} />
      </div>
      <h4 className="qn-display qn-text-ink mb-1" style={{ fontSize: 16 }}>
        Sin resultados con esos filtros
      </h4>
      <p className="text-xs qn-text-muted mb-4 qn-sans">
        Prueba ampliar los criterios o limpiar los filtros activos.
      </p>
      <button
        onClick={onClear}
        className="text-xs px-4 h-9 rounded-full qn-bg-ink qn-text-cream qn-sans"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

function FeedView() {
  const [filters, setFilters] = useState({
    profesion: null, modalidad: null, tipo: null,
    provincia: null, distrito: null, establecimiento: null,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = useMemo(() => {
    return FEED_POSTS.filter((p) => {
      if (filters.profesion && p.profesion !== filters.profesion) return false;
      if (filters.modalidad && p.modalidad !== filters.modalidad) return false;
      if (filters.tipo && p.type !== filters.tipo) return false;
      if (filters.provincia && p.provincia !== filters.provincia) return false;
      if (filters.distrito && p.distrito !== filters.distrito) return false;
      if (filters.establecimiento && p.establecimiento !== filters.establecimiento) return false;
      return true;
    });
  }, [filters]);

  const clearAll = () =>
    setFilters({
      profesion: null, modalidad: null, tipo: null,
      provincia: null, distrito: null, establecimiento: null,
    });

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="flex h-full">
      <aside
        className="border-r qn-border qn-bg flex flex-col shrink-0 overflow-hidden"
        style={{
          width: sidebarOpen ? 320 : 56,
          transition: "width 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {sidebarOpen ? (
          <>
            <div className="px-5 pt-5 pb-3 flex items-start justify-between shrink-0">
              <div>
                <h2 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 22 }}>
                  Filtros
                </h2>
                <div className="text-[11px] qn-text-subtle qn-sans mt-0.5">
                  {filtered.length} / {FEED_POSTS.length} publicaciones
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
                title="Colapsar filtros"
              >
                <ChevronLeft size={16} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 px-5 pb-6 overflow-y-auto qn-scroll">
              <FeedFilters
                filters={filters}
                setFilters={setFilters}
                total={FEED_POSTS.length}
                filtered={filtered.length}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-5 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative w-10 h-10 rounded-xl qn-bg-paper border qn-border flex items-center justify-center qn-text-ink transition-colors"
              style={{ transition: "border-color 150ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--qn-terracotta)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--qn-border)")}
              title="Abrir filtros"
            >
              <Filter size={15} strokeWidth={1.8} />
              {activeCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 qn-bg-terracotta qn-text-cream rounded-full text-[10px] flex items-center justify-center qn-sans"
                  style={{
                    width: 18,
                    height: 18,
                    fontWeight: 700,
                    border: "2px solid var(--qn-bg)",
                  }}
                >
                  {activeCount}
                </span>
              )}
            </button>
            <div
              className="text-[10px] qn-text-subtle qn-tracking-wide uppercase qn-sans"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontWeight: 500,
                letterSpacing: "0.2em",
              }}
            >
              Filtros
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto qn-scroll">
        <div className="max-w-[680px] mx-auto px-6 py-6">
          <PostComposer />
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <EmptyFeedState onClear={clearAll} />
            ) : (
              filtered.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Boletines (síntesis IA monetizable)
// -------------------------------------------------------------
function BoletinCover({ cover, hero, children }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cover.from} 0%, ${cover.via || cover.from} 50%, ${cover.to} 100%)`,
        height: hero ? 200 : 140,
      }}
    >
      <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.18 }} />
      {/* Decorative chakana corner */}
      <svg
        className="absolute"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        style={{ top: -12, right: -12, opacity: 0.18 }}
      >
        <path
          d="M9 2 H15 V5 H18 V8 H21 V16 H18 V19 H15 V22 H9 V19 H6 V16 H3 V8 H6 V5 H9 Z"
          fill="#D9A02D"
        />
      </svg>
      <div className="relative h-full flex flex-col justify-end p-5">{children}</div>
    </div>
  );
}

function BoletinCard({ boletin, onClick, hero = false }) {
  return (
    <button
      onClick={onClick}
      className="group qn-bg-paper border qn-border rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg w-full"
      style={{
        boxShadow: "0 1px 3px rgba(26, 20, 16, 0.04)",
      }}
    >
      <BoletinCover cover={boletin.cover} hero={hero}>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] qn-tracking-extra uppercase qn-sans"
            style={{ color: "#D9A02D", fontWeight: 600 }}
          >
            {boletin.tipo}
          </span>
          {boletin.destacado && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded qn-sans"
              style={{
                background: "rgba(217, 160, 45, 0.95)",
                color: "#1A1410",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              DESTACADO
            </span>
          )}
        </div>
        <div
          className="qn-display leading-tight"
          style={{
            fontSize: hero ? 26 : 19,
            color: "#FAF6F0",
            fontWeight: 500,
          }}
        >
          {boletin.titulo}
        </div>
      </BoletinCover>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[11px] qn-text-subtle qn-sans mb-3">
          <Calendar size={11} strokeWidth={1.8} />
          {boletin.fechas}
        </div>

        <p
          className="qn-text leading-relaxed mb-3"
          style={{ fontSize: 13 }}
        >
          {boletin.subtitulo}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {boletin.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] qn-bg-muted qn-text-ink px-2 py-0.5 rounded-full qn-sans"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b qn-border-soft">
          {[
            { v: boletin.postsAnalizados, l: "publicaciones" },
            { v: boletin.paginas, l: "páginas" },
            { v: boletin.actividadesIncluidas, l: "actividades" },
          ].map((s, i) => (
            <div key={i}>
              <div className="qn-display qn-text-ink" style={{ fontSize: 18 }}>
                {s.v}
              </div>
              <div className="text-[10px] qn-text-subtle qn-sans">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {boletin.free ? (
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded qn-bg-forest qn-text-cream qn-sans"
                  style={{ fontWeight: 500 }}
                >
                  Gratis
                </span>
                <span className="text-[11px] qn-text-muted qn-sans">para la comunidad</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] qn-text-subtle qn-sans">S/</span>
                  <span className="qn-display qn-text-ink" style={{ fontSize: 22 }}>
                    {boletin.precio.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] qn-text-subtle qn-sans">acceso digital + actividades</div>
              </div>
            )}
          </div>
          <div className="qn-text-terracotta flex items-center gap-1 text-xs qn-sans transition-transform group-hover:translate-x-0.5" style={{ fontWeight: 500 }}>
            Ver boletín <ArrowRight size={13} strokeWidth={2} />
          </div>
        </div>
      </div>
    </button>
  );
}

function BoletinDetailPanel({ boletin, onClose }) {
  if (!boletin) return null;
  return (
    <div
      className="qn-panel-anim qn-bg fixed inset-y-0 right-0 w-full overflow-y-auto qn-scroll border-l qn-border z-40"
      style={{ maxWidth: 580, boxShadow: "-20px 0 60px rgba(26, 20, 16, 0.15)" }}
    >
      <BoletinCover cover={boletin.cover} hero>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: "rgba(245, 239, 227, 0.15)", color: "#FAF6F0" }}
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] qn-tracking-extra uppercase qn-sans"
            style={{ color: "#D9A02D", fontWeight: 600 }}
          >
            {boletin.tipo}
          </span>
        </div>
        <div className="qn-display leading-tight" style={{ fontSize: 30, color: "#FAF6F0", fontWeight: 500 }}>
          {boletin.titulo}
        </div>
        <div
          className="qn-sans mt-1.5"
          style={{ fontSize: 13, color: "rgba(250, 246, 240, 0.75)" }}
        >
          {boletin.subtitulo}
        </div>
      </BoletinCover>

      <div className="px-7 py-6 space-y-6">
        <div className="flex items-center gap-2 text-xs qn-text-muted qn-sans">
          <Calendar size={13} strokeWidth={1.8} />
          {boletin.fechas}
          <span style={{ opacity: 0.5 }}>·</span>
          <Sparkles size={13} className="qn-text-terracotta" strokeWidth={1.8} />
          {boletin.autor || "Síntesis IA · Curado por equipo Qhapaq Ñan"}
        </div>

        <div>
          <div className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-2" style={{ fontWeight: 500 }}>
            En este boletín
          </div>
          <p className="qn-display qn-text-ink leading-relaxed" style={{ fontSize: 15 }}>
            {boletin.resumen}
          </p>
        </div>

        {/* Stats prominent */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: boletin.postsAnalizados, l: "publicaciones analizadas", icon: MessageCircle },
            { v: boletin.paginas, l: "páginas de síntesis", icon: FileText },
            { v: boletin.actividadesIncluidas, l: "actividades académicas", icon: Zap },
          ].map((s, i) => (
            <div key={i} className="qn-bg-paper border qn-border rounded-xl p-4 text-center">
              <s.icon size={16} className="qn-text-terracotta mx-auto mb-2" strokeWidth={1.5} />
              <div className="qn-display qn-text-ink mb-0.5" style={{ fontSize: 24 }}>
                {s.v}
              </div>
              <div className="text-[10px] qn-text-subtle qn-sans leading-tight">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {boletin.secciones && (
          <div>
            <div className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-3" style={{ fontWeight: 500 }}>
              Contenido
            </div>
            <ul className="space-y-2.5">
              {boletin.secciones.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 qn-bg-paper border qn-border rounded-xl"
                >
                  <span
                    className="qn-display-italic qn-text-terracotta shrink-0 w-7"
                    style={{ fontSize: 18 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="qn-text qn-sans" style={{ fontSize: 13 }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Topics */}
        <div>
          <div className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-2" style={{ fontWeight: 500 }}>
            Temas tratados
          </div>
          <div className="flex flex-wrap gap-1.5">
            {boletin.topics.map((t) => (
              <span
                key={t}
                className="text-xs qn-bg-soft qn-text-terracotta px-2.5 py-1 rounded-full qn-sans border"
                style={{ borderColor: "rgba(184, 88, 32, 0.25)", fontWeight: 500 }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Source preview */}
        <div className="qn-bg-soft border qn-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="qn-text-forest" strokeWidth={1.8} />
            <div className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans" style={{ fontWeight: 500 }}>
              Cada síntesis enlaza a las fuentes
            </div>
          </div>
          <p className="text-xs qn-text-muted leading-relaxed qn-sans">
            Cada cita, dato y patrón identificado por la IA está enlazado directamente a la
            publicación original de la comunidad. La síntesis es el atajo, no el reemplazo —
            siempre puedes ir al testimonio completo.
          </p>
        </div>

        {/* Purchase CTA */}
        <div className="qn-bg-ink qn-text-cream rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.15 }} />
          <div className="relative">
            {boletin.free ? (
              <>
                <div className="text-[10px] qn-tracking-extra uppercase qn-text-gold mb-2 qn-sans" style={{ fontWeight: 600 }}>
                  Acceso libre
                </div>
                <h4 className="qn-display-italic mb-3" style={{ fontSize: 22 }}>
                  Gratis para toda la comunidad
                </h4>
                <button className="qn-bg-gold qn-text-ink rounded-full px-5 h-11 qn-sans flex items-center gap-2" style={{ fontWeight: 500 }}>
                  <Download size={14} strokeWidth={2} /> Descargar boletín
                </button>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="text-[10px] qn-tracking-extra uppercase qn-text-gold qn-sans" style={{ fontWeight: 600 }}>
                      Acceso digital
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm qn-text-cream qn-sans" style={{ opacity: 0.7 }}>S/</span>
                      <span className="qn-display qn-text-cream" style={{ fontSize: 38 }}>
                        {boletin.precio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Lock size={20} className="qn-text-gold" strokeWidth={1.5} />
                </div>
                <ul className="space-y-1.5 mb-5 text-xs qn-sans" style={{ color: "rgba(245, 239, 227, 0.8)" }}>
                  {[
                    "PDF descargable + lectura web",
                    "Enlaces directos a publicaciones fuente",
                    `Acceso a ${boletin.actividadesIncluidas} actividades académicas exclusivas`,
                    "Recursos complementarios descargables",
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="qn-text-gold shrink-0 mt-0.5" strokeWidth={2} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button className="qn-bg-gold qn-text-ink rounded-full px-5 h-11 qn-sans w-full flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
                  Adquirir boletín <ArrowRight size={14} strokeWidth={2} />
                </button>
                <div className="text-[10px] qn-text-cream text-center mt-3 qn-sans" style={{ opacity: 0.5 }}>
                  Pago único · Acceso permanente · Sin suscripción
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoletinesView() {
  const [selected, setSelected] = useState(null);
  const destacado = BOLETINES.find((b) => b.destacado);
  const fundacional = BOLETINES.find((b) => b.free);
  const others = BOLETINES.filter((b) => !b.destacado && !b.free);

  return (
    <div className="h-full overflow-y-auto qn-scroll">
      <div className="max-w-[1080px] mx-auto px-6 py-6">
        {/* Hero introducción */}
        <div className="qn-bg-paper border qn-border rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.4 }} />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl qn-bg-ink flex items-center justify-center shrink-0">
              <Sparkles size={20} className="qn-text-gold" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] qn-tracking-extra uppercase qn-text-terracotta qn-sans mb-1.5" style={{ fontWeight: 600 }}>
                Síntesis IA · Boletines
              </div>
              <h2 className="qn-display qn-text-ink mb-2 leading-tight" style={{ fontSize: 22 }}>
                La memoria colectiva del SERUMS,{" "}
                <span className="qn-display-italic qn-text-terracotta">destilada</span>.
              </h2>
              <p className="qn-text qn-sans leading-relaxed" style={{ fontSize: 13 }}>
                Cada semana nuestro equipo combina IA y curación humana para sintetizar lo más relevante
                que la comunidad publica — patrones, advertencias, hallazgos y aprendizajes — en boletines
                navegables con enlaces a las fuentes y acceso a actividades académicas asociadas.
              </p>
            </div>
          </div>
        </div>

        {destacado && (
          <div className="mb-6">
            <div className="text-[10px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-3 px-1" style={{ fontWeight: 600 }}>
              Edición destacada
            </div>
            <BoletinCard boletin={destacado} hero onClick={() => setSelected(destacado)} />
          </div>
        )}

        {fundacional && (
          <div className="mb-6">
            <div className="text-[10px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-3 px-1" style={{ fontWeight: 600 }}>
              Acceso libre · Para empezar
            </div>
            <BoletinCard boletin={fundacional} onClick={() => setSelected(fundacional)} />
          </div>
        )}

        {others.length > 0 && (
          <div>
            <div className="text-[10px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-3 px-1" style={{ fontWeight: 600 }}>
              Ediciones recientes
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {others.map((b) => (
                <BoletinCard key={b.id} boletin={b} onClick={() => setSelected(b)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && <BoletinDetailPanel boletin={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CommunityView() {
  const [subView, setSubView] = useState("feed");

  return (
    <div className="qn-fade flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="border-b qn-border qn-bg shrink-0">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="flex gap-7">
            <SubTabButton active={subView === "feed"} onClick={() => setSubView("feed")}>
              <MessageCircle size={14} strokeWidth={1.8} /> Feed
            </SubTabButton>
            <SubTabButton active={subView === "boletines"} onClick={() => setSubView("boletines")}>
              <FileText size={14} strokeWidth={1.8} />
              Boletines
              <span
                className="qn-bg-gold qn-text-ink text-[9px] px-1.5 py-0.5 rounded qn-sans"
                style={{ fontWeight: 700, letterSpacing: "0.05em" }}
              >
                IA
              </span>
            </SubTabButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {subView === "feed" && <FeedView />}
        {subView === "boletines" && <BoletinesView />}
      </div>
    </div>
  );
}

// =============================================================
// Foros — comunidades persistentes por centro (estilo Reddit)
// =============================================================
function ForoSidebarItem({ foro, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-colors ${
        active ? "qn-bg-soft" : "qn-hover-warm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: foro.color }}
        >
          <Hash size={15} color="#FAF6F0" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div
              className="qn-display qn-text-ink truncate"
              style={{ fontSize: 13.5 }}
            >
              {foro.centro}
            </div>
            {foro.suscrito && (
              <CheckCircle2 size={11} className="qn-text-terracotta shrink-0" strokeWidth={2.5} />
            )}
          </div>
          <div className="text-[10px] qn-text-subtle qn-sans mt-0.5 truncate">
            {foro.distrito} · {foro.miembros} miembros
          </div>
          {foro.activosHoy > 0 && (
            <div className="text-[10px] qn-text-forest qn-sans mt-0.5 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ backgroundColor: "var(--qn-forest)" }}
              />
              {foro.activosHoy} activos hoy
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ForoPostCard({ post }) {
  const cat = FORO_CATEGORIES.find((c) => c.id === post.categoria);
  const Icon = cat ? cat.icon : Hash;
  return (
    <article className="qn-bg-paper border qn-border rounded-xl p-4 transition-all hover:border-[#C2691E] cursor-pointer flex gap-4">
      {/* Upvote column */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <button
          className="w-8 h-8 rounded-md qn-hover-warm flex items-center justify-center qn-text-subtle"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUp size={16} strokeWidth={2} />
        </button>
        <span
          className="qn-display qn-text-ink"
          style={{ fontSize: 14 }}
        >
          {post.upvotes}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          {post.pinned && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded qn-bg-gold qn-text-ink qn-sans flex items-center gap-1"
              style={{ fontWeight: 600 }}
            >
              <Pin size={9} strokeWidth={2.5} /> FIJADO
            </span>
          )}
          <span
            className="text-[10px] qn-tracking-wide uppercase px-1.5 py-0.5 rounded qn-sans flex items-center gap-1"
            style={{
              backgroundColor: cat ? `${cat.color}15` : "var(--qn-muted)",
              color: cat ? cat.color : "var(--qn-text-muted)",
              fontWeight: 600,
            }}
          >
            <Icon size={10} strokeWidth={2} />
            {cat ? cat.label : post.categoria}
          </span>
          <span className="text-[11px] qn-text-subtle qn-sans">
            {post.autor} · Nivel {post.level} · {post.time}
          </span>
        </div>

        <h3
          className="qn-display qn-text-ink leading-snug mb-1.5"
          style={{ fontSize: 16, fontWeight: 500 }}
        >
          {post.titulo}
        </h3>

        <p
          className="qn-text qn-sans leading-relaxed mb-3"
          style={{ fontSize: 13, color: "var(--qn-text-muted)" }}
        >
          {post.body.length > 180 ? post.body.slice(0, 180) + "…" : post.body}
        </p>

        <footer className="flex items-center gap-4 text-xs qn-text-subtle qn-sans">
          <button className="flex items-center gap-1.5 hover:qn-text-ink transition-colors">
            <MessageSquare size={13} strokeWidth={1.8} /> {post.comments} comentarios
          </button>
          <button className="flex items-center gap-1.5 hover:qn-text-ink transition-colors">
            Compartir
          </button>
        </footer>
      </div>
    </article>
  );
}

function ForoRulesPanel({ foro, open, onClose }) {
  if (!open) return null;
  return (
    <div className="qn-bg-soft border qn-border rounded-2xl p-5 qn-fade">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="qn-text-forest" strokeWidth={1.8} />
          <h4
            className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans"
            style={{ fontWeight: 600 }}
          >
            Reglas de convivencia
          </h4>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
        >
          <X size={14} />
        </button>
      </div>
      <ol className="space-y-2.5">
        {foro.reglas.map((regla, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="qn-display-italic qn-text-terracotta shrink-0 w-6"
              style={{ fontSize: 16 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="qn-text qn-sans" style={{ fontSize: 13 }}>
              {regla}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-4 border-t qn-border-soft">
        <div
          className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
          style={{ fontWeight: 600 }}
        >
          Moderación
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {foro.moderadores.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-2 qn-bg-paper border qn-border rounded-full pl-1 pr-3 py-0.5"
            >
              <div
                className="w-6 h-6 rounded-full qn-bg-brown qn-text-cream flex items-center justify-center text-[10px]"
                style={{ fontWeight: 500 }}
              >
                {m.avatar}
              </div>
              <span className="text-xs qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                {m.name}
              </span>
              <Crown size={10} className="qn-text-gold" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ForoDetail({ foro }) {
  const [activeCat, setActiveCat] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const posts = useMemo(() => {
    let list = FORO_POSTS.filter((p) => p.foroId === foro.id);
    if (activeCat) list = list.filter((p) => p.categoria === activeCat);
    return list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [foro.id, activeCat]);

  return (
    <div className="h-full overflow-y-auto qn-scroll">
      <div className="max-w-[820px] mx-auto px-6 py-6 space-y-5">
        {/* Forum header */}
        <header className="qn-bg-paper border qn-border rounded-2xl overflow-hidden">
          <div
            className="h-24 relative"
            style={{
              background: `linear-gradient(135deg, ${foro.color} 0%, #1A1410 100%)`,
            }}
          >
            <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.18 }} />
          </div>
          <div className="p-5" style={{ marginTop: -32 }}>
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: foro.color,
                  border: "4px solid var(--qn-bg)",
                }}
              >
                <Hash size={26} color="#FAF6F0" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 pt-7">
                <h1
                  className="qn-display qn-text-ink leading-tight"
                  style={{ fontSize: 24 }}
                >
                  {foro.centro}
                </h1>
                <div
                  className="text-xs qn-text-muted qn-sans mt-1"
                  style={{ fontWeight: 400 }}
                >
                  {foro.distrito} · {foro.provincia} · {foro.departamento}
                </div>
              </div>
              <button
                className={`text-xs px-4 h-9 rounded-full qn-sans shrink-0 ${
                  foro.suscrito
                    ? "qn-bg-paper border qn-border qn-text-ink"
                    : "qn-bg-ink qn-text-cream"
                }`}
                style={{ fontWeight: 500 }}
              >
                {foro.suscrito ? "Suscrita" : "Suscribirse"}
              </button>
            </div>

            <p
              className="qn-text qn-sans leading-relaxed mb-4"
              style={{ fontSize: 13 }}
            >
              {foro.descripcion}
            </p>

            <div className="flex items-center gap-5 pt-4 border-t qn-border-soft text-xs qn-text-muted qn-sans">
              <span className="flex items-center gap-1.5">
                <Users size={12} strokeWidth={1.8} />
                <span className="qn-text-ink" style={{ fontWeight: 500 }}>
                  {foro.miembros}
                </span>{" "}
                miembros
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--qn-forest)" }}
                />
                <span className="qn-text-ink" style={{ fontWeight: 500 }}>
                  {foro.activosHoy}
                </span>{" "}
                activos hoy
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={12} strokeWidth={1.8} />
                <span className="qn-text-ink" style={{ fontWeight: 500 }}>
                  {foro.posts}
                </span>{" "}
                publicaciones
              </span>
              <button
                onClick={() => setShowRules((s) => !s)}
                className="ml-auto flex items-center gap-1.5 qn-text-terracotta hover:underline"
                style={{ fontWeight: 500 }}
              >
                <Shield size={12} strokeWidth={1.8} />
                {showRules ? "Ocultar reglas" : "Ver reglas y moderación"}
              </button>
            </div>
          </div>
        </header>

        <ForoRulesPanel foro={foro} open={showRules} onClose={() => setShowRules(false)} />

        {/* Composer */}
        <div className="qn-bg-paper border qn-border rounded-2xl p-4">
          <button
            className="w-full text-left text-sm qn-text-subtle qn-sans flex items-center gap-3 px-3 py-2 rounded-xl border qn-border-soft qn-hover-warm transition-colors"
          >
            <Plus size={14} strokeWidth={2} className="qn-text-terracotta" />
            Iniciar una publicación en este foro…
          </button>
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip active={activeCat === null} onClick={() => setActiveCat(null)}>
            Todas
          </FilterChip>
          {FORO_CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                className="text-xs px-3 h-7 rounded-full qn-sans transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: activeCat === c.id ? c.color : "var(--qn-paper)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: activeCat === c.id ? c.color : "var(--qn-border)",
                  color: activeCat === c.id ? "#FAF6F0" : "var(--qn-text-muted)",
                  fontWeight: activeCat === c.id ? 500 : 400,
                }}
              >
                <Icon size={11} strokeWidth={2} />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="qn-bg-soft border qn-border rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full qn-bg-muted mx-auto mb-3 flex items-center justify-center">
                <MessageSquare size={20} className="qn-text-subtle" strokeWidth={1.5} />
              </div>
              <h4 className="qn-display qn-text-ink mb-1" style={{ fontSize: 16 }}>
                Sin publicaciones en esta categoría
              </h4>
              <p className="text-xs qn-text-muted qn-sans">
                Sé la primera persona en iniciar el hilo.
              </p>
            </div>
          ) : (
            posts.map((post) => <ForoPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

function ForosView() {
  const [selectedForoId, setSelectedForoId] = useState(FOROS[0].id);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return FOROS;
    const q = search.toLowerCase();
    return FOROS.filter(
      (f) =>
        f.centro.toLowerCase().includes(q) ||
        f.distrito.toLowerCase().includes(q) ||
        f.departamento.toLowerCase().includes(q)
    );
  }, [search]);

  const subscribed = filtered.filter((f) => f.suscrito);
  const discover = filtered.filter((f) => !f.suscrito);
  const selected = FOROS.find((f) => f.id === selectedForoId);

  return (
    <div className="flex qn-fade" style={{ height: "calc(100vh - 64px)" }}>
      <aside className="w-[320px] border-r qn-border qn-bg flex flex-col shrink-0">
        <div className="p-5 border-b qn-border-soft">
          <h2 className="qn-display qn-text-ink mb-3" style={{ fontSize: 22 }}>
            Foros
          </h2>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 qn-text-subtle"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar foro o distrito…"
              className="qn-input qn-sans w-full rounded-full h-9 pl-9 pr-4 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto qn-scroll p-3 space-y-5">
          {subscribed.length > 0 && (
            <div>
              <div
                className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans px-3 mb-2"
                style={{ fontWeight: 600 }}
              >
                Mis foros · {subscribed.length}
              </div>
              <div className="space-y-1">
                {subscribed.map((f) => (
                  <ForoSidebarItem
                    key={f.id}
                    foro={f}
                    active={selectedForoId === f.id}
                    onClick={() => setSelectedForoId(f.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {discover.length > 0 && (
            <div>
              <div
                className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans px-3 mb-2"
                style={{ fontWeight: 600 }}
              >
                Descubrir · {discover.length}
              </div>
              <div className="space-y-1">
                {discover.map((f) => (
                  <ForoSidebarItem
                    key={f.id}
                    foro={f}
                    active={selectedForoId === f.id}
                    onClick={() => setSelectedForoId(f.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t qn-border-soft">
          <button
            className="w-full text-xs qn-text-terracotta qn-sans flex items-center justify-center gap-1.5 h-9 rounded-full border qn-border qn-hover-warm transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Plus size={12} strokeWidth={2.5} /> Proponer nuevo foro
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        {selected ? <ForoDetail foro={selected} /> : null}
      </main>
    </div>
  );
}

// =============================================================
// Marketplace — venta entre serumistas (sin comisión en MVP)
// =============================================================
function ListingPlaceholder({ categoria }) {
  const cat = MARKET_CATEGORIES.find((c) => c.id === categoria);
  if (!cat) return null;
  const Icon = cat.icon;
  return (
    <div
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cat.color}14 0%, ${cat.color}28 100%)`,
      }}
    >
      <div
        className="absolute inset-0 qn-tocapu pointer-events-none"
        style={{ opacity: 0.3 }}
      />
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
        style={{ backgroundColor: cat.color }}
      >
        <Icon size={28} color="#FAF6F0" strokeWidth={1.6} />
      </div>
    </div>
  );
}

function ConditionBadge({ condicion }) {
  const c = CONDICION_LABELS[condicion];
  if (!c) return null;
  return (
    <span
      className="text-[10px] qn-tracking-wide uppercase px-2 py-0.5 rounded qn-sans"
      style={{
        backgroundColor: c.bg,
        color: c.color,
        fontWeight: 600,
      }}
    >
      {c.label}
    </span>
  );
}

function ListingCard({ listing, onClick }) {
  const cat = MARKET_CATEGORIES.find((c) => c.id === listing.categoria);
  const discount = Math.round(
    ((listing.precioOriginal - listing.precio) / listing.precioOriginal) * 100
  );
  return (
    <button
      onClick={onClick}
      className="qn-bg-paper border qn-border rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg w-full group"
      style={{ boxShadow: "0 1px 3px rgba(26, 20, 16, 0.04)" }}
    >
      <div style={{ aspectRatio: "4/3" }} className="relative">
        <ListingPlaceholder categoria={listing.categoria} />
        {listing.fotos > 1 && (
          <div
            className="absolute top-3 right-3 qn-bg-ink qn-text-cream text-[10px] px-2 py-1 rounded-full flex items-center gap-1 qn-sans"
            style={{ opacity: 0.85, fontWeight: 500 }}
          >
            <ImageIcon size={10} strokeWidth={2} />
            {listing.fotos}
          </div>
        )}
        {discount >= 30 && (
          <div
            className="absolute top-3 left-3 qn-bg-rust qn-text-cream text-[10px] px-2 py-1 rounded qn-sans"
            style={{ fontWeight: 700, letterSpacing: "0.05em" }}
          >
            −{discount}%
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="qn-display qn-text-ink" style={{ fontSize: 22 }}>
            S/ {listing.precio.toLocaleString("es-PE")}
          </span>
          {listing.precioOriginal > listing.precio && (
            <span
              className="text-xs qn-text-subtle qn-sans"
              style={{ textDecoration: "line-through" }}
            >
              S/ {listing.precioOriginal.toLocaleString("es-PE")}
            </span>
          )}
        </div>

        <h3
          className="qn-text-ink qn-sans mb-2 leading-snug"
          style={{ fontSize: 13, fontWeight: 500, minHeight: 36 }}
        >
          {listing.titulo.length > 70
            ? listing.titulo.slice(0, 69) + "…"
            : listing.titulo}
        </h3>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <ConditionBadge condicion={listing.condicion} />
          {cat && (
            <span
              className="text-[10px] qn-tracking-wide uppercase px-1.5 py-0.5 rounded qn-sans flex items-center gap-1"
              style={{
                backgroundColor: `${cat.color}18`,
                color: cat.color,
                fontWeight: 600,
              }}
            >
              {cat.label}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t qn-border-soft text-[11px] qn-text-subtle qn-sans">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={10} strokeWidth={1.8} className="shrink-0" />
            <span className="truncate">{listing.ubicacion}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span>{listing.time}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ListingDetailPanel({ listing, onClose }) {
  if (!listing) return null;
  const cat = MARKET_CATEGORIES.find((c) => c.id === listing.categoria);
  const discount = Math.round(
    ((listing.precioOriginal - listing.precio) / listing.precioOriginal) * 100
  );

  return (
    <div
      className="qn-panel-anim qn-bg fixed inset-y-0 right-0 w-full overflow-y-auto qn-scroll border-l qn-border z-40"
      style={{ maxWidth: 580, boxShadow: "-20px 0 60px rgba(26, 20, 16, 0.15)" }}
    >
      <div className="relative" style={{ aspectRatio: "4/3", maxHeight: 380 }}>
        <ListingPlaceholder categoria={listing.categoria} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: "rgba(26, 20, 16, 0.55)", color: "#FAF6F0" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(26, 20, 16, 0.75)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(26, 20, 16, 0.55)")
          }
        >
          <X size={16} />
        </button>
        {listing.fotos > 1 && (
          <div
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 qn-sans"
            style={{
              backgroundColor: "rgba(26, 20, 16, 0.7)",
              color: "#FAF6F0",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            <ImageIcon size={11} strokeWidth={2} />1 / {listing.fotos}
          </div>
        )}
      </div>

      <div className="px-7 py-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <ConditionBadge condicion={listing.condicion} />
            {cat && (
              <span
                className="text-[10px] qn-tracking-wide uppercase px-2 py-0.5 rounded qn-sans flex items-center gap-1"
                style={{
                  backgroundColor: `${cat.color}18`,
                  color: cat.color,
                  fontWeight: 600,
                }}
              >
                {cat.label}
              </span>
            )}
            <span
              className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-bg-muted px-1.5 py-0.5 rounded qn-sans"
              style={{ fontWeight: 500 }}
            >
              {listing.profesion}
            </span>
          </div>

          <h2
            className="qn-display qn-text-ink leading-tight mb-4"
            style={{ fontSize: 22 }}
          >
            {listing.titulo}
          </h2>

          <div className="flex items-baseline gap-3 mb-1">
            <span className="qn-display qn-text-ink" style={{ fontSize: 38 }}>
              S/ {listing.precio.toLocaleString("es-PE")}
            </span>
            {listing.precioOriginal > listing.precio && (
              <>
                <span
                  className="text-base qn-text-subtle qn-sans"
                  style={{ textDecoration: "line-through" }}
                >
                  S/ {listing.precioOriginal.toLocaleString("es-PE")}
                </span>
                {discount > 0 && (
                  <span
                    className="text-xs qn-bg-rust qn-text-cream px-2 py-1 rounded qn-sans"
                    style={{ fontWeight: 600 }}
                  >
                    −{discount}%
                  </span>
                )}
              </>
            )}
          </div>
          <div className="text-xs qn-text-subtle qn-sans">
            {listing.envio && listing.recojo
              ? "Envío a nivel nacional · recojo en sede"
              : listing.envio
              ? "Solo envío · a nivel nacional"
              : "Solo recojo · sin envío"}
          </div>
        </div>

        <div>
          <div
            className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-2"
            style={{ fontWeight: 500 }}
          >
            Descripción
          </div>
          <p
            className="qn-text qn-sans leading-relaxed"
            style={{ fontSize: 13.5 }}
          >
            {listing.descripcion}
          </p>
        </div>

        <div className="qn-bg-paper border qn-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full qn-bg-forest qn-text-cream flex items-center justify-center text-sm"
                style={{ fontWeight: 500 }}
              >
                {listing.seller.avatar}
              </div>
              {listing.seller.verified && (
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full qn-bg-terracotta flex items-center justify-center"
                  style={{ border: "2px solid white" }}
                >
                  <CheckCircle2 size={11} color="white" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-sm qn-text-ink qn-sans"
                  style={{ fontWeight: 500 }}
                >
                  {listing.seller.name}
                </span>
                <span
                  className="text-[10px] qn-tracking-wide uppercase qn-text-terracotta qn-bg-soft px-1.5 py-0.5 rounded qn-sans"
                  style={{ fontWeight: 600 }}
                >
                  Nivel {listing.seller.level}
                </span>
              </div>
              <div className="text-[11px] qn-text-subtle qn-sans mt-0.5">
                {listing.seller.ventasPrev > 0
                  ? `${listing.seller.ventasPrev} venta${
                      listing.seller.ventasPrev > 1 ? "s" : ""
                    } previa${listing.seller.ventasPrev > 1 ? "s" : ""} · sin reportes`
                  : "Primera venta en Marketplace"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs qn-text-muted qn-sans pt-3 border-t qn-border-soft">
            <MapPin size={12} strokeWidth={1.8} />
            {listing.ubicacion}
          </div>
        </div>

        <div className="space-y-2.5">
          <button className="w-full qn-bg-ink qn-text-cream rounded-full h-12 qn-sans flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
            <MessageSquare size={15} strokeWidth={2} /> Contactar al vendedor
          </button>
          <button
            className="w-full qn-bg-paper border qn-border qn-text-ink rounded-full h-12 qn-sans flex items-center justify-center gap-2"
            style={{ fontWeight: 500 }}
          >
            <Heart size={14} strokeWidth={2} /> Guardar para después
          </button>
        </div>

        <div
          className="qn-bg-soft border qn-border rounded-2xl p-4 flex items-start gap-3"
          style={{ fontSize: 12 }}
        >
          <Shield size={15} className="qn-text-forest mt-0.5 shrink-0" strokeWidth={1.8} />
          <div className="qn-text-muted qn-sans leading-relaxed">
            Compras directamente con quien vende. Qhapaq Ñan no cobra comisión y
            no procesa el pago. Coordina con cuidado: pide fotos adicionales,
            videollamada si dudas, y prefiere recojo o pago contraentrega cuando puedas.
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogoView() {
  const [selected, setSelected] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [activeProf, setActiveProf] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = useMemo(() => {
    return MARKET_LISTINGS.filter((l) => {
      if (activeCat && l.categoria !== activeCat) return false;
      if (activeProf && l.profesion !== activeProf) return false;
      if (maxPrice && l.precio > maxPrice) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.titulo.toLowerCase().includes(q) &&
          !l.descripcion.toLowerCase().includes(q) &&
          !l.ubicacion.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [activeCat, activeProf, maxPrice, search]);

  const profsInData = Array.from(new Set(MARKET_LISTINGS.map((l) => l.profesion)));
  const activeFilters = [activeCat, activeProf, maxPrice, search].filter(Boolean).length;

  const clearAll = () => {
    setActiveCat(null);
    setActiveProf(null);
    setMaxPrice(null);
    setSearch("");
  };

  return (
    <div className="flex h-full">
      <aside
        className="border-r qn-border qn-bg flex flex-col shrink-0 overflow-hidden"
        style={{
          width: sidebarOpen ? 320 : 56,
          transition: "width 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {sidebarOpen ? (
          <>
            <div className="px-5 pt-5 pb-3 flex items-start justify-between shrink-0">
              <div>
                <h2 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 22 }}>
                  Marketplace
                </h2>
                <div className="text-[11px] qn-text-subtle qn-sans mt-0.5">
                  {filtered.length} de {MARKET_LISTINGS.length} publicaciones
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
                title="Colapsar filtros"
              >
                <ChevronLeft size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex-1 px-5 pb-6 overflow-y-auto qn-scroll space-y-5">
              {activeFilters > 0 && (
                <div className="flex items-center justify-between qn-bg-soft border qn-border rounded-xl p-3">
                  <span className="text-xs qn-text-ink qn-sans">
                    <span style={{ fontWeight: 600 }}>{activeFilters}</span> filtro
                    {activeFilters > 1 ? "s" : ""} activo{activeFilters > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-xs qn-text-terracotta qn-sans hover:underline"
                    style={{ fontWeight: 500 }}
                  >
                    Limpiar
                  </button>
                </div>
              )}

              <div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Categoría
                </div>
                <div className="space-y-1">
                  {MARKET_CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const isActive = activeCat === c.id;
                    const count = MARKET_LISTINGS.filter((l) => l.categoria === c.id).length;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCat(isActive ? null : c.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                          isActive ? "qn-bg-soft" : "qn-hover-warm"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: c.color }}
                          >
                            <Icon size={13} color="#FAF6F0" strokeWidth={1.8} />
                          </div>
                          <span className="text-xs qn-text-ink qn-sans" style={{ fontWeight: isActive ? 500 : 400 }}>
                            {c.label}
                          </span>
                        </div>
                        <span className="text-[10px] qn-text-subtle qn-sans">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Carrera del vendedor
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profsInData.map((p) => (
                    <FilterChip
                      key={p}
                      active={activeProf === p}
                      onClick={() => setActiveProf(activeProf === p ? null : p)}
                    >
                      {p}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Rango de precio
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { v: 200, label: "Hasta S/ 200" },
                    { v: 500, label: "Hasta S/ 500" },
                    { v: 1000, label: "Hasta S/ 1,000" },
                    { v: 5000, label: "Hasta S/ 5,000" },
                  ].map((p) => (
                    <FilterChip
                      key={p.v}
                      active={maxPrice === p.v}
                      onClick={() => setMaxPrice(maxPrice === p.v ? null : p.v)}
                    >
                      {p.label}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-5 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative w-10 h-10 rounded-xl qn-bg-paper border qn-border flex items-center justify-center qn-text-ink"
              title="Abrir filtros"
            >
              <Filter size={15} strokeWidth={1.8} />
              {activeFilters > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 qn-bg-terracotta qn-text-cream rounded-full text-[10px] flex items-center justify-center qn-sans"
                  style={{ width: 18, height: 18, fontWeight: 700, border: "2px solid var(--qn-bg)" }}
                >
                  {activeFilters}
                </span>
              )}
            </button>
            <div
              className="text-[10px] qn-text-subtle qn-tracking-wide uppercase qn-sans"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontWeight: 500,
                letterSpacing: "0.2em",
              }}
            >
              Filtros
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto qn-scroll">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6">
          {/* Hero info */}
          <div className="qn-bg-paper border qn-border rounded-2xl p-5 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.4 }} />
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl qn-bg-ink flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} className="qn-text-gold" strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <h1 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 20 }}>
                    Lo que dejan, lo que necesitas
                  </h1>
                  <p className="text-[12px] qn-text-muted qn-sans mt-0.5">
                    Compraventa entre profesionales validados. Sin comisión. Sin intermediarios.
                  </p>
                </div>
              </div>
              <button
                className="qn-bg-ink qn-text-cream rounded-full h-10 px-5 qn-sans flex items-center gap-2 shrink-0"
                style={{ fontWeight: 500, fontSize: 13 }}
              >
                <Plus size={14} strokeWidth={2} /> Publicar algo
              </button>
            </div>
          </div>

          {/* Aviso legal — Ley 29733 + SUNAT — apertura del marketplace */}
          <div className="mb-5">
            <LegalNoticeBanner context="marketplace" />
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 qn-text-subtle"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar publicaciones, ubicación, descripción…"
              className="qn-input qn-sans w-full rounded-full h-11 pl-11 pr-4 text-sm"
            />
          </div>

          {/* Listings grid */}
          {filtered.length === 0 ? (
            <div className="qn-bg-soft border qn-border rounded-2xl p-12 text-center">
              <div className="w-14 h-14 rounded-full qn-bg-muted mx-auto mb-3 flex items-center justify-center">
                <ShoppingBag size={22} className="qn-text-subtle" strokeWidth={1.5} />
              </div>
              <h4 className="qn-display qn-text-ink mb-1" style={{ fontSize: 16 }}>
                Sin publicaciones con esos filtros
              </h4>
              <p className="text-xs qn-text-muted qn-sans mb-4">
                Prueba ampliar los criterios o limpiar los filtros activos.
              </p>
              <button
                onClick={clearAll}
                className="text-xs px-4 h-9 rounded-full qn-bg-ink qn-text-cream qn-sans"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} onClick={() => setSelected(l)} />
              ))}
            </div>
          )}

          {/* Trust note at bottom */}
          <div className="qn-bg-soft border qn-border rounded-2xl p-5 mt-8">
            <div className="flex items-start gap-3">
              <Shield size={16} className="qn-text-forest mt-0.5 shrink-0" strokeWidth={1.8} />
              <div className="text-xs qn-text-muted qn-sans leading-relaxed">
                <span className="qn-text-ink" style={{ fontWeight: 600 }}>
                  Marketplace sin comisiones · acuerdo directo entre vendedor y comprador.
                </span>{" "}
                Solo serumistas verificados pueden publicar. Reportes de mala práctica resultan
                en suspensión inmediata. Próximamente: opciones de pago seguro y envío
                con seguimiento como servicios opcionales.
              </div>
            </div>
          </div>
        </div>
      </main>

      {selected && <ListingDetailPanel listing={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// =============================================================
// Pedidos · compras colectivas (transparente, no sutil)
// =============================================================
function PedidoCard({ pedido, onClick }) {
  const cat = MARKET_CATEGORIES.find((c) => c.id === pedido.categoria);
  const urg = URGENCIA_LABELS[pedido.urgencia];
  const est = ESTADO_PEDIDO[pedido.estado];
  const progreso = Math.min(pedido.solicitantes / pedido.umbral, 1);
  const Icon = cat ? cat.icon : Box;

  return (
    <button
      onClick={onClick}
      className="qn-bg-paper border qn-border rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg w-full block"
      style={{ boxShadow: "0 1px 3px rgba(26, 20, 16, 0.04)" }}
    >
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: est.bg }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: est.accent }}
          />
          <span
            className="text-[10px] qn-tracking-wide uppercase qn-sans"
            style={{ color: est.color, fontWeight: 600 }}
          >
            {est.label}
          </span>
        </div>
        <span
          className="text-[10px] qn-tracking-wide uppercase px-2 py-0.5 rounded qn-sans"
          style={{ backgroundColor: urg.bg, color: urg.color, fontWeight: 600 }}
        >
          {urg.label}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: cat ? `${cat.color}1F` : "var(--qn-muted)" }}
          >
            <Icon size={18} color={cat ? cat.color : "var(--qn-text-muted)"} strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="qn-display qn-text-ink leading-snug mb-1"
              style={{ fontSize: 16 }}
            >
              {pedido.titulo}
            </h3>
            <div className="text-[11px] qn-text-subtle qn-sans">
              Iniciado por {pedido.initiator.name} · {pedido.time}
            </div>
          </div>
        </div>

        <p
          className="text-[12.5px] qn-text-muted qn-sans leading-relaxed mb-4"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {pedido.descripcion}
        </p>

        <div className="qn-bg-warm rounded-xl p-3 mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="qn-display qn-text-ink" style={{ fontSize: 24 }}>
                {pedido.solicitantes}
              </span>
              <span className="text-[11px] qn-text-muted qn-sans">
                {pedido.solicitantes === 1 ? "persona pide esto" : "personas piden esto"}
              </span>
            </div>
            <span className="text-[10px] qn-text-subtle qn-sans">
              umbral · {pedido.umbral}
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progreso * 100}%`,
                backgroundColor: est.accent,
              }}
            />
          </div>
          <div className="text-[10px] qn-text-subtle qn-sans mt-2 truncate">
            {pedido.regiones.length === 1
              ? pedido.regiones[0]
              : `${pedido.regiones.length} regiones · ${pedido.regiones.slice(0, 3).join(", ")}${
                  pedido.regiones.length > 3 ? "…" : ""
                }`}
          </div>
        </div>

        {pedido.estado === "disponible" ? (
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="qn-display qn-text-ink" style={{ fontSize: 22 }}>
                S/ {pedido.precioMaximoColectivo.toLocaleString("es-PE")}
              </div>
              <div className="text-[11px] qn-text-subtle qn-sans">
                <span style={{ textDecoration: "line-through" }}>
                  S/ {pedido.precioReferencia.toLocaleString("es-PE")}
                </span>{" "}
                en retail · ahorras {pedido.descuentoEstimado}%
              </div>
            </div>
            <span
              className="text-xs px-4 h-9 rounded-full qn-bg-forest qn-text-cream qn-sans flex items-center gap-1.5"
              style={{ fontWeight: 500 }}
            >
              Comprar
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] qn-text-muted qn-sans">
              Si llegamos a {pedido.umbral} solicitudes
              <div className="qn-text-ink" style={{ fontWeight: 500, fontSize: 12, marginTop: 2 }}>
                Precio estimado: S/ {pedido.precioMaximoColectivo.toLocaleString("es-PE")}
                <span className="qn-text-terracotta"> · −{pedido.descuentoEstimado}%</span>
              </div>
            </div>
            <span
              className="text-xs px-4 h-9 rounded-full qn-bg-paper border qn-border qn-text-ink qn-sans flex items-center gap-1.5"
              style={{ fontWeight: 500 }}
            >
              <Plus size={13} strokeWidth={2} /> Sumarme
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

function PedidosView() {
  const [activeEstado, setActiveEstado] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = useMemo(() => {
    return PEDIDOS.filter((p) => {
      if (activeEstado && p.estado !== activeEstado) return false;
      if (activeCat && p.categoria !== activeCat) return false;
      return true;
    }).sort((a, b) => b.solicitantes - a.solicitantes);
  }, [activeEstado, activeCat]);

  const activeFilters = [activeEstado, activeCat].filter(Boolean).length;
  const clearAll = () => {
    setActiveEstado(null);
    setActiveCat(null);
  };

  return (
    <div className="flex h-full">
      <aside
        className="border-r qn-border qn-bg flex flex-col shrink-0 overflow-hidden"
        style={{
          width: sidebarOpen ? 320 : 56,
          transition: "width 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {sidebarOpen ? (
          <>
            <div className="px-5 pt-5 pb-3 flex items-start justify-between shrink-0">
              <div>
                <h2 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 22 }}>
                  Pedidos
                </h2>
                <div className="text-[11px] qn-text-subtle qn-sans mt-0.5">
                  {filtered.length} de {PEDIDOS.length} activos
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
                title="Colapsar filtros"
              >
                <ChevronLeft size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex-1 px-5 pb-6 overflow-y-auto qn-scroll space-y-5">
              {activeFilters > 0 && (
                <div className="flex items-center justify-between qn-bg-soft border qn-border rounded-xl p-3">
                  <span className="text-xs qn-text-ink qn-sans">
                    <span style={{ fontWeight: 600 }}>{activeFilters}</span> filtro
                    {activeFilters > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-xs qn-text-terracotta qn-sans hover:underline"
                    style={{ fontWeight: 500 }}
                  >
                    Limpiar
                  </button>
                </div>
              )}

              <div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Estado del pedido
                </div>
                <div className="space-y-1.5">
                  {Object.entries(ESTADO_PEDIDO).map(([key, est]) => {
                    const isActive = activeEstado === key;
                    const count = PEDIDOS.filter((p) => p.estado === key).length;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveEstado(isActive ? null : key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                          isActive ? "qn-bg-soft" : "qn-hover-warm"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: est.accent }}
                          />
                          <span
                            className="text-xs qn-text-ink qn-sans"
                            style={{ fontWeight: isActive ? 500 : 400 }}
                          >
                            {est.label}
                          </span>
                        </div>
                        <span className="text-[10px] qn-text-subtle qn-sans">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Categoría
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_CATEGORIES.map((c) => (
                    <FilterChip
                      key={c.id}
                      active={activeCat === c.id}
                      onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                    >
                      {c.label}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-5 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative w-10 h-10 rounded-xl qn-bg-paper border qn-border flex items-center justify-center qn-text-ink"
              title="Abrir filtros"
            >
              <Filter size={15} strokeWidth={1.8} />
              {activeFilters > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 qn-bg-terracotta qn-text-cream rounded-full text-[10px] flex items-center justify-center qn-sans"
                  style={{ width: 18, height: 18, fontWeight: 700, border: "2px solid var(--qn-bg)" }}
                >
                  {activeFilters}
                </span>
              )}
            </button>
            <div
              className="text-[10px] qn-text-subtle qn-tracking-wide uppercase qn-sans"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontWeight: 500,
                letterSpacing: "0.2em",
              }}
            >
              Filtros
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto qn-scroll">
        <div className="max-w-[1080px] mx-auto px-6 py-6">
          {/* Hero — explicación transparente */}
          <div className="qn-bg-paper border qn-border rounded-2xl p-6 mb-5 relative overflow-hidden">
            <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.4 }} />
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl qn-bg-ink flex items-center justify-center shrink-0">
                  <Package size={20} className="qn-text-gold" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] qn-tracking-extra uppercase qn-text-terracotta qn-sans mb-1.5" style={{ fontWeight: 600 }}>
                    Compras colectivas · sin comisión
                  </div>
                  <h2 className="qn-display qn-text-ink mb-2 leading-tight" style={{ fontSize: 22 }}>
                    Tú dices qué necesitas. Cuando suficientes personas piden lo mismo,{" "}
                    <span className="qn-display-italic qn-text-terracotta">negociamos por todos</span>.
                  </h2>
                  <p className="qn-text qn-sans leading-relaxed" style={{ fontSize: 13 }}>
                    Más demanda igual a mejor precio. El ahorro va completo a ti — Qhapaq Ñan recibe
                    un margen de la negociación con el proveedor, nunca un cobro al usuario. Así
                    mantenemos el Marketplace 100% gratuito.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t qn-border-soft">
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 qn-display"
                    style={{ backgroundColor: "var(--qn-muted)", color: "var(--qn-text-ink)", fontSize: 13 }}
                  >
                    1
                  </div>
                  <div>
                    <div className="qn-text-ink qn-sans" style={{ fontSize: 12.5, fontWeight: 500 }}>
                      Publicas o te sumas
                    </div>
                    <div className="text-[11px] qn-text-muted qn-sans mt-0.5">
                      Cualquier serumista verificado puede iniciar o sumarse a un pedido.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 qn-display"
                    style={{ backgroundColor: "var(--qn-muted)", color: "var(--qn-text-ink)", fontSize: 13 }}
                  >
                    2
                  </div>
                  <div>
                    <div className="qn-text-ink qn-sans" style={{ fontSize: 12.5, fontWeight: 500 }}>
                      Negociamos en bloque
                    </div>
                    <div className="text-[11px] qn-text-muted qn-sans mt-0.5">
                      Al alcanzar el umbral, hablamos con proveedores oficiales por descuento.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 qn-display"
                    style={{ backgroundColor: "var(--qn-muted)", color: "var(--qn-text-ink)", fontSize: 13 }}
                  >
                    3
                  </div>
                  <div>
                    <div className="qn-text-ink qn-sans" style={{ fontSize: 12.5, fontWeight: 500 }}>
                      Compras al precio de grupo
                    </div>
                    <div className="text-[11px] qn-text-muted qn-sans mt-0.5">
                      Confirmas, pagas, recibes. Si no se llega al umbral, no hay obligación.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
            <h3 className="qn-display qn-text-ink" style={{ fontSize: 18 }}>
              {filtered.length === PEDIDOS.length ? "Pedidos activos" : "Resultados filtrados"}
            </h3>
            <button
              className="qn-bg-ink qn-text-cream rounded-full h-10 px-5 qn-sans flex items-center gap-2 shrink-0"
              style={{ fontWeight: 500, fontSize: 13 }}
            >
              <Plus size={14} strokeWidth={2} /> Iniciar nuevo pedido
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="qn-bg-soft border qn-border rounded-2xl p-12 text-center">
              <div className="w-14 h-14 rounded-full qn-bg-muted mx-auto mb-3 flex items-center justify-center">
                <Package size={22} className="qn-text-subtle" strokeWidth={1.5} />
              </div>
              <h4 className="qn-display qn-text-ink mb-1" style={{ fontSize: 16 }}>
                Sin pedidos con esos filtros
              </h4>
              <button
                onClick={clearAll}
                className="text-xs px-4 h-9 rounded-full qn-bg-ink qn-text-cream qn-sans mt-3"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <PedidoCard key={p.id} pedido={p} onClick={() => {}} />
              ))}
            </div>
          )}

          <div className="qn-bg-soft border qn-border rounded-2xl p-5 mt-8">
            <div className="flex items-start gap-3">
              <Shield size={16} className="qn-text-forest mt-0.5 shrink-0" strokeWidth={1.8} />
              <div className="text-xs qn-text-muted qn-sans leading-relaxed">
                <span className="qn-text-ink" style={{ fontWeight: 600 }}>
                  Cómo se sostiene Qhapaq Ñan con esto.
                </span>{" "}
                Cuando un pedido alcanza umbral, negociamos con proveedores oficiales o
                distribuidores. Te ofrecemos el producto al precio negociado más un pequeño
                margen para Qhapaq Ñan — siempre por debajo del retail. Si el margen propuesto
                no te conviene, puedes coordinar con el proveedor por tu cuenta. La transparencia
                es la regla, no la excepción.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MarketplaceView() {
  const [subView, setSubView] = useState("catalogo");

  return (
    <div className="qn-fade flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="border-b qn-border qn-bg shrink-0">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="flex gap-7">
            <SubTabButton active={subView === "catalogo"} onClick={() => setSubView("catalogo")}>
              <ShoppingBag size={14} strokeWidth={1.8} /> Catálogo
            </SubTabButton>
            <SubTabButton active={subView === "pedidos"} onClick={() => setSubView("pedidos")}>
              <Package size={14} strokeWidth={1.8} /> Pedidos
              <span
                className="qn-bg-terracotta qn-text-cream text-[9px] px-1.5 py-0.5 rounded qn-sans"
                style={{ fontWeight: 700, letterSpacing: "0.05em" }}
              >
                NUEVO
              </span>
            </SubTabButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {subView === "catalogo" && <CatalogoView />}
        {subView === "pedidos" && <PedidosView />}
      </div>
    </div>
  );
}

function ChakanaLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <defs>
        <linearGradient id="chakanaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B85820" />
          <stop offset="50%" stopColor="#9A2A1F" />
          <stop offset="100%" stopColor="#2D5938" />
        </linearGradient>
      </defs>
      <path
        d="M9 2 H15 V5 H18 V8 H21 V16 H18 V19 H15 V22 H9 V19 H6 V16 H3 V8 H6 V5 H9 Z M11 9 H13 V11 H15 V13 H13 V15 H11 V13 H9 V11 H11 Z"
        fill="url(#chakanaGrad)"
      />
    </svg>
  );
}

function WelcomeView({ onClose, onVerify, onSkip }) {
  return (
    <div className="qn-fade overflow-y-auto qn-scroll" style={{ height: "calc(100vh - 64px)" }}>
      <div className="max-w-[960px] mx-auto px-6 py-12">
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs qn-text-terracotta qn-sans flex items-center gap-1 mb-8 hover:underline"
            style={{ fontWeight: 500 }}
          >
            <ChevronLeft size={14} /> Volver al perfil
          </button>
        )}

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <ChakanaLogo size={72} />
          </div>

          <div
            className="text-[10px] qn-tracking-extra uppercase qn-text-terracotta qn-sans mb-3"
            style={{ fontWeight: 600 }}
          >
            Qhapaq Ñan · El gran camino del SERUMS
          </div>

          <h1
            className="qn-display qn-text-ink leading-tight mb-5"
            style={{ fontSize: 44, letterSpacing: "-0.02em" }}
          >
            Donde se cuentan las plazas{" "}
            <span className="qn-display-italic qn-text-terracotta">como son</span>.
          </h1>

          <p
            className="qn-text qn-sans qn-text-muted leading-relaxed mx-auto"
            style={{ fontSize: 16, maxWidth: 620 }}
          >
            Mapa colaborativo del SERUMS, foros por centro de salud, marketplace sin
            comisiones y compras colectivas. Construido por serumistas, para serumistas.
          </p>
        </div>

        {/* Two user-type cards — user & professional with progressive validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              titulo: "Solo quiero leer",
              subtitle: "Usuario",
              descripcion:
                "Explorá el mapa, leé reseñas reales y entérate de las plazas. Sin trámites, sin verificación.",
              accent: "#6B5F4F",
              iconBg: "#888780",
              icon: Eye,
              actions: [
                "Mapa de plazas SERUMS",
                "Reseñas verificadas",
                "Boletín fundacional gratis",
              ],
            },
            {
              titulo: "Soy profesional de salud",
              subtitle: "Profesional · validación progresiva",
              descripcion:
                "Empezás con email y subís tu credibilidad por niveles: identidad, profesión, plaza. Cada nivel desbloquea más cosas.",
              accent: "#8E3F11",
              iconBg: "#B85820",
              icon: CheckCircle2,
              actions: [
                "Publicar y comentar (N0+)",
                "Marketplace y pedidos (N1+)",
                "Logros validados de tu carrera (N2+)",
              ],
              recommended: true,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.titulo}
                className="qn-bg-paper border qn-border rounded-2xl p-6 relative"
                style={{
                  borderColor: card.recommended ? card.accent : "var(--qn-border)",
                  borderWidth: card.recommended ? 2 : 1,
                }}
              >
                {card.recommended && (
                  <span
                    className="absolute -top-2.5 left-6 text-[10px] qn-tracking-wide uppercase qn-bg-terracotta qn-text-cream qn-sans px-2 py-1 rounded"
                    style={{ fontWeight: 700 }}
                  >
                    Más común
                  </span>
                )}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon size={20} color="#FAF6F0" strokeWidth={1.6} />
                </div>
                <div
                  className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1"
                  style={{ fontWeight: 600 }}
                >
                  {card.subtitle}
                </div>
                <h3 className="qn-display qn-text-ink mb-2 leading-tight" style={{ fontSize: 18 }}>
                  {card.titulo}
                </h3>
                <p
                  className="text-[12.5px] qn-text-muted qn-sans leading-relaxed mb-4"
                >
                  {card.descripcion}
                </p>
                <div className="space-y-1.5 pt-3 border-t qn-border-soft">
                  {card.actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] qn-text-ink qn-sans">
                      <CheckCircle2 size={11} className="qn-text-forest shrink-0" strokeWidth={2.5} />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          <button
            onClick={onVerify}
            className="qn-bg-ink qn-text-cream rounded-full h-12 px-7 qn-sans flex items-center gap-2"
            style={{ fontWeight: 500, fontSize: 14 }}
          >
            Empezar verificación
            <ArrowRight size={15} strokeWidth={2} />
          </button>
          <button
            onClick={onSkip}
            className="qn-bg-paper border qn-border qn-text-ink rounded-full h-12 px-7 qn-sans flex items-center gap-2 hover:border-[#B85820]"
            style={{ fontWeight: 500, fontSize: 14, transition: "border-color 150ms ease" }}
          >
            Explorar como visitante
          </button>
        </div>

        <div className="text-center text-[12px] qn-text-subtle qn-sans mb-12">
          Si solo quieres leer el mapa y los foros, no necesitas registrarte.
        </div>

        {/* Stats / social proof */}
        <div className="qn-bg-paper border qn-border rounded-2xl p-7 relative overflow-hidden">
          <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.4 }} />
          <div className="relative">
            <div
              className="text-[10px] qn-tracking-extra uppercase qn-text-terracotta qn-sans text-center mb-5"
              style={{ fontWeight: 600 }}
            >
              La comunidad al día de hoy
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: "1,247", label: "Serumistas verificados" },
                { num: "5,810", label: "Plazas en el mapa" },
                { num: "24", label: "Departamentos activos" },
                { num: "47", label: "Foros con moderación" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="qn-display qn-text-ink leading-none mb-1.5" style={{ fontSize: 32 }}>
                    {s.num}
                  </div>
                  <div className="text-[11px] qn-text-muted qn-sans">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="text-[11px] qn-text-subtle qn-sans">
            Lanzamiento público · semestre 2026-I · Lima, Perú
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitorPromptModal({ open, action = "publicar", onClose, onVerify }) {
  if (!open) return null;

  const messages = {
    publicar: {
      title: "Publicar es para serumistas verificados",
      reason: "Para que los posts del feed sean creíbles, exigimos que quien publica haya pasado por la verificación de identidad y acreditación SERUMS.",
    },
    resenar: {
      title: "Reseñar plazas es para serumistas verificados",
      reason: "Las reseñas pesan precisamente porque vienen de profesionales que estuvieron en el lugar. Verificarte protege la integridad del sistema.",
    },
    vender: {
      title: "Vender en Marketplace es para serumistas verificados",
      reason: "El Marketplace funciona porque todos los vendedores son profesionales identificados. Eso reduce el fraude a casi cero.",
    },
    pedido: {
      title: "Sumarse a un pedido es para serumistas verificados",
      reason: "Los pedidos colectivos negocian con proveedores reales. Necesitamos saber que cada solicitante es un profesional auténtico.",
    },
    foro: {
      title: "Postear en foros es para serumistas verificados",
      reason: "Cada foro tiene reglas específicas y moderación humana. Los participantes deben ser identificables para hacerlas cumplir.",
    },
  };

  const msg = messages[action] || messages.publicar;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 qn-fade"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="qn-bg rounded-2xl border qn-border w-full max-w-[480px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(184, 88, 32, 0.08) 0%, rgba(45, 89, 56, 0.08) 100%)",
          }}
        >
          <div className="absolute inset-0 qn-tocapu" style={{ opacity: 0.4 }} />
          <div className="relative flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl qn-bg-ink flex items-center justify-center shrink-0">
              <Lock size={18} color="var(--qn-gold)" strokeWidth={1.6} />
            </div>
            <div className="flex-1">
              <div
                className="text-[10px] qn-tracking-extra uppercase qn-text-terracotta qn-sans mb-1"
                style={{ fontWeight: 600 }}
              >
                Verificación necesaria
              </div>
              <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 19 }}>
                {msg.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-[13px] qn-text-muted qn-sans leading-relaxed mb-4">{msg.reason}</p>

          <div className="qn-bg-soft border qn-border rounded-xl p-4 space-y-2 mb-5">
            <div
              className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-sans mb-1"
              style={{ fontWeight: 600 }}
            >
              Al verificarte, podrás
            </div>
            {[
              "Publicar en feed y participar en foros",
              "Reseñar las plazas donde estuviste",
              "Vender en Marketplace y sumarte a pedidos colectivos",
              "Aparecer con badge de verificada en toda la plataforma",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-[12.5px] qn-text-ink qn-sans">
                <CheckCircle2 size={12} className="qn-text-forest shrink-0" strokeWidth={2.5} />
                {b}
              </div>
            ))}
          </div>

          <div className="text-[11px] qn-text-subtle qn-sans mb-5">
            La verificación toma 5-7 minutos · DNI biométrico + resolución MINSA
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onVerify}
              className="flex-1 qn-bg-ink qn-text-cream rounded-full h-11 qn-sans flex items-center justify-center gap-2"
              style={{ fontWeight: 500, fontSize: 13 }}
            >
              Empezar verificación
              <ArrowRight size={13} strokeWidth={2} />
            </button>
            <button
              onClick={onClose}
              className="qn-bg-paper border qn-border qn-text-ink rounded-full h-11 px-5 qn-sans"
              style={{ fontWeight: 500, fontSize: 13 }}
            >
              Seguir explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTimeline({ entries }) {
  const tipoIcon = {
    serums: Shield,
    trabajo: Briefcase,
    internado: Stethoscope,
    estudios: BookOpen,
    perenne: Anchor,
  };
  const tipoLabel = {
    serums: "SERUMS",
    trabajo: "Trabajo",
    internado: "Internado",
    estudios: "Estudios",
    perenne: "Plaza orgánica",
  };

  return (
    <div className="qn-bg-paper border qn-border rounded-2xl p-7 mb-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div
            className="text-[10px] qn-tracking-extra uppercase qn-text-muted qn-sans"
            style={{ fontWeight: 600 }}
          >
            Mi recorrido profesional
          </div>
          <h3 className="qn-display qn-text-ink mt-1" style={{ fontSize: 18 }}>
            Dónde he caminado
          </h3>
        </div>
        <button
          className="text-xs qn-text-terracotta qn-sans hover:underline flex items-center gap-1"
          style={{ fontWeight: 500 }}
        >
          Editar <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>

      <div className="space-y-0">
        {entries.map((entry, i) => {
          const Icon = tipoIcon[entry.tipo] || Briefcase;
          const isLast = i === entries.length - 1;
          return (
            <div key={i} className="flex gap-4 relative">
              {!isLast && (
                <div
                  className="absolute w-px"
                  style={{
                    left: 17,
                    top: 36,
                    bottom: -8,
                    backgroundColor: "var(--qn-border)",
                  }}
                />
              )}

              <div className="shrink-0 z-10 pt-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: entry.activo ? "var(--qn-terracotta)" : "var(--qn-paper)",
                    border: entry.activo ? "none" : "2px solid var(--qn-border)",
                  }}
                >
                  <Icon
                    size={14}
                    color={entry.activo ? "white" : "var(--qn-text-subtle)"}
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <div className={`flex-1 min-w-0 ${isLast ? "" : "pb-6"}`}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans"
                    style={{ fontWeight: 600 }}
                  >
                    {tipoLabel[entry.tipo]}
                  </span>
                  {entry.verificado && (
                    <span className="flex items-center gap-1 text-[10px] qn-text-forest qn-sans" style={{ fontWeight: 500 }}>
                      <CheckCircle2 size={10} strokeWidth={2.5} /> Verificado
                    </span>
                  )}
                  {entry.activo && (
                    <span
                      className="text-[10px] qn-tracking-wide uppercase qn-bg-terracotta qn-text-cream qn-sans px-1.5 py-0.5 rounded"
                      style={{ fontWeight: 600 }}
                    >
                      Activo
                    </span>
                  )}
                </div>
                <div className="qn-display qn-text-ink leading-tight" style={{ fontSize: 15 }}>
                  {entry.titulo}
                </div>
                <div className="text-[12.5px] qn-text-muted qn-sans mt-0.5">
                  {entry.lugar} · {entry.ubicacion}
                </div>
                <div className="text-[11px] qn-text-subtle qn-sans mt-0.5">
                  {entry.periodo} · {entry.duracion}
                </div>
                {entry.detalles && (
                  <div className="text-[11.5px] qn-text-muted qn-sans mt-1.5 leading-relaxed" style={{ fontStyle: "italic" }}>
                    {entry.detalles}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-5 border-t qn-border-soft flex items-center justify-between">
        <div className="text-[11px] qn-text-subtle qn-sans">
          {entries.filter((e) => e.verificado).length} de {entries.length} entradas verificadas oficialmente
        </div>
        <button
          className="text-xs qn-text-terracotta qn-sans hover:underline flex items-center gap-1"
          style={{ fontWeight: 500 }}
        >
          <Plus size={11} strokeWidth={2.5} /> Agregar entrada
        </button>
      </div>
    </div>
  );
}

function ReportModal({ open, onClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (!open) return null;

  const reasons = [
    {
      id: "usurpacion",
      label: "Usurpación de identidad",
      description: "Esta cuenta usa los datos de otro profesional sin permiso.",
      severe: true,
    },
    {
      id: "contenido",
      label: "Contenido inapropiado",
      description: "Publicaciones o comentarios contra las reglas de convivencia.",
    },
    {
      id: "fraude_marketplace",
      label: "Fraude en Marketplace o Pedidos",
      description: "Vendedor que no entrega, cobra y desaparece, o engaña sobre el producto.",
      severe: true,
    },
    {
      id: "spam",
      label: "Spam o promoción no autorizada",
      description: "Publicidad disfrazada, mensajes repetitivos, esquemas piramidales.",
    },
    {
      id: "otro",
      label: "Otro motivo",
      description: "Descríbelo en el siguiente paso.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 qn-fade"
      style={{ backgroundColor: "rgba(26, 20, 16, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="qn-bg rounded-2xl border qn-border w-full max-w-[560px] overflow-hidden"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b qn-border-soft flex items-start justify-between shrink-0">
          <div>
            <div
              className="text-[10px] qn-tracking-extra uppercase qn-text-rust qn-sans mb-1"
              style={{ fontWeight: 600 }}
            >
              Reporte confidencial
            </div>
            <h2 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 22 }}>
              ¿Qué quieres reportar?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto qn-scroll px-6 py-5">
          <div className="space-y-2 mb-5">
            {reasons.map((r) => (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  reason === r.id ? "qn-bg-soft" : "qn-bg-paper qn-hover-warm"
                }`}
                style={{
                  borderColor:
                    reason === r.id
                      ? "var(--qn-terracotta)"
                      : "var(--qn-border)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: reason === r.id ? "var(--qn-terracotta)" : "transparent",
                      border: reason === r.id ? "none" : "2px solid var(--qn-border)",
                    }}
                  >
                    {reason === r.id && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "white" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                        {r.label}
                      </span>
                      {r.severe && (
                        <span
                          className="text-[9px] qn-tracking-wide uppercase qn-bg-rust qn-text-cream qn-sans px-1.5 py-0.5 rounded"
                          style={{ fontWeight: 700 }}
                        >
                          Grave
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] qn-text-muted qn-sans leading-relaxed">
                      {r.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {reason && (
            <div className="qn-fade">
              <label
                className="text-[11px] qn-tracking-wide uppercase qn-text-muted qn-sans block mb-2"
                style={{ fontWeight: 600 }}
              >
                Detalles adicionales (opcional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  reason === "usurpacion"
                    ? "¿Cómo sabes que es un caso de usurpación? Cualquier dato que tengas — nombre real del titular, vínculo profesional, etc. — acelera la revisión."
                    : "Cualquier contexto que ayude al equipo de moderación a entender el caso."
                }
                className="qn-input qn-sans w-full rounded-xl p-3 text-sm"
                rows={4}
                style={{ resize: "none" }}
              />

              <div
                className="mt-4 rounded-xl p-3 flex items-start gap-3"
                style={{ backgroundColor: "rgba(217, 160, 45, 0.08)", border: "1px solid rgba(217, 160, 45, 0.25)" }}
              >
                <Shield size={14} className="qn-text-gold mt-0.5 shrink-0" strokeWidth={1.8} />
                <div className="text-[11.5px] qn-text-muted qn-sans leading-relaxed">
                  Tu reporte es <span className="qn-text-ink" style={{ fontWeight: 500 }}>confidencial</span>.
                  El reportado no sabe quién lo denunció. Casos graves se revisan en menos de 24
                  horas. Si confirmamos usurpación, la cuenta se suspende inmediatamente y la
                  plaza se libera para que el titular legítimo se verifique.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t qn-border-soft flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="text-xs px-4 h-10 rounded-full border qn-border qn-text-ink qn-sans qn-hover-warm"
            style={{ fontWeight: 500 }}
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            disabled={!reason}
            className={`text-xs px-5 h-10 rounded-full qn-sans flex items-center gap-2 ${
              reason ? "qn-bg-rust qn-text-cream" : "qn-bg-muted qn-text-subtle"
            }`}
            style={{ fontWeight: 500, cursor: reason ? "pointer" : "not-allowed" }}
          >
            <AlertTriangle size={13} strokeWidth={2} /> Enviar reporte
          </button>
        </div>
      </div>
    </div>
  );
}

// Resolver de iconos para nombres almacenados en data (logros).
// Mantiene los datos serializables para cuando esto pase a backend.
const ICON_BY_NAME = {
  MessageCircle, MessageSquare, Compass, Mountain, BookOpen,
  Shield, Anchor, Star, Crown, Heart, Zap, MapPin, ArrowRight,
  TrendingUp, Home, CheckCircle2, Sparkles, Utensils, Users,
  Trophy, Award,
};

function resolveLogroIcon(name) {
  return ICON_BY_NAME[name] || Award;
}

function UserTypeBadge({ type, nivel, size = "md" }) {
  const t = USER_TYPES[type];
  if (!t) return null;
  // Si es profesional con nivel, mostramos el nivel; si es visitante, solo el tipo.
  const lvl = type === "profesional" && typeof nivel === "number"
    ? VALIDATION_LEVELS.find((v) => v.nivel === nivel)
    : null;
  const Icon = t.icon;
  const dims = size === "sm"
    ? { px: "px-2", h: "h-6", text: 10, icon: 11 }
    : { px: "px-2.5", h: "h-7", text: 11, icon: 12 };

  if (lvl) {
    return (
      <span
        className={`${dims.px} ${dims.h} rounded-full inline-flex items-center gap-1.5 qn-sans qn-tracking-wide uppercase`}
        style={{
          backgroundColor: lvl.bg,
          color: lvl.color,
          fontSize: dims.text,
          fontWeight: 600,
        }}
      >
        <Icon size={dims.icon} strokeWidth={2} />
        {t.short} · N{lvl.nivel} {lvl.badge}
      </span>
    );
  }
  return (
    <span
      className={`${dims.px} ${dims.h} rounded-full inline-flex items-center gap-1.5 qn-sans qn-tracking-wide uppercase`}
      style={{
        backgroundColor: t.bg,
        color: t.color,
        fontSize: dims.text,
        fontWeight: 600,
      }}
    >
      <Icon size={dims.icon} strokeWidth={2} />
      {t.label}
    </span>
  );
}

function ValidationLevelPill({ nivel, size = "md" }) {
  const lvl = VALIDATION_LEVELS.find((v) => v.nivel === nivel);
  if (!lvl) return null;
  const dims = size === "sm"
    ? { px: "px-1.5", h: "h-5", text: 9 }
    : { px: "px-2", h: "h-6", text: 10 };
  return (
    <span
      className={`${dims.px} ${dims.h} rounded inline-flex items-center gap-1 qn-sans qn-tracking-wide uppercase`}
      style={{
        backgroundColor: lvl.bg,
        color: lvl.color,
        fontSize: dims.text,
        fontWeight: 700,
      }}
      title={lvl.description}
    >
      {lvl.badge} N{nivel} · {lvl.short}
    </span>
  );
}

function ValidationCheck({ ok = true, label }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{
          backgroundColor: ok ? "var(--qn-forest)" : "var(--qn-muted)",
        }}
      >
        {ok ? (
          <CheckCircle2 size={12} color="white" strokeWidth={3} />
        ) : (
          <X size={11} color="white" strokeWidth={2.5} />
        )}
      </div>
      <span className="text-xs qn-sans qn-text-ink">{label}</span>
    </div>
  );
}

function StepHeader({ num, label, status, description }) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  return (
    <div className="flex items-start gap-4 mb-5">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 qn-display"
        style={{
          backgroundColor: isCompleted
            ? "var(--qn-forest)"
            : isActive
            ? "var(--qn-terracotta)"
            : "var(--qn-muted)",
          color: isCompleted || isActive ? "var(--qn-cream)" : "var(--qn-text-subtle)",
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        {isCompleted ? <CheckCircle2 size={20} strokeWidth={2.5} /> : num}
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 20 }}>
            {label}
          </h3>
          {isCompleted && (
            <span
              className="text-[10px] qn-tracking-wide uppercase qn-text-forest qn-sans"
              style={{ fontWeight: 600 }}
            >
              Completado
            </span>
          )}
        </div>
        <p className="text-[13px] qn-text-muted qn-sans mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function VerificationFlow({ onClose }) {
  return (
    <div className="qn-fade max-w-[820px] mx-auto px-6 py-8">
      <button
        onClick={onClose}
        className="text-xs qn-text-terracotta qn-sans flex items-center gap-1 mb-6 hover:underline"
        style={{ fontWeight: 500 }}
      >
        <ChevronLeft size={14} /> Volver al perfil
      </button>

      <h1 className="qn-display qn-text-ink mb-3" style={{ fontSize: 32 }}>
        Cómo verificamos a quien dice ser{" "}
        <span className="qn-display-italic qn-text-terracotta">serumista</span>
      </h1>
      <p className="qn-text qn-sans qn-text-muted leading-relaxed mb-8" style={{ fontSize: 14, maxWidth: 640 }}>
        Las listas de plazas SERUMS son públicas. Eso facilita que alguien pueda intentar usurpar
        la identidad de un colega. Por eso pedimos cuatro pasos — diseñados para que sea
        prácticamente imposible hacerse pasar por otro profesional.
      </p>

      <div className="mb-10">
        <div className="text-[11px] qn-tracking-extra uppercase qn-text-muted qn-sans mb-3" style={{ fontWeight: 600 }}>
          Tres tipos de cuenta
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(USER_TYPES).map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className="rounded-2xl p-5 border"
                style={{
                  backgroundColor: t.bg,
                  borderColor: `${t.color}33`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: t.iconBg }}
                >
                  <Icon size={18} color="#FAF6F0" strokeWidth={1.8} />
                </div>
                <div className="qn-display qn-text-ink mb-1" style={{ fontSize: 16 }}>
                  {t.label}
                </div>
                <p className="text-[12px] qn-sans leading-relaxed mb-3" style={{ color: t.color }}>
                  {t.description}
                </p>
                <div className="space-y-1 pt-3 border-t" style={{ borderColor: `${t.color}22` }}>
                  {t.permissions.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] qn-sans">
                      {p.has ? (
                        <CheckCircle2 size={10} className="qn-text-forest shrink-0" strokeWidth={2.5} />
                      ) : (
                        <X size={10} style={{ color: "var(--qn-text-subtle)" }} className="shrink-0" strokeWidth={2.5} />
                      )}
                      <span style={{ color: p.has ? t.color : "var(--qn-text-subtle)" }}>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="qn-bg-paper border qn-border rounded-2xl p-7 mb-4">
        <StepHeader
          num={1}
          label="Tipo de cuenta"
          status="completed"
          description="El usuario elige cómo quiere usar la plataforma. Visitantes pasan al feed inmediatamente sin verificación. Serumistas y perennes continúan con los siguientes pasos."
        />
        <div className="qn-bg-warm rounded-xl p-4 ml-16">
          <div className="flex items-center gap-2 text-xs qn-text-muted qn-sans">
            <CheckCircle2 size={13} className="qn-text-forest" strokeWidth={2.5} />
            Elegiste <span className="qn-text-ink" style={{ fontWeight: 500 }}>Serumista</span> · pasarás por verificación de identidad y acreditación SERUMS.
          </div>
        </div>
      </div>

      <div className="qn-bg-paper border qn-border rounded-2xl p-7 mb-4">
        <StepHeader
          num={2}
          label="Identidad (DNI + selfie con detección de vida)"
          status="completed"
          description="Verificamos que la persona detrás de la cuenta es quien su DNI dice ser. Cara de DNI vs cara en vivo con un proveedor especializado en biometría."
        />
        <div className="ml-16 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="qn-bg-soft border qn-border rounded-xl p-4">
              <div
                className="w-full rounded-lg mb-3 flex items-center justify-center qn-bg-warm"
                style={{ aspectRatio: "1.6/1", border: "1px dashed var(--qn-border)" }}
              >
                <CreditCard size={24} className="qn-text-subtle" strokeWidth={1.5} />
              </div>
              <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1" style={{ fontWeight: 600 }}>
                DNI · Frente
              </div>
              <div className="text-xs qn-text-ink qn-sans">DNI 70485132</div>
              <div className="text-[11px] qn-text-muted qn-sans">Carla Mendoza</div>
            </div>

            <div className="qn-bg-soft border qn-border rounded-xl p-4">
              <div
                className="w-full rounded-lg mb-3 flex items-center justify-center qn-bg-warm"
                style={{ aspectRatio: "1.6/1", border: "1px dashed var(--qn-border)" }}
              >
                <CreditCard size={24} className="qn-text-subtle" strokeWidth={1.5} />
              </div>
              <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1" style={{ fontWeight: 600 }}>
                DNI · Reverso
              </div>
              <div className="text-xs qn-text-ink qn-sans">Emisión válida</div>
              <div className="text-[11px] qn-text-muted qn-sans">Vence 2031</div>
            </div>

            <div className="qn-bg-soft border qn-border rounded-xl p-4">
              <div
                className="w-full rounded-lg mb-3 flex items-center justify-center qn-bg-ink"
                style={{ aspectRatio: "1.6/1" }}
              >
                <Camera size={24} color="var(--qn-gold)" strokeWidth={1.5} />
              </div>
              <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1" style={{ fontWeight: 600 }}>
                Selfie · Liveness
              </div>
              <div className="text-xs qn-text-ink qn-sans">Detección activa</div>
              <div className="text-[11px] qn-text-muted qn-sans">Captura en vivo</div>
            </div>
          </div>

          <div className="qn-bg-warm rounded-xl p-4">
            <div className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-sans mb-2" style={{ fontWeight: 600 }}>
              Validaciones automáticas
            </div>
            <div>
              <ValidationCheck label="Coincidencia facial DNI ↔ selfie · 98.7%" />
              <ValidationCheck label="Detección de vida superada · no es foto ni video" />
              <ValidationCheck label="DNI no aparece en lista de documentos reportados" />
            </div>
          </div>
        </div>
      </div>

      <div className="qn-bg-paper border qn-border rounded-2xl p-7 mb-4">
        <StepHeader
          num={3}
          label="Acreditación SERUMS · cruce con padrón oficial"
          status="completed"
          description="Subes la resolución del MINSA. Extraemos los datos automáticamente y los cruzamos con las listas oficiales públicas. Aquí es donde detenemos la usurpación."
        />
        <div className="ml-16 space-y-4">
          <div className="qn-bg-soft border qn-border rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-14 rounded shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "#9A2A1F" }}
              >
                <FileText size={20} color="#FAF6F0" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1" style={{ fontWeight: 600 }}>
                  Documento subido
                </div>
                <div className="qn-text-ink qn-sans text-sm" style={{ fontWeight: 500 }}>
                  Resolución-MINSA-142-2026.pdf
                </div>
                <div className="text-[11px] qn-text-muted qn-sans">3.2 MB · firma digital validada</div>
              </div>
              <FileCheck size={18} className="qn-text-forest shrink-0 mt-1" strokeWidth={1.8} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t qn-border-soft">
              {[
                { k: "Nombre completo", v: "Carla Mendoza Quispe" },
                { k: "DNI", v: "70485132" },
                { k: "Profesión", v: "Médico Cirujano" },
                { k: "Plaza asignada", v: "Posta Médica de Pozuzo" },
                { k: "RENIPRESS", v: "0001234" },
                { k: "Período", v: "2026-I (12 meses)" },
                { k: "Resolución", v: "RM N° 142-2026/MINSA" },
                { k: "Modalidad", v: "Remunerado · MINSA" },
              ].map((f) => (
                <div key={f.k}>
                  <div
                    className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-0.5"
                    style={{ fontWeight: 500 }}
                  >
                    {f.k}
                  </div>
                  <div className="text-xs qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                    {f.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="qn-bg-warm rounded-xl p-4">
            <div className="text-[10px] qn-tracking-wide uppercase qn-text-muted qn-sans mb-2" style={{ fontWeight: 600 }}>
              Cruces con padrón oficial MINSA 2026-I
            </div>
            <div>
              <ValidationCheck label="Nombre coincide con tu DNI verificado" />
              <ValidationCheck label="Plaza encontrada en lista pública MINSA · Pozuzo · período 2026-I" />
              <ValidationCheck label="Esta plaza no está reclamada por otro usuario verificado" />
              <ValidationCheck label="Hash del PDF no presenta alteraciones · firma digital MINSA válida" />
              <ValidationCheck label="Período activo · acreditación al día" />
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "rgba(217, 160, 45, 0.08)", border: "1px solid rgba(217, 160, 45, 0.25)" }}
          >
            <Shield size={15} className="qn-text-gold mt-0.5 shrink-0" strokeWidth={1.8} />
            <div className="text-[12px] qn-text-muted qn-sans leading-relaxed">
              <span className="qn-text-ink" style={{ fontWeight: 600 }}>
                ¿Por qué este paso es crítico?
              </span>{" "}
              Las listas de plazas son públicas — cualquiera puede saber que el Dr. X tiene la
              plaza de Pozuzo. Pero solo el Dr. X tiene su DNI y su rostro. Al cruzar identidad
              biométrica con la asignación oficial, cerramos la puerta a la usurpación. Una plaza
              solo puede ser reclamada una vez.
            </div>
          </div>
        </div>
      </div>

      <div className="qn-bg-paper border qn-border rounded-2xl p-7 mb-8">
        <StepHeader
          num={4}
          label="Confirmación y bienvenida"
          status="completed"
          description="Recibes el badge de Serumista verificado y el acceso a todas las funciones de la comunidad."
        />
        <div className="ml-16">
          <div className="qn-bg-ink qn-text-cream rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 qn-tocapu opacity-20 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full qn-bg-terracotta flex items-center justify-center">
                  <CheckCircle2 size={22} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="qn-display" style={{ fontSize: 18 }}>Bienvenida a Qhapaq Ñan, Carla</div>
                  <div className="text-xs qn-text-gold qn-sans" style={{ fontWeight: 500 }}>
                    Serumista verificada · Pozuzo, Pasco · 2026-I
                  </div>
                </div>
              </div>
              <p className="text-[13px] qn-sans leading-relaxed" style={{ color: "rgba(245, 239, 227, 0.88)" }}>
                Ya puedes publicar en feed y foros, dejar reseñas de Pozuzo, vender en Marketplace
                y sumarte a pedidos colectivos. Tu reputación crecerá según cómo aportes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict scenario */}
      <div className="mb-8">
        <div
          className="text-[11px] qn-tracking-extra uppercase qn-sans mb-3"
          style={{ fontWeight: 600, color: "var(--qn-rust)" }}
        >
          ¿Y si alguien intenta usurpar una plaza?
        </div>
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "rgba(154, 42, 31, 0.3)",
            backgroundColor: "rgba(250, 236, 231, 0.5)",
          }}
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ backgroundColor: "rgba(154, 42, 31, 0.08)" }}
          >
            <AlertTriangle size={18} className="qn-text-rust shrink-0" strokeWidth={1.8} />
            <div>
              <div
                className="text-[10px] qn-tracking-wide uppercase qn-sans"
                style={{ fontWeight: 700, color: "var(--qn-rust)" }}
              >
                Conflicto detectado · plaza ya reclamada
              </div>
              <div className="qn-display qn-text-ink mt-0.5" style={{ fontSize: 16 }}>
                Esta plaza ya está verificada por otro usuario
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-[13px] qn-text-muted qn-sans leading-relaxed">
              Pozuzo · período 2026-I para Médico Cirujano fue verificada el{" "}
              <span className="qn-text-ink" style={{ fontWeight: 500 }}>11 de marzo de 2026</span> por una
              cuenta con iniciales <span className="qn-text-ink" style={{ fontWeight: 500 }}>S.R.</span> Una
              plaza solo puede tener un titular verificado por período-profesión.
            </p>

            <div className="qn-bg-paper border qn-border rounded-xl divide-y qn-border-soft">
              <button className="w-full text-left p-4 flex items-start gap-3 qn-hover-warm transition-colors">
                <div className="w-8 h-8 rounded-full qn-bg-soft flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} className="qn-text-terracotta" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                    Esta es mi plaza · hay un error
                  </div>
                  <div className="text-[12px] qn-text-muted qn-sans mt-0.5">
                    Caso de probable usurpación. Disparas revisión humana inmediata. Tu solicitud queda en cola y se contrasta con RENIEC y la resolución oficial. Si confirmamos que eres titular, la otra cuenta se suspende y tu verificación se aprueba.
                  </div>
                </div>
                <ChevronRight size={14} className="qn-text-subtle shrink-0 mt-2" strokeWidth={1.8} />
              </button>

              <button className="w-full text-left p-4 flex items-start gap-3 qn-hover-warm transition-colors">
                <div className="w-8 h-8 rounded-full qn-bg-soft flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={14} className="qn-text-forest" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                    Compartimos plaza · soy de otra profesión
                  </div>
                  <div className="text-[12px] qn-text-muted qn-sans mt-0.5">
                    Algunas postas tienen plazas múltiples (médico + enfermera + obstetra). El sistema verifica que tu profesión sea distinta y aprueba ambas verificaciones bajo el mismo centro. Sin conflicto.
                  </div>
                </div>
                <ChevronRight size={14} className="qn-text-subtle shrink-0 mt-2" strokeWidth={1.8} />
              </button>

              <button className="w-full text-left p-4 flex items-start gap-3 qn-hover-warm transition-colors">
                <div className="w-8 h-8 rounded-full qn-bg-soft flex items-center justify-center shrink-0 mt-0.5">
                  <X size={14} className="qn-text-subtle" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                    Cancelar verificación
                  </div>
                  <div className="text-[12px] qn-text-muted qn-sans mt-0.5">
                    Quedas como Visitante. Puedes intentar de nuevo si consigues la documentación correcta.
                  </div>
                </div>
                <ChevronRight size={14} className="qn-text-subtle shrink-0 mt-2" strokeWidth={1.8} />
              </button>
            </div>

            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ backgroundColor: "rgba(45, 89, 56, 0.08)", border: "1px solid rgba(45, 89, 56, 0.25)" }}
            >
              <Shield size={14} className="qn-text-forest mt-0.5 shrink-0" strokeWidth={1.8} />
              <div className="text-[12px] qn-text-muted qn-sans leading-relaxed">
                <span className="qn-text-ink" style={{ fontWeight: 600 }}>El sistema apuesta por el titular legítimo.</span>{" "}
                Si tu evidencia (DNI + resolución original + biometría) gana sobre la del actual, la otra cuenta se suspende inmediatamente. Si la otra evidencia es más sólida, te pedimos contactar soporte con cualquier antecedente que pueda acreditar tu titularidad.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qn-bg-soft border qn-border rounded-2xl p-6">
        <div className="text-[11px] qn-tracking-extra uppercase qn-text-terracotta qn-sans mb-3" style={{ fontWeight: 600 }}>
          Compromiso de privacidad
        </div>
        <div className="space-y-1">
          <ValidationCheck label="Tu DNI y selfie se procesan con biometría y se eliminan a los 30 días. Solo guardamos el hash." />
          <ValidationCheck label="La resolución SERUMS queda archivada solo para auditoría — no se comparte con terceros." />
          <ValidationCheck label="Tus datos personales nunca se usan para entrenar IA ni se venden a marcas." />
          <ValidationCheck label="Cumplimos con la Ley N° 29733 de Protección de Datos Personales del Perú." />
          <ValidationCheck label="Puedes solicitar eliminación total de tu cuenta y datos en cualquier momento." />
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Sección de logros — vanity + status
// =============================================================
function AchievementCard({ logro, desbloqueado }) {
  const Icon = resolveLogroIcon(logro.icon);
  const rareza = RAREZA_LOGRO[logro.rareza];
  return (
    <div
      className="qn-bg-paper border rounded-xl p-3.5 transition-all"
      style={{
        borderColor: desbloqueado ? rareza.color + "40" : "var(--qn-border-soft)",
        opacity: desbloqueado ? 1 : 0.55,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: desbloqueado ? rareza.bg : "var(--qn-muted)",
            color: desbloqueado ? rareza.color : "var(--qn-text-subtle)",
          }}
        >
          {desbloqueado ? (
            <Icon size={18} strokeWidth={1.8} />
          ) : (
            <Lock size={14} strokeWidth={1.8} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span
              className="qn-text-ink qn-sans leading-tight"
              style={{ fontSize: 12.5, fontWeight: 600 }}
            >
              {logro.titulo}
            </span>
            {logro.validado && (
              <span
                className="text-[8.5px] px-1.5 py-px rounded qn-sans uppercase qn-tracking-wide"
                style={{
                  backgroundColor: "rgba(45, 89, 56, 0.12)",
                  color: "var(--qn-forest-dark)",
                  fontWeight: 700,
                }}
                title={`Requiere validación N${logro.requiereValidacion || 2}`}
              >
                Verificado
              </span>
            )}
          </div>
          <p className="text-[11px] qn-text-muted qn-sans leading-snug">
            {logro.descripcion}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[9px] qn-tracking-wide uppercase qn-sans"
              style={{ color: rareza.color, fontWeight: 600 }}
            >
              {rareza.label}
            </span>
            {!desbloqueado && logro.requiereValidacion && (
              <span className="text-[9.5px] qn-text-subtle qn-sans">
                · Requiere N{logro.requiereValidacion}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementsSection() {
  const [tab, setTab] = useState("carrera");
  const carreraKey = CURRENT_USER.professionKey || "MEDICINA";
  const logrosCarrera = LOGROS_POR_CARRERA[carreraKey] || [];
  const desbloqueadosSet = new Set(LOGROS_DESBLOQUEADOS_DEMO);

  const lista = tab === "carrera" ? logrosCarrera : LOGROS_GENERALES;
  const desbloqueados = lista.filter((l) => desbloqueadosSet.has(l.id)).length;

  return (
    <div className="qn-bg-paper border qn-border rounded-2xl p-5 sm:p-6 mb-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl qn-bg-soft flex items-center justify-center">
            <Trophy size={18} className="qn-text-terracotta" strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 17 }}>
              Logros
            </h3>
            <div className="text-[11.5px] qn-text-muted qn-sans">
              {desbloqueados} de {lista.length} desbloqueados ·{" "}
              <span className="qn-text-subtle">
                los validados dan status, los demás son juego
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 qn-bg-warm rounded-full p-1 w-fit">
        <button
          onClick={() => setTab("carrera")}
          className={`text-[11.5px] px-3 h-7 rounded-full qn-sans transition-colors ${
            tab === "carrera" ? "qn-bg-paper qn-text-ink" : "qn-text-muted"
          }`}
          style={{ fontWeight: 500 }}
        >
          De {CURRENT_USER.profession}
        </button>
        <button
          onClick={() => setTab("generales")}
          className={`text-[11.5px] px-3 h-7 rounded-full qn-sans transition-colors ${
            tab === "generales" ? "qn-bg-paper qn-text-ink" : "qn-text-muted"
          }`}
          style={{ fontWeight: 500 }}
        >
          Generales
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lista.map((logro) => (
          <AchievementCard
            key={logro.id}
            logro={logro}
            desbloqueado={desbloqueadosSet.has(logro.id)}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================
// Avisos legales — Ley N° 29733 + Marketplace + SUNAT
// =============================================================
// Estos avisos son los mínimos necesarios para operar en Perú a abril 2026
// según la Ley N° 29733 de Protección de Datos Personales, Ley N° 30096 de
// Delitos Informáticos, Decreto Legislativo N° 1182, y el régimen de SUNAT
// para personas naturales y RUS. La copia es deliberadamente clara para
// que los usuarios entiendan qué responsabilidad asumen.
function LegalNoticeBanner({ context = "marketplace" }) {
  const copy = {
    marketplace: {
      title: "Cómo funciona la compraventa entre profesionales",
      bullets: [
        "Qhapaq Ñan no es intermediario ni custodia de pagos. Comprador y vendedor coordinan directamente.",
        "Cada parte es responsable de emitir su comprobante (boleta, recibo por honorarios o factura) si la operación supera el límite SUNAT vigente para su régimen — ver simulador SUNAT cuando dudes.",
        "Las ventas habituales pueden generar obligación tributaria. Si vendes con frecuencia, evalúa inscribirte al RUS o al régimen MYPE.",
        "Reportá cualquier intento de estafa, suplantación o fraude. Las cuentas con reportes confirmados se suspenden y la información puede compartirse con autoridades.",
      ],
    },
    dm: {
      title: "Mensajería privada — solo con consentimiento mutuo",
      bullets: [
        "Por defecto, nadie puede escribirte por mensaje privado. Cuando alguien lo solicita, vos decidís si aceptás.",
        "Las conversaciones se almacenan cifradas. Solo se acceden por orden judicial competente.",
        "Si decidís migrar la conversación a WhatsApp u otra plataforma, esa conversación queda fuera de la protección de Qhapaq Ñan.",
        "Compartir datos personales de pacientes por DM está prohibido y puede acarrear sanción según la Ley N° 29733.",
      ],
    },
    datos: {
      title: "Tus datos personales",
      bullets: [
        "Tu DNI y selfie se procesan para validación y se eliminan a los 30 días. Solo conservamos el hash.",
        "Tu resolución profesional o constancia laboral se archiva para auditoría — nunca se publica ni se comparte con terceros.",
        "Nunca se usan tus datos para entrenar IA externa ni se venden a marcas o aseguradoras.",
        "Podés solicitar acceso, rectificación o eliminación total de tu cuenta y datos en cualquier momento — Ley N° 29733.",
      ],
    },
  }[context];

  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        backgroundColor: "rgba(217, 160, 45, 0.06)",
        borderColor: "rgba(217, 160, 45, 0.3)",
      }}
    >
      <div className="flex items-start gap-3">
        <Shield
          size={16}
          className="qn-text-gold shrink-0 mt-0.5"
          strokeWidth={1.8}
        />
        <div className="flex-1 min-w-0">
          <div
            className="text-[10.5px] qn-tracking-extra uppercase qn-sans mb-2"
            style={{ fontWeight: 700, color: "var(--qn-brown)" }}
          >
            {copy.title}
          </div>
          <ul className="space-y-1.5">
            {copy.bullets.map((b, i) => (
              <li
                key={i}
                className="text-[11.5px] qn-text-muted qn-sans leading-relaxed flex items-start gap-2"
              >
                <span className="qn-text-gold shrink-0 mt-0.5" style={{ fontWeight: 700 }}>
                  ·
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Notificaciones unificadas — todo en una bandeja, lo crítico va al email
// =============================================================
const NOTIFICACIONES_DEMO = [
  {
    id: 1,
    tipo: "validacion",
    titulo: "Tu validación N3 fue confirmada",
    cuerpo: "Cruzamos tu resolución con el padrón MINSA. Ya podés desbloquear logros geográficos.",
    time: "hace 2h",
    leido: false,
    importante: true,
  },
  {
    id: 2,
    tipo: "dm_solicitud",
    titulo: "María Llanos quiere escribirte por privado",
    cuerpo: "Aceptá si querés conversar fuera del feed. Podés rechazar sin que ella lo sepa.",
    time: "hace 5h",
    leido: false,
    importante: false,
  },
  {
    id: 3,
    tipo: "comentario",
    titulo: "Diego Quispe comentó tu post sobre Pozuzo",
    cuerpo: "“Coincido en lo del bus nocturno, vale cada sol extra…”",
    time: "hace 8h",
    leido: false,
    importante: false,
  },
  {
    id: 4,
    tipo: "logro",
    titulo: "Desbloqueaste un logro: Veterano del VRAEM",
    cuerpo: "Tu servicio en zona ZE quedó registrado. Visible en tu perfil.",
    time: "hace 1d",
    leido: true,
    importante: false,
  },
  {
    id: 5,
    tipo: "moderacion",
    titulo: "Tu reporte fue resuelto",
    cuerpo: "El usuario reportado por suplantación fue suspendido tras revisión humana.",
    time: "hace 2d",
    leido: true,
    importante: true,
  },
];

function NotificacionItem({ notif, onClick }) {
  const iconByTipo = {
    validacion: ShieldCheck,
    dm_solicitud: MessageCircle,
    comentario: MessageSquare,
    logro: Trophy,
    moderacion: AlertTriangle,
    sistema: Bell,
  };
  const Icon = iconByTipo[notif.tipo] || Bell;
  const colorByTipo = {
    validacion: "#2D5938",
    dm_solicitud: "#B85820",
    comentario: "#6B3E1F",
    logro: "#D9A02D",
    moderacion: "#9A2A1F",
    sistema: "#6B5F4F",
  };
  const color = colorByTipo[notif.tipo];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 sm:p-4 border-b qn-border-soft transition-colors ${
        notif.leido ? "qn-hover-warm" : "qn-bg-soft"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + "1A", color }}
        >
          <Icon size={15} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span
              className="qn-text-ink qn-sans leading-snug"
              style={{ fontSize: 12.5, fontWeight: notif.leido ? 400 : 600 }}
            >
              {notif.titulo}
            </span>
            {!notif.leido && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                style={{ backgroundColor: "var(--qn-terracotta)" }}
              />
            )}
          </div>
          <p className="text-[11.5px] qn-text-muted qn-sans leading-snug mb-1.5">
            {notif.cuerpo}
          </p>
          <div className="flex items-center gap-2 text-[10.5px] qn-text-subtle qn-sans">
            <span>{notif.time}</span>
            {notif.importante && (
              <>
                <span>·</span>
                <span style={{ color: "var(--qn-rust)", fontWeight: 600 }}>
                  Enviada por email
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function NotificationsPanel({ open, onClose }) {
  if (!open) return null;
  const noLeidas = NOTIFICACIONES_DEMO.filter((n) => !n.leido).length;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(26, 20, 16, 0.3)" }}
        onClick={onClose}
      />
      <div
        className="qn-panel-anim qn-bg fixed inset-y-0 right-0 w-full overflow-y-auto qn-scroll border-l qn-border z-50"
        style={{ maxWidth: 420, boxShadow: "-20px 0 60px rgba(26, 20, 16, 0.15)" }}
      >
        <div className="qn-bg-cream-glass sticky top-0 border-b qn-border-soft p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="qn-display qn-text-ink leading-none" style={{ fontSize: 18 }}>
              Notificaciones
            </div>
            <div className="text-[11px] qn-text-subtle qn-sans mt-1">
              {noLeidas} sin leer · solo lo crítico llega al email
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
        <div>
          {NOTIFICACIONES_DEMO.map((n) => (
            <NotificacionItem key={n.id} notif={n} onClick={() => {}} />
          ))}
        </div>
        <div className="p-4 sm:p-5">
          <button className="w-full text-xs qn-text-terracotta qn-sans hover:underline" style={{ fontWeight: 500 }}>
            Configurar qué llega por email
          </button>
        </div>
      </div>
    </>
  );
}

// =============================================================
// Cola de moderación — interfaz separada para revisores
// =============================================================
const REPORTES_DEMO = [
  {
    id: 1,
    motivo: "usurpacion",
    motivoLabel: "Posible usurpación de identidad",
    reportante: { name: "Andrés Castillo", avatar: "AC" },
    target: { tipo: "usuario", nombre: "Carlos Pérez · Médico", id: "usr_8821" },
    detalles: "Esta cuenta dice tener plaza en Sondorillo en 2025-II, pero esa plaza fue mía y no soy esa persona. Adjunto resolución original.",
    tiempo: "hace 1h",
    severidad: "alta",
    evidencias: 2,
  },
  {
    id: 2,
    motivo: "datos_paciente",
    motivoLabel: "Datos identificables de paciente",
    reportante: { name: "Sofía Ramírez", avatar: "SR" },
    target: { tipo: "post", id: "post_4521", autor: "Usuario anónimo" },
    detalles: "El post incluye nombre completo y diagnóstico de un paciente menor de edad. Violación clara de Ley 29733.",
    tiempo: "hace 4h",
    severidad: "alta",
    evidencias: 1,
  },
  {
    id: 3,
    motivo: "spam",
    motivoLabel: "Spam comercial fuera del foro de promociones",
    reportante: { name: "Diego Quispe", avatar: "DQ" },
    target: { tipo: "comentario", id: "cmt_998", autor: "Marketing externo" },
    detalles: "Tres comentarios consecutivos promocionando una clínica privada en hilos clínicos del foro de Pozuzo.",
    tiempo: "hace 1d",
    severidad: "media",
    evidencias: 0,
  },
];

function ModerationView() {
  const [filter, setFilter] = useState("todos");
  const filtered = REPORTES_DEMO.filter(
    (r) => filter === "todos" || r.severidad === filter
  );

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 qn-fade">
      <div className="mb-6">
        <div
          className="text-[10px] qn-tracking-extra uppercase qn-text-rust qn-sans mb-2"
          style={{ fontWeight: 600 }}
        >
          Solo moderadores
        </div>
        <h1 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 28 }}>
          Cola de moderación
        </h1>
        <p className="qn-text qn-sans qn-text-muted mt-1" style={{ fontSize: 13 }}>
          Casos abiertos por revisar. Severidad alta debe resolverse en menos de 24 h.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {["todos", "alta", "media", "baja"].map((f) => (
          <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === "todos" ? "Todos" : `Severidad ${f}`}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="qn-bg-paper border qn-border rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    r.severidad === "alta"
                      ? "rgba(154, 42, 31, 0.12)"
                      : "rgba(184, 88, 32, 0.12)",
                  color:
                    r.severidad === "alta" ? "var(--qn-rust)" : "var(--qn-terracotta)",
                }}
              >
                <AlertTriangle size={16} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 15 }}>
                    {r.motivoLabel}
                  </h3>
                  <span
                    className="text-[9.5px] qn-tracking-wide uppercase px-2 py-0.5 rounded qn-sans"
                    style={{
                      backgroundColor:
                        r.severidad === "alta" ? "var(--qn-rust)" : "var(--qn-terracotta)",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {r.severidad}
                  </span>
                </div>
                <div className="text-[11px] qn-text-subtle qn-sans">
                  Reportado por {r.reportante.name} · {r.tiempo} · {r.evidencias} evidencia
                  {r.evidencias === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <div className="qn-bg-warm rounded-xl p-3 mb-3">
              <div
                className="text-[10px] qn-tracking-wide uppercase qn-text-subtle qn-sans mb-1"
                style={{ fontWeight: 600 }}
              >
                Objetivo del reporte
              </div>
              <div className="text-[12px] qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                {r.target.tipo === "usuario"
                  ? r.target.nombre
                  : `${r.target.tipo} de ${r.target.autor}`}
              </div>
            </div>

            <p className="text-[12.5px] qn-text-muted qn-sans leading-relaxed mb-4">
              {r.detalles}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                className="text-xs px-4 h-9 rounded-full qn-bg-rust text-white qn-sans"
                style={{ fontWeight: 500 }}
              >
                Resolver: aplicar sanción
              </button>
              <button
                className="text-xs px-4 h-9 rounded-full qn-bg-paper border qn-border qn-text-ink qn-sans"
                style={{ fontWeight: 500 }}
              >
                Pedir más información
              </button>
              <button
                className="text-xs px-4 h-9 rounded-full qn-bg-paper border qn-border-soft qn-text-muted qn-sans"
                style={{ fontWeight: 500 }}
              >
                Descartar reporte
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ setView }) {
  const [mode, setMode] = useState("profile");
  const [reportOpen, setReportOpen] = useState(false);
  const [visitorPromptOpen, setVisitorPromptOpen] = useState(false);
  const [visitorAction, setVisitorAction] = useState("publicar");

  if (mode === "verification") {
    return (
      <div className="overflow-y-auto qn-scroll" style={{ height: "calc(100vh - 64px)" }}>
        <VerificationFlow onClose={() => setMode("profile")} />
      </div>
    );
  }

  const t = USER_TYPES[CURRENT_USER.userType];

  const triggerPrompt = (action) => {
    setVisitorAction(action);
    setVisitorPromptOpen(true);
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-8 qn-fade">
      <div className="qn-bg-paper border qn-border rounded-2xl overflow-hidden mb-5">
        <div
          className="h-32 relative"
          style={{
            background:
              "linear-gradient(135deg, #B85820 0%, #8E3F11 40%, #2D5938 100%)",
          }}
        >
          <div className="absolute inset-0 qn-tocapu opacity-30" />
        </div>
        <div className="px-7 pb-7" style={{ marginTop: -48 }}>
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full qn-bg-ink flex items-center justify-center qn-display"
                style={{ border: "4px solid var(--qn-bg)", color: "var(--qn-gold)", fontSize: 30 }}
              >
                {CURRENT_USER.avatar}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: t.iconBg, border: "3px solid var(--qn-bg)" }}
              >
                <CheckCircle2 size={14} color="white" strokeWidth={3} />
              </div>
            </div>
            <button className="text-xs px-4 h-9 rounded-full border qn-border qn-text-ink qn-hover-warm qn-sans">
              Editar perfil
            </button>
          </div>

          <h2 className="qn-display qn-text-ink mb-1" style={{ fontSize: 26 }}>
            {CURRENT_USER.name}
          </h2>
          <div className="text-sm qn-text-muted mb-4 qn-sans">
            {CURRENT_USER.profession} · {CURRENT_USER.university}
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <UserTypeBadge type={CURRENT_USER.userType} nivel={CURRENT_USER.nivelValidacion} />
            <span
              className="text-xs px-3 py-1 rounded-full qn-bg-soft qn-text-terracotta border qn-sans flex items-center gap-1.5"
              style={{ borderColor: "rgba(184, 88, 32, 0.3)", fontWeight: 500 }}
            >
              <Award size={12} /> {CURRENT_USER.badge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t qn-border-soft">
            {[
              { label: "Nivel validación", value: `N${CURRENT_USER.nivelValidacion}`, sub: "de 3" },
              { label: "Karma", value: CURRENT_USER.karma, sub: "puntos" },
              { label: "Aportes", value: CURRENT_USER.contributions, sub: "reseñas y posts" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[10px] qn-tracking-wide uppercase qn-text-subtle mb-1 qn-sans" style={{ fontWeight: 500 }}>
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="qn-display qn-text-ink" style={{ fontSize: 32 }}>
                    {stat.value}
                  </span>
                  <span className="text-xs qn-text-subtle qn-sans">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setMode("verification")}
        className="qn-bg-paper border qn-border rounded-2xl p-6 mb-5 w-full text-left hover:border-[#B85820] block"
        style={{ transition: "border-color 150ms ease" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl qn-bg-forest flex items-center justify-center shrink-0">
            <ShieldCheck size={20} color="#FAF6F0" strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 17 }}>
                Validación nivel {CURRENT_USER.nivelValidacion} alcanzada
              </h3>
              <ValidationLevelPill nivel={CURRENT_USER.nivelValidacion} size="sm" />
            </div>
            <p className="text-[12.5px] qn-text-muted qn-sans leading-relaxed mb-3">
              Validada desde {CURRENT_USER.verifiedSince}. Plaza activa:{" "}
              <span className="qn-text-ink" style={{ fontWeight: 500 }}>
                {CURRENT_USER.plazaActiva.centro}
              </span>{" "}
              ({CURRENT_USER.plazaActiva.periodo}). Tu voz pesa{" "}
              <span className="qn-text-ink" style={{ fontWeight: 500 }}>
                ×{VALIDATION_LEVELS.find((v) => v.nivel === CURRENT_USER.nivelValidacion)?.weight}
              </span>{" "}
              en reseñas.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {VALIDATION_LEVELS.map((lvl, i) => {
                const reached = lvl.nivel <= CURRENT_USER.nivelValidacion;
                return (
                  <div key={lvl.id} className="flex items-center gap-1.5">
                    {reached ? (
                      <CheckCircle2 size={11} className="qn-text-forest" strokeWidth={2.5} />
                    ) : (
                      <div className="w-[11px] h-[11px] rounded-full border qn-border" />
                    )}
                    <span
                      className="text-[11px] qn-sans"
                      style={{
                        color: reached ? "var(--qn-text-muted)" : "var(--qn-text-subtle)",
                        fontWeight: reached ? 500 : 400,
                      }}
                    >
                      N{lvl.nivel} · {lvl.short}
                    </span>
                    {i < VALIDATION_LEVELS.length - 1 && (
                      <span className="text-[10px] qn-text-subtle">·</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-[11px] qn-text-terracotta qn-sans flex items-center gap-1" style={{ fontWeight: 500 }}>
              Ver detalle de cada nivel <ChevronRight size={12} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </button>

      <AchievementsSection />

      <ProfileTimeline entries={CURRENT_USER.recorrido} />

      <div className="qn-bg-ink qn-text-cream rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute inset-0 qn-tocapu opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] qn-tracking-extra uppercase qn-text-gold qn-sans mb-3" style={{ fontWeight: 500 }}>
            Cómo funciona la reputación
          </div>
          <h3 className="qn-display mb-3" style={{ fontSize: 22, lineHeight: 1.2 }}>
            Tu voz pesa más{" "}
            <span className="qn-display-italic qn-text-gold">cuanto más has caminado</span>.
          </h3>
          <p className="qn-text qn-sans mb-5" style={{ fontSize: 13.5, color: "rgba(245, 239, 227, 0.85)" }}>
            En Qhapaq Ñan, cada reseña, post útil y aporte a la comunidad eleva tu nivel. Los
            usuarios verificados con experiencia directa aportan más peso a las decisiones
            colectivas — y desbloquean privilegios de moderación.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { lvl: "1-2", name: "Postulante", desc: "Aún no SERUMS" },
              { lvl: "3-4", name: "En servicio", desc: "Verificado en sede" },
              { lvl: "5+", name: "Veterano", desc: "+1 año aportando" },
            ].map((l) => (
              <div
                key={l.lvl}
                className="rounded-xl p-3"
                style={{
                  backgroundColor: "rgba(245, 239, 227, 0.06)",
                  border: "1px solid rgba(245, 239, 227, 0.12)",
                }}
              >
                <div className="text-[10px] qn-tracking-wide uppercase qn-text-gold mb-1 qn-sans" style={{ fontWeight: 600 }}>
                  Nivel {l.lvl}
                </div>
                <div className="qn-display text-sm mb-0.5">{l.name}</div>
                <div className="text-[11px] qn-sans" style={{ color: "rgba(245, 239, 227, 0.55)" }}>
                  {l.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety and reporting card */}
      <div className="qn-bg-paper border qn-border rounded-2xl p-6 mt-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl qn-bg-soft flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="qn-text-rust" strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="qn-display qn-text-ink leading-tight mb-1" style={{ fontSize: 16 }}>
              ¿Detectaste algo raro?
            </h3>
            <p className="text-[12.5px] qn-text-muted qn-sans leading-relaxed mb-3">
              Si crees que alguien está usurpando una identidad, hay fraude en Marketplace, o
              contenido contra las reglas — repórtalo. Casos graves se revisan en menos de 24
              horas.
            </p>
            <button
              onClick={() => setReportOpen(true)}
              className="text-xs qn-bg-paper border qn-border qn-text-ink px-4 h-9 rounded-full qn-sans hover:border-[#9A2A1F] flex items-center gap-2"
              style={{ fontWeight: 500, transition: "border-color 150ms ease" }}
            >
              <AlertTriangle size={12} strokeWidth={2} /> Reportar contenido o usuario
            </button>
          </div>
        </div>
      </div>

      {/* Acceso a moderación — solo para validados N3+ con permiso de moderar */}
      {CURRENT_USER.nivelValidacion >= 3 && (
        <button
          onClick={() => setView && setView("moderation")}
          className="qn-bg-paper border qn-border rounded-2xl p-5 mt-5 w-full text-left hover:border-[#9A2A1F] block"
          style={{ transition: "border-color 150ms ease" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl qn-bg-rust flex items-center justify-center shrink-0">
              <Shield size={18} color="#FAF6F0" strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="qn-display qn-text-ink leading-tight" style={{ fontSize: 15.5 }}>
                  Cola de moderación
                </h3>
                <span
                  className="text-[10px] qn-tracking-wide uppercase qn-bg-rust qn-text-cream qn-sans px-2 py-0.5 rounded"
                  style={{ fontWeight: 700 }}
                >
                  3 abiertos
                </span>
              </div>
              <p className="text-[12px] qn-text-muted qn-sans leading-relaxed">
                Revisar reportes de la comunidad. Casos de severidad alta se priorizan.
              </p>
            </div>
            <ChevronRight size={14} className="qn-text-subtle shrink-0 mt-2" strokeWidth={1.8} />
          </div>
        </button>
      )}

      {/* Avisos legales y privacidad — visible siempre, abreviado */}
      <div className="mt-5 space-y-3">
        <LegalNoticeBanner context="datos" />
        <LegalNoticeBanner context="dm" />
      </div>

      {/* Onboarding demos */}
      <div className="qn-bg-paper border qn-border rounded-2xl p-5 sm:p-6 mt-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl qn-bg-soft flex items-center justify-center shrink-0">
            <Compass size={18} className="qn-text-terracotta" strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="qn-display qn-text-ink leading-tight mb-1" style={{ fontSize: 16 }}>
              Demos del onboarding
            </h3>
            <p className="text-[12.5px] qn-text-muted qn-sans leading-relaxed">
              Vistas que normalmente solo ven nuevos usuarios. Útiles para revisar el funnel de conversión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setView && setView("welcome")}
            className="text-left qn-bg-soft border qn-border rounded-xl p-4 hover:border-[#B85820] transition-colors"
            style={{ transition: "border-color 150ms ease" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ChakanaLogo size={18} />
              <span className="text-[13px] qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                Pantalla de bienvenida
              </span>
            </div>
            <div className="text-[11.5px] qn-text-muted qn-sans leading-relaxed">
              La primera impresión: dos tipos de cuenta y validación progresiva.
            </div>
          </button>

          <button
            onClick={() => triggerPrompt("publicar")}
            className="text-left qn-bg-soft border qn-border rounded-xl p-4 hover:border-[#B85820] transition-colors"
            style={{ transition: "border-color 150ms ease" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock size={15} className="qn-text-terracotta" strokeWidth={1.8} />
              <span className="text-[13px] qn-text-ink qn-sans" style={{ fontWeight: 500 }}>
                Prompt de conversión (visitante)
              </span>
            </div>
            <div className="text-[11.5px] qn-text-muted qn-sans leading-relaxed">
              Lo que ve un visitante cuando intenta publicar, reseñar o vender.
            </div>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] qn-text-subtle qn-sans">Variantes del prompt:</span>
          {["resenar", "vender", "pedido", "foro"].map((a) => (
            <button
              key={a}
              onClick={() => triggerPrompt(a)}
              className="text-[10px] qn-text-terracotta qn-sans hover:underline"
              style={{ fontWeight: 500 }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
      <VisitorPromptModal
        open={visitorPromptOpen}
        action={visitorAction}
        onClose={() => setVisitorPromptOpen(false)}
        onVerify={() => {
          setVisitorPromptOpen(false);
          setMode("verification");
        }}
      />
    </div>
  );
}


// =============================================================
// Main component
// =============================================================
export default function QhapaqNanApp() {
  const [view, setView] = useState("map");
  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const [activeProf, setActiveProf] = useState("Todas");
  const [activeGD, setActiveGD] = useState(null);
  const [activeBono, setActiveBono] = useState(null);
  const [mapSidebarOpen, setMapSidebarOpen] = useState(false); // mobile only

  const filtered = useMemo(() => {
    return PLAZAS.filter((p) => {
      if (activeProf !== "Todas" && p.profesion !== activeProf) return false;
      if (activeGD && p.gd !== activeGD) return false;
      if (activeBono === "ZAF" && !p.zaf) return false;
      if (activeBono === "ZE" && !p.ze) return false;
      return true;
    });
  }, [activeProf, activeGD, activeBono]);

  const handleSelectPlaza = (p) => {
    setSelectedPlaza(p);
    setMapSidebarOpen(false); // close mobile drawer when selecting from list
  };

  return (
    <div className="qn-bg" style={{ minHeight: "100vh" }}>
      <style>{QN_STYLES}</style>

      <Header view={view} setView={setView} />

      {view === "map" && (
        <div
          className="flex relative"
          style={{ height: "calc(100vh - 56px)" }}
        >
          {/* Mobile floating button to open sidebar */}
          <button
            onClick={() => setMapSidebarOpen(true)}
            className="md:hidden absolute top-3 left-3 z-[1002] qn-bg-paper border qn-border rounded-full h-10 px-4 qn-sans flex items-center gap-2 text-xs qn-text-ink"
            style={{
              fontWeight: 500,
              boxShadow: "0 8px 24px rgba(26, 20, 16, 0.14)",
            }}
          >
            <Filter size={13} strokeWidth={1.8} />
            {filtered.length} plazas · filtrar
          </button>

          {/* Sidebar — drawer on mobile, fixed column on desktop */}
          <aside
            className={`border-r qn-border qn-bg flex-col z-40 ${
              mapSidebarOpen ? "flex fixed inset-0" : "hidden md:flex md:relative"
            }`}
            style={{ width: mapSidebarOpen ? "100%" : 400, maxWidth: 480 }}
          >
            <div className="p-4 sm:p-5 border-b qn-border-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="qn-display qn-text-ink" style={{ fontSize: 22 }}>
                  Plazas{" "}
                  <span className="qn-display-italic qn-text-terracotta">SERUMS</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs qn-text-subtle qn-sans">
                    {filtered.length} resultados
                  </span>
                  <button
                    onClick={() => setMapSidebarOpen(false)}
                    className="md:hidden w-8 h-8 rounded-full qn-hover-warm flex items-center justify-center qn-text-subtle"
                    aria-label="Cerrar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <div
                    className="text-[10px] qn-tracking-wide uppercase qn-text-subtle mb-2 qn-sans"
                    style={{ fontWeight: 500 }}
                  >
                    Profesión
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <FilterChip
                      active={activeProf === "Todas"}
                      onClick={() => setActiveProf("Todas")}
                    >
                      Todas
                    </FilterChip>
                    {PROFESIONES.map((p) => (
                      <FilterChip
                        key={p}
                        active={activeProf === p}
                        onClick={() => setActiveProf(p)}
                      >
                        {p.length > 12 ? p.slice(0, 11) + "…" : p}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[10px] qn-tracking-wide uppercase qn-text-subtle mb-2 qn-sans"
                    style={{ fontWeight: 500 }}
                  >
                    Dificultad
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["GD-1", "GD-2", "GD-3", "GD-4", "GD-5"].map((g) => (
                      <FilterChip
                        key={g}
                        active={activeGD === g}
                        onClick={() => setActiveGD(activeGD === g ? null : g)}
                      >
                        {g}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[10px] qn-tracking-wide uppercase qn-text-subtle mb-2 qn-sans"
                    style={{ fontWeight: 500 }}
                  >
                    Bonos
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <FilterChip
                      active={activeBono === "ZAF"}
                      onClick={() =>
                        setActiveBono(activeBono === "ZAF" ? null : "ZAF")
                      }
                    >
                      Bono ZAF
                    </FilterChip>
                    <FilterChip
                      active={activeBono === "ZE"}
                      onClick={() =>
                        setActiveBono(activeBono === "ZE" ? null : "ZE")
                      }
                    >
                      Bono ZE · VRAEM
                    </FilterChip>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto qn-scroll">
              {filtered.map((p) => (
                <PlazaListItem
                  key={p.id}
                  plaza={p}
                  selected={selectedPlaza?.id === p.id}
                  onClick={() => handleSelectPlaza(p)}
                />
              ))}
            </div>
          </aside>

          {/* Map */}
          <main className="flex-1 relative">
            <LeafletMap
              plazas={filtered}
              selectedId={selectedPlaza?.id}
              onSelectPlaza={setSelectedPlaza}
            />
          </main>
        </div>
      )}

      {view === "welcome" && (
        <WelcomeView
          onClose={() => setView("profile")}
          onVerify={() => setView("profile")}
          onSkip={() => setView("map")}
        />
      )}
      {view === "foros" && <ForosView />}
      {view === "feed" && <CommunityView />}
      {view === "market" && <MarketplaceView />}
      {view === "profile" && <ProfileView setView={setView} />}
      {view === "moderation" && <ModerationView />}

      {selectedPlaza && view === "map" && (
        <PlazaDetailPanel
          plaza={selectedPlaza}
          onClose={() => setSelectedPlaza(null)}
        />
      )}
    </div>
  );
}
