import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recetasPath = path.join(__dirname, '../data/recetas.json');
const alimentosPath = path.join(__dirname, '../data/alimentos.json');

// ── 5 recetas jugos (IDs 61-65) ──────────────────────────────────────────────

const jugos = [
  {
    id: 61,
    nombre: 'Jugo Verde para la Tiroides (El Clásico)',
    descripcion: 'El jugo que más ayuda al intestino y a la tiroides. Sin azúcar, sin fruta de alto índice glucémico. Pepino, apio, espinaca, limón y jengibre — la combinación que más se recomienda para hipotiroidismo y Hashimoto.',
    categoria: 'jugo',
    tiempo_preparacion: 5,
    porciones: 1,
    nivel_dificultad: 'facil',
    ingredientes: [
      { cantidad: '1', unidad: 'unidad', nombre: 'pepino mediano' },
      { cantidad: '3', unidad: 'ramas', nombre: 'apio con hojas' },
      { cantidad: '2', unidad: 'puñados', nombre: 'espinaca fresca' },
      { cantidad: '1', unidad: 'unidad', nombre: 'limón (jugo)' },
      { cantidad: '2', unidad: 'cm', nombre: 'jengibre fresco pelado' },
      { cantidad: '1/2', unidad: 'taza', nombre: 'agua filtrada o fría' },
      { cantidad: 'opcional', unidad: '', nombre: '1 hoja de menta fresca' },
    ],
    pasos: [
      { numero: 1, descripcion: 'Lavás bien todas las verduras. Pelás el pepino si no es orgánico. Cortás todo en trozos para que entre en la licuadora.' },
      { numero: 2, descripcion: 'Licuás todo junto con el agua a velocidad máxima 1-2 minutos hasta que quede homogéneo.' },
      { numero: 3, descripcion: 'Colás con un colador fino o tomás sin colar para conservar toda la fibra. Tomás de inmediato en ayunas o 30 minutos antes del desayuno.' },
    ],
    tip_nutricional: 'El apio tiene propiedades antiinflamatorias y actúa como diurético natural, ayudando con la retención de líquidos del hipotiroidismo. El jengibre calma la inflamación intestinal. El limón aporta vitamina C y activa enzimas detoxificantes del hígado donde se convierte T4 en T3. Tomarlo en ayunas maximiza la absorción.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true,
  },
  {
    id: 62,
    nombre: 'Jugo Antiinflamatorio de Remolacha y Zanahoria',
    descripcion: 'Dulce naturalmente, sin azúcar añadida. La remolacha limpia el hígado y la zanahoria aporta betacaroteno. Un jugo que se ve espectacular y le hace bien al intestino y a la tiroides.',
    categoria: 'jugo',
    tiempo_preparacion: 8,
    porciones: 1,
    nivel_dificultad: 'facil',
    ingredientes: [
      { cantidad: '1', unidad: 'unidad', nombre: 'remolacha mediana cruda' },
      { cantidad: '2', unidad: 'unidades', nombre: 'zanahorias' },
      { cantidad: '1', unidad: 'unidad', nombre: 'manzana verde (sin semillas)' },
      { cantidad: '1', unidad: 'cm', nombre: 'jengibre fresco' },
      { cantidad: '1/2', unidad: 'unidad', nombre: 'limón (jugo)' },
      { cantidad: '1/2', unidad: 'taza', nombre: 'agua' },
    ],
    pasos: [
      { numero: 1, descripcion: 'Pelás la remolacha y las zanahorias. Cortás todo en cubos pequeños para facilitar el licuado.' },
      { numero: 2, descripcion: 'Licuás todo junto con el agua y el jugo de limón a velocidad máxima hasta obtener jugo homogéneo.' },
      { numero: 3, descripcion: 'Colás si preferís textura más líquida. Servís en vaso alto con hielo. Tomás dentro de los 15 minutos para conservar los nutrientes.' },
    ],
    tip_nutricional: 'La remolacha contiene betaína que apoya la detoxificación hepática — función clave para el metabolismo de T4 en T3. Su nitrato natural mejora la circulación. La manzana verde tiene menor índice glucémico que la roja y aporta pectina prebiótica para el intestino.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true,
  },
  {
    id: 63,
    nombre: 'Licuado Verde con Semillas de Chía y Palta',
    descripcion: 'Más cremoso que un jugo, más nutritivo que un smoothie común. La palta y la chía aportan grasas saludables que hacen que todos los nutrientes se absorban mejor. Para tomar a media mañana cuando el cuerpo necesita energía real.',
    categoria: 'jugo',
    tiempo_preparacion: 5,
    porciones: 1,
    nivel_dificultad: 'facil',
    ingredientes: [
      { cantidad: '1/2', unidad: 'unidad', nombre: 'palta madura' },
      { cantidad: '2', unidad: 'puñados', nombre: 'espinaca baby' },
      { cantidad: '1', unidad: 'unidad', nombre: 'pepino chico' },
      { cantidad: '1', unidad: 'cda', nombre: 'semillas de chía' },
      { cantidad: '1', unidad: 'taza', nombre: 'agua de coco sin azúcar' },
      { cantidad: '1/2', unidad: 'unidad', nombre: 'limón (jugo)' },
      { cantidad: '1', unidad: 'pizca', nombre: 'sal marina' },
    ],
    pasos: [
      { numero: 1, descripcion: 'Colocás todos los ingredientes en la licuadora. La palta le da la base cremosa.' },
      { numero: 2, descripcion: 'Licuás a velocidad alta 1 minuto hasta que quede completamente homogéneo y verde intenso.' },
      { numero: 3, descripcion: 'Dejás reposar 2 minutos para que la chía empiece a gelatinizar. Revolvés y tomás. No colar — la fibra es parte del beneficio.' },
    ],
    tip_nutricional: 'El agua de coco aporta potasio y electrolitos naturales que ayudan con la retención de líquidos del hipotiroidismo. La chía suma omega-3 ALA y magnesio. La palta hace que los carotenoides de la espinaca se absorban hasta 4 veces mejor. Un licuado completo que no es "de dieta" — es nutritivo de verdad.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true,
  },
  {
    id: 64,
    nombre: 'Agua de Limón con Cúrcuma y Pimienta Negra',
    descripcion: 'No es un jugo, es un ritual de mañana. Tres minutos de preparación, beneficios antiinflamatorios reales. La cúrcuma con pimienta negra es la combinación más estudiada para reducir la inflamación en condiciones autoinmunes como Hashimoto.',
    categoria: 'jugo',
    tiempo_preparacion: 3,
    porciones: 1,
    nivel_dificultad: 'facil',
    ingredientes: [
      { cantidad: '1', unidad: 'vaso', nombre: 'agua tibia (no caliente)' },
      { cantidad: '1', unidad: 'unidad', nombre: 'limón (jugo)' },
      { cantidad: '1/2', unidad: 'cdita', nombre: 'cúrcuma en polvo' },
      { cantidad: '1', unidad: 'pizca', nombre: 'pimienta negra molida' },
      { cantidad: '1', unidad: 'cdita', nombre: 'miel pura (opcional)' },
      { cantidad: 'opcional', unidad: '', nombre: '1 pizca de jengibre en polvo' },
    ],
    pasos: [
      { numero: 1, descripcion: 'Calentás agua hasta que esté tibia (no hirviendo — el agua muy caliente destruye los beneficios de la cúrcuma y el limón).' },
      { numero: 2, descripcion: 'Disolvés la cúrcuma y la pimienta en un poco del agua tibia primero, revolviendo bien para evitar grumos.' },
      { numero: 3, descripcion: 'Agregás el jugo de limón y el resto del agua. Endulzás con miel si querés. Tomás de inmediato, en ayunas o 20 minutos antes del desayuno.' },
    ],
    tip_nutricional: 'La curcumina de la cúrcuma aumenta su absorción hasta 20 veces con la piperina de la pimienta negra. Para Hashimoto, esta combinación inhibe el factor NF-kB, una vía central de inflamación autoinmune. El limón activa enzimas hepáticas que apoyan la conversión de T4 en T3. Es el ritual matutino más sencillo y efectivo.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true,
  },
  {
    id: 65,
    nombre: 'Jugo de Apio, Manzana Verde y Espirulina',
    descripcion: 'Para los días que querés un boost de nutrientes de verdad. La espirulina es proteína completa en polvo, el apio desinflamatoria y la manzana verde da el dulzor justo. Un jugo que te llena de energía sin subir el azúcar en sangre.',
    categoria: 'jugo',
    tiempo_preparacion: 5,
    porciones: 1,
    nivel_dificultad: 'facil',
    ingredientes: [
      { cantidad: '4', unidad: 'ramas', nombre: 'apio con hojas' },
      { cantidad: '1', unidad: 'unidad', nombre: 'manzana verde' },
      { cantidad: '1', unidad: 'puñado', nombre: 'espinaca' },
      { cantidad: '1', unidad: 'cdita', nombre: 'espirulina en polvo' },
      { cantidad: '1/2', unidad: 'unidad', nombre: 'limón (jugo)' },
      { cantidad: '1/2', unidad: 'taza', nombre: 'agua fría' },
    ],
    pasos: [
      { numero: 1, descripcion: 'Lavás el apio, la manzana y la espinaca. Cortás en trozos. Retirás las semillas de la manzana.' },
      { numero: 2, descripcion: 'Licuás todo con el agua y el limón a velocidad máxima 1-2 minutos.' },
      { numero: 3, descripcion: 'Agregás la espirulina al final y mezclás con cuchara (no volvés a licuar para no destruir sus nutrientes con el calor de las cuchillas). Tomás de inmediato.' },
    ],
    tip_nutricional: 'La espirulina es uno de los alimentos más densos en nutrientes: 60-70% proteína completa, hierro, vitamina B12 y betacaroteno. Para hipotiroidismo, su contenido de tirosina apoya la síntesis hormonal. IMPORTANTE: elegir espirulina certificada libre de metales pesados y sin yodo añadido. Empezar con 1/4 cdita e ir aumentando gradualmente.',
    apta_hipo: true, apta_hiper: false, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true,
  },
];

// ── 5 probióticos/suplementos (IDs 56-60) ────────────────────────────────────

const probioticos = [
  {
    id: 56,
    nombre: 'Kéfir de agua o leche de coco',
    categoria: 'verde',
    descripcion: 'Bebida fermentada con billones de bacterias beneficiosas. El kéfir de agua es la opción sin lácteos ideal para Hashimoto.',
    razon_tiroides: 'Los probióticos del kéfir reparan la mucosa intestinal y reducen la permeabilidad intestinal asociada al hipotiroidismo autoinmune. Estudios muestran que una microbiota equilibrada se asocia con menor título de anticuerpos anti-TPO.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    reemplazo_sugerido: null,
  },
  {
    id: 57,
    nombre: 'Chucrut casero (repollo fermentado)',
    categoria: 'verde',
    descripcion: 'El fermentado más económico y fácil de hacer en casa. Solo repollo y sal. Rico en lactobacilos naturales.',
    razon_tiroides: 'El chucrut casero (no pasteurizado) aporta lactobacilos vivos que colonizan el intestino y reducen la inflamación sistémica. Para Hashimoto, 1-2 cucharadas por día con el almuerzo puede marcar una diferencia real en los niveles de inflamación.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    reemplazo_sugerido: null,
  },
  {
    id: 58,
    nombre: 'Yogur natural entero sin azúcar',
    categoria: 'verde',
    descripcion: 'Fuente clásica de probióticos. Elegir siempre sin azúcar añadida y con cultivos vivos activos.',
    razon_tiroides: 'Los Lactobacillus y Bifidobacterium del yogur natural contribuyen al equilibrio de la microbiota intestinal. Para Hashimoto, preferir yogur de cabra u oveja por su menor contenido de caseína A1.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    reemplazo_sugerido: 'Para Hashimoto con sensibilidad láctea: kéfir de agua o yogur de coco fermentado',
  },
  {
    id: 59,
    nombre: 'Kombucha sin azúcar',
    categoria: 'verde',
    descripcion: 'Té fermentado con cultivo SCOBY. Efervescente, ácido y probiótico. Elegir las versiones con bajo contenido de azúcar residual.',
    razon_tiroides: 'Aporta ácidos orgánicos y probióticos que apoyan la salud intestinal. Para hipertiroidismo, elegir las versiones sin té negro (sin cafeína) para evitar estimulantes.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    reemplazo_sugerido: null,
  },
  {
    id: 60,
    nombre: 'Citrato de magnesio',
    categoria: 'verde',
    descripcion: 'El suplemento más recomendado en nutrición funcional para tiroides. Calma el sistema nervioso y apoya la conversión T4/T3.',
    razon_tiroides: 'El magnesio es cofactor en más de 300 reacciones enzimáticas. En hipotiroidismo, la deficiencia de magnesio es muy común y genera síntomas como ansiedad, calambres y dificultad para dormir. El citrato de magnesio es la forma más biodisponible. SIEMPRE consultar dosis con tu médico.',
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    reemplazo_sugerido: null,
  },
];

// ── Escribir ──────────────────────────────────────────────────────────────────

const recetas = JSON.parse(fs.readFileSync(recetasPath, 'utf-8'));
const yaExistenJugos = recetas.some(r => r.id === 61);
if (!yaExistenJugos) {
  fs.writeFileSync(recetasPath, JSON.stringify([...recetas, ...jugos], null, 2), 'utf-8');
  console.log(`✅  Agregadas ${jugos.length} recetas de jugos (IDs 61-65)`);
} else {
  console.log('ℹ️   Las recetas de jugos ya existen, saltando');
}

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { readFileSync: rfs, writeFileSync: wfs } = fs;

const alimentos = JSON.parse(rfs(alimentosPath, 'utf-8'));
const yaExistenProbioticos = alimentos.some(a => a.id === 56);
if (!yaExistenProbioticos) {
  wfs(alimentosPath, JSON.stringify([...alimentos, ...probioticos], null, 2), 'utf-8');
  console.log(`✅  Agregados ${probioticos.length} probióticos a alimentos (IDs 56-60)`);
} else {
  console.log('ℹ️   Los probióticos ya existen, saltando');
}
