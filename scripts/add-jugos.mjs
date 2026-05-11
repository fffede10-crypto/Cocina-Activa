import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'data', 'recetas.json');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const jugos = [
  {
    id: 61,
    nombre: "Jugo Verde Clásico para Tiroides",
    descripcion: "El clásico jugo verde que cuida tu tiroides. Espinaca, pepino, apio y limón — depurativo, antiinflamatorio, listo en 5 minutos. Ideal para empezar el día.",
    categoria: "jugo",
    tiempo_preparacion: 5,
    porciones: 1,
    nivel_dificultad: "facil",
    ingredientes: [
      { cantidad: "1", unidad: "puñado", nombre: "espinaca fresca" },
      { cantidad: "1/2", unidad: "unidad", nombre: "pepino" },
      { cantidad: "2", unidad: "tallos", nombre: "apio" },
      { cantidad: "1", unidad: "unidad", nombre: "limón (jugo)" },
      { cantidad: "1", unidad: "vaso", nombre: "agua fría" },
      { cantidad: "1", unidad: "cdita", nombre: "jengibre fresco rallado" }
    ],
    pasos: [
      { numero: 1, descripcion: "Lavás bien la espinaca y el pepino." },
      { numero: 2, descripcion: "Cortás en trozos el pepino y el apio." },
      { numero: 3, descripcion: "Licuás todo junto con el agua fría y el jugo de limón." },
      { numero: 4, descripcion: "Colás si preferís y tomás enseguida." }
    ],
    tip_nutricional: "La espinaca aporta hierro y folato esenciales para la función tiroidea. El pepino hidrata y tiene efecto antiinflamatorio. El limón favorece la absorción del hierro.",
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true
  },
  {
    id: 62,
    nombre: "Jugo Antiinflamatorio de Remolacha y Jengibre",
    descripcion: "Profundamente antiinflamatorio. La remolacha mejora la circulación y aporta betaína, el jengibre baja la inflamación. Color intenso, sabor dulce y picante.",
    categoria: "jugo",
    tiempo_preparacion: 8,
    porciones: 1,
    nivel_dificultad: "facil",
    ingredientes: [
      { cantidad: "1", unidad: "unidad", nombre: "remolacha mediana cruda" },
      { cantidad: "2", unidad: "unidades", nombre: "zanahorias" },
      { cantidad: "1", unidad: "unidad", nombre: "manzana verde" },
      { cantidad: "2", unidad: "cm", nombre: "jengibre fresco" },
      { cantidad: "1", unidad: "unidad", nombre: "limón (jugo)" }
    ],
    pasos: [
      { numero: 1, descripcion: "Pelás la remolacha y las zanahorias, cortás en trozos." },
      { numero: 2, descripcion: "Pasás por la licuadora o extractor con el jengibre y la manzana." },
      { numero: 3, descripcion: "Agregás el jugo de limón, revolvés y tomás enseguida." }
    ],
    tip_nutricional: "La remolacha contiene betaína que favorece la metilación, proceso clave en Hashimoto. El jengibre inhibe la producción de citoquinas proinflamatorias. Tomalo con el estómago vacío para mejor absorción.",
    apta_hipo: true, apta_hiper: false, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true
  },
  {
    id: 63,
    nombre: "Batido de Mango, Cúrcuma y Leche de Coco",
    descripcion: "Cremoso, tropical y antiinflamatorio. La cúrcuma con pimienta negra es la combinación más poderosa para reducir la inflamación. Sabe a verano.",
    categoria: "jugo",
    tiempo_preparacion: 5,
    porciones: 1,
    nivel_dificultad: "facil",
    ingredientes: [
      { cantidad: "1", unidad: "taza", nombre: "mango maduro en cubos" },
      { cantidad: "200", unidad: "ml", nombre: "leche de coco" },
      { cantidad: "1", unidad: "cdita", nombre: "cúrcuma en polvo" },
      { cantidad: "1", unidad: "pizca", nombre: "pimienta negra molida" },
      { cantidad: "1", unidad: "cdita", nombre: "miel pura (opcional)" },
      { cantidad: "4", unidad: "cubos", nombre: "hielo" }
    ],
    pasos: [
      { numero: 1, descripcion: "Ponés todos los ingredientes en la licuadora." },
      { numero: 2, descripcion: "Licuás hasta obtener una textura cremosa y pareja." },
      { numero: 3, descripcion: "Servís con hielo extra si querés más fresco." }
    ],
    tip_nutricional: "La curcumina de la cúrcuma es el antiinflamatorio natural más estudiado para enfermedades autoinmunes como Hashimoto. La pimienta negra multiplica su absorción 20 veces. El mango aporta vitamina C que apoya la producción de hormonas tiroideas.",
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true
  },
  {
    id: 64,
    nombre: "Agua con Limón y Cúrcuma",
    descripcion: "El ritual matutino definitivo para tu tiroides. Solo 3 ingredientes, 3 minutos, y arrancás el día con el sistema digestivo activado y la inflamación a raya.",
    categoria: "jugo",
    tiempo_preparacion: 3,
    porciones: 1,
    nivel_dificultad: "facil",
    ingredientes: [
      { cantidad: "250", unidad: "ml", nombre: "agua tibia" },
      { cantidad: "1/2", unidad: "unidad", nombre: "limón (jugo)" },
      { cantidad: "1/4", unidad: "cdita", nombre: "cúrcuma en polvo" },
      { cantidad: "1", unidad: "pizca", nombre: "pimienta negra molida" }
    ],
    pasos: [
      { numero: 1, descripcion: "Calentás el agua a temperatura tibia (no hirviendo)." },
      { numero: 2, descripcion: "Exprimís el limón y agregás al agua." },
      { numero: 3, descripcion: "Disolvés la cúrcuma con la pizca de pimienta." },
      { numero: 4, descripcion: "Tomás en ayunas, 30 minutos antes de desayunar." }
    ],
    tip_nutricional: "Tomado en ayunas, el limón estimula la producción de bilis y el vaciado del hígado. La cúrcuma con pimienta activa la curcumina antes de que llegue algo de comida que interfiera con su absorción. Ideal antes de tomar la medicación tiroidea.",
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true
  },
  {
    id: 65,
    nombre: "Licuado de Semillas de Chía y Frutas Rojas",
    descripcion: "Espeso, nutritivo y antiinflamatorio. Las semillas de chía aportan omega-3, las frutas rojas antioxidantes. Una combinación ganadora para la tiroides.",
    categoria: "jugo",
    tiempo_preparacion: 8,
    porciones: 1,
    nivel_dificultad: "facil",
    ingredientes: [
      { cantidad: "1", unidad: "taza", nombre: "leche de almendras sin azúcar" },
      { cantidad: "1/2", unidad: "taza", nombre: "frutillas frescas o congeladas" },
      { cantidad: "1/2", unidad: "taza", nombre: "arándanos" },
      { cantidad: "2", unidad: "cdas", nombre: "semillas de chía" },
      { cantidad: "1", unidad: "unidad", nombre: "banana mediana" },
      { cantidad: "1", unidad: "cdita", nombre: "miel pura (opcional)" }
    ],
    pasos: [
      { numero: 1, descripcion: "Hidratás las semillas de chía en la leche de almendras durante 5 minutos." },
      { numero: 2, descripcion: "Agregás las frutas rojas y la banana en la licuadora." },
      { numero: 3, descripcion: "Vertís la leche con chía y licuás hasta lograr cremosidad." },
      { numero: 4, descripcion: "Tomás enseguida o guardás hasta 24hs en la heladera." }
    ],
    tip_nutricional: "Las semillas de chía son fuente vegetal de omega-3 ALA, que el cuerpo convierte parcialmente en EPA/DHA antiinflamatorios. Las frutas rojas tienen antocianinas que protegen la glándula tiroidea del daño oxidativo. Alto contenido de fibra soluble que alimenta la microbiota intestinal.",
    apta_hipo: true, apta_hiper: true, apta_hashimoto: true,
    sin_gluten: true, sin_lacteos: true, sin_soja: true, sin_azucar: true, vegetariana: true
  }
];

data.push(...jugos);
writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Total recetas:', data.length);
console.log('Nuevos IDs:', data.slice(-5).map(r => r.id).join(', '));
