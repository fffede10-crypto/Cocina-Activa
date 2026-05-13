'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const CHECKOUT_URL = 'https://agoraeducacion.store/cart/53159708557591:1';
const DIAS_SEMANA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

const COMPRAS_RECIENTES = [
  { nombre: 'María Elena', ciudad: 'Buenos Aires', condicion: 'Hipotiroidismo' },
  { nombre: 'Claudia', ciudad: 'Córdoba', condicion: 'Hashimoto' },
  { nombre: 'Patricia', ciudad: 'Rosario', condicion: 'Hipertiroidismo' },
  { nombre: 'Valeria', ciudad: 'Mendoza', condicion: 'Hashimoto' },
  { nombre: 'Gabriela', ciudad: 'Tucumán', condicion: 'Hipotiroidismo' },
  { nombre: 'Laura', ciudad: 'Mar del Plata', condicion: 'Hashimoto' },
];

const FAQ_ITEMS = [
  {
    q: '¿Por cuánto tiempo tengo acceso a la plataforma?',
    a: 'Tenés acceso vitalicio. Pagás una sola vez y accedés para siempre desde cualquier dispositivo. Sin cuotas, sin renovaciones, sin sorpresas.',
  },
  {
    q: '¿Cómo accedo después de comprar?',
    a: 'Después de tu compra, nos escribís por WhatsApp con tu nombre y email. En menos de 5 minutos te mandamos el link de la plataforma con tus credenciales de acceso.',
  },
  {
    q: '¿Qué pasa si necesito ayuda?',
    a: 'Respondemos todos los mensajes por WhatsApp. Estamos para acompañarte en todo el proceso.',
  },
  {
    q: '¿Las recetas sirven para toda la familia?',
    a: 'Sí. Están pensadas para que toda la familia las disfrute — no tienen que saber que son "recetas para tiroides". Platos ricos, simples y con ingredientes de supermercado.',
  },
  {
    q: '¿Necesito saber cocinar para usar la plataforma?',
    a: 'Para nada. Cada receta tiene el paso a paso detallado con tiempos exactos. Si sabés hervir agua, podés hacer estas recetas.',
  },
];

const DOLORES = [
  {
    emoji: '😩',
    titulo: 'Te diagnosticaron hipotiroidismo, Hashimoto o hipertiroidismo',
    desc: 'y nadie te explicó qué podés comer y qué no. Saliste del consultorio con la receta pero sin un plan.',
  },
  {
    emoji: '🔍',
    titulo: 'Buscás en Google y cada página dice algo distinto.',
    desc: '¿El brócoli hace mal? ¿Podés comer gluten? ¿La soja afecta? La confusión te paraliza.',
  },
  {
    emoji: '⚖️',
    titulo: 'El peso te sube sin freno',
    desc: 'aunque comés poco y hacés todo bien. Porque ninguna dieta que probaste fue pensada para tu condición tiroidea.',
  },
  {
    emoji: '😴',
    titulo: 'Estás agotada todo el día',
    desc: 'aunque dormiste 8 horas. Y tu entorno no entiende porque "tus análisis están bien".',
  },
  {
    emoji: '😞',
    titulo: 'Sentís que comer para la tiroides es aburrido',
    desc: '— pollo hervido y verdura todos los días. Y terminás comiendo lo de siempre porque no sabés qué más preparar.',
  },
  {
    emoji: '💸',
    titulo: 'Gastaste en endocrinólogos, nutricionistas y suplementos',
    desc: 'pero nadie te dio un plan de comidas concreto, rico y fácil de seguir para tu tiroides o tu Hashimoto.',
  },
];

const INCLUYE = [
  { item: '65 Recetas Organizadas', desc: 'Desayunos, almuerzos, cenas, postres y jugos verdes para hipo, hiper y Hashimoto', valor: '$25.000' },
  { item: 'Filtros por tu Condición', desc: 'Las recetas aptas para vos aparecen primero — hipotiroidismo, Hashimoto o hipertiroidismo', valor: '$10.000' },
  { item: 'Guía de Alimentos Verde/Amarillo/Rojo', desc: 'Qué comer, qué moderar y qué evitar, con la razón nutricional específica para tu tiroides', valor: '$15.000' },
  { item: 'Lista de Compras Inteligente', desc: 'Agregás ingredientes con un clic desde la receta, agrupados por receta y listos para compartir por WhatsApp', valor: '$8.000' },
  { item: 'Jugos Verdes Antiinflamatorios', desc: '5 jugos especiales para la tiroides, incluyendo agua de limón con cúrcuma y el jugo verde clásico', valor: '$8.000' },
  { item: 'Receta del Día Personalizada', desc: 'Cada día una receta diferente con un mensaje motivacional según tu condición y síntomas', valor: '$5.000' },
  { item: 'Acceso Vitalicio desde cualquier dispositivo', desc: 'Pagás una sola vez y accedés para siempre. Sin suscripciones, sin renovaciones.', valor: '$15.000' },
];

const RESULTADOS = [
  { emoji: '⚡', titulo: 'Más energía real', desc: 'Dejás de andar agotada. Cada comida está pensada para darte vitalidad desde el primer bocado.' },
  { emoji: '⚖️', titulo: 'Metabolismo activo', desc: 'Recetas con selenio, zinc y yodo moderado que apoyan la función tiroidea y el metabolismo.' },
  { emoji: '💧', titulo: 'Menos hinchazón', desc: 'Ingredientes antiinflamatorios que reducen la retención de líquidos característica del hipotiroidismo.' },
  { emoji: '💇', titulo: 'Cabello más fuerte', desc: 'Zinc, biotina y proteínas de calidad en cada receta para apoyar la salud del cabello.' },
  { emoji: '🧠', titulo: 'Más claridad mental', desc: 'Omega-3 y antioxidantes que reducen la niebla mental asociada al hipotiroidismo y Hashimoto.' },
  { emoji: '😋', titulo: 'Comés rico sin culpa', desc: 'Se terminaron las comidas aburridas. Platos que tu familia también va a querer repetir.' },
];

const TESTIMONIOS = [
  {
    texto: '"Hace 3 semanas que uso la plataforma y la diferencia es impresionante. Mis valores de TSH mejoraron y mi endocrinóloga me preguntó qué había cambiado. Los desayunos con avena y semillas de calabaza se transformaron en mi ritual de cada mañana. ¡Por fin algo que funciona y encima es rico!"',
    nombre: 'María Elena G.',
    ciudad: 'Buenos Aires',
    condicion: 'Hipotiroidismo',
    inicial: 'M',
  },
  {
    texto: '"Tengo hipertiroidismo y encontrar postres que pudiera comer sin sentirme mal era misión imposible. Probé la torta de banana con harina de almendras y no lo podía creer: riquísima y sin un solo ingrediente que me haga mal. Mi familia ni se dio cuenta de la diferencia."',
    nombre: 'Claudia F.',
    ciudad: 'Córdoba',
    condicion: 'Hipertiroidismo',
    inicial: 'C',
  },
  {
    texto: '"Lo que más me gustó es que las recetas usan ingredientes que consigo en cualquier supermercado. No tuve que comprar nada raro ni gastar de más. En un mes bajé 3 kilos sin hacer dieta, solo siguiendo las recetas del almuerzo y la cena."',
    nombre: 'Patricia M.',
    ciudad: 'Rosario',
    condicion: 'Hashimoto',
    inicial: 'P',
  },
];


const slides = [
  {
    img: '/screenshots/dashboard-accesos.jpg',
    titulo: 'Tu dashboard personalizado',
    descripcion: 'Receta del día según tu condición y accesos rápidos.',
  },
  {
    img: '/screenshots/recetas-grid.jpg',
    titulo: 'Ritual de mañana',
    descripcion: 'Agua con cúrcuma, jugo verde y accesos en un toque.',
  },
  {
    img: '/screenshots/receta-del-dia.jpg',
    titulo: 'Receta del día con imagen real',
    descripcion: 'Foto apetitosa y mensaje personalizado para tu tiroides.',
  },
  {
    img: '/screenshots/receta-ingredientes.jpg',
    titulo: 'Ingredientes con un toque a la lista',
    descripcion: 'Tocás "+" y el ingrediente va directo a tu lista de compras.',
  },
  {
    img: '/screenshots/receta-pasos.jpg',
    titulo: 'Paso a paso y tip nutricional',
    descripcion: 'Instrucciones detalladas y tip específico para tu condición.',
  },
  {
    img: '/screenshots/guia-alimentos.jpg',
    titulo: 'Guía verde / amarillo / rojo',
    descripcion: 'Qué comer, qué moderar y qué evitar para tu tiroides.',
  },
];

const PASOS = [
  { num: '1', titulo: 'Comprás el acceso', desc: 'Pago único seguro. Sin suscripciones.' },
  { num: '2', titulo: 'Nos escribís por WhatsApp', desc: 'Con tu nombre y email para activar tu cuenta.' },
  { num: '3', titulo: 'Recibís tus credenciales', desc: 'Te mandamos el acceso en menos de 5 minutos.' },
  { num: '4', titulo: 'Ingresás y empezás', desc: 'Completás tu perfil y accedés a las 65 recetas personalizadas.' },
];

function handleClickCompra() {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_name: 'Tiroides Activa',
      currency: 'ARS',
      value: 19999,
      num_items: 1,
    });
  }
  window.open(CHECKOUT_URL, '_blank');
}

function CTAButton({ text, className = '' }: { text: string; className?: string }) {
  return (
    <button
      onClick={handleClickCompra}
      className={`inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
}

function TrustRow({ dark = false }: { dark?: boolean }) {
  const text = dark ? 'text-white/70' : 'text-stone-500';
  const stars = dark ? 'text-yellow-400' : 'text-yellow-500';
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-sm">
      <span className={`flex items-center gap-1 font-semibold ${stars}`}>
        ★★★★★ <span className={`font-normal ${text}`}>4.9/5 — opiniones verificadas</span>
      </span>
      <span className={text}>🛡️ Garantía de 60 Días — Riesgo cero</span>
    </div>
  );
}

export default function LandingPage() {
  const [minutos, setMinutos] = useState(28);
  const [segundos, setSegundos] = useState(47);
  const [hoyMayus, setHoyMayus] = useState('HOY');
  const [faqAbierto, setFaqAbierto] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ nombre: string; ciudad: string; condicion: string; hace: number } | null>(null);
  const [slideActivo, setSlideActivo] = useState(0);

  useEffect(() => {
    const dia = DIAS_SEMANA[new Date().getDay()];
    setHoyMayus((dia.charAt(0).toUpperCase() + dia.slice(1)).toUpperCase());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundos(prev => {
        if (prev === 0) {
          setMinutos(m => {
            if (m === 0) return 28;
            return m - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mostrar = () => {
      const compra = COMPRAS_RECIENTES[Math.floor(Math.random() * COMPRAS_RECIENTES.length)];
      const hace = Math.floor(Math.random() * 8) + 1;
      setPopup({ ...compra, hace });
      setTimeout(() => setPopup(null), 4500);
    };

    const t1 = setTimeout(mostrar, 8000);
    const interval = setInterval(mostrar, 45000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Tiroides Activa — Landing Page',
        content_category: 'Health & Wellness',
        currency: 'ARS',
        value: 19999,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActivo(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [slideActivo]);

  return (
    <div className="font-sans text-stone-900 overflow-x-hidden">

      {/* ===== 0. BARRA STICKY MARQUEE ===== */}
      <div className="sticky top-0 z-50 bg-[#1B4332] overflow-hidden py-2.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-8 px-6 flex-shrink-0">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                🔥 <span className="text-orange-400 font-bold">75% OFF</span> + bonos de regalo
              </span>
              <span className="text-white text-sm font-medium flex items-center gap-2">
                ⏱️ La oferta termina en
                <span className="bg-orange-500 text-white font-bold px-2.5 py-0.5 rounded text-sm min-w-[58px] text-center tabular-nums">
                  {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
                </span>
              </span>
              <span className="text-white text-sm font-medium">⚡ Acceso inmediato a la plataforma</span>
              <span className="text-white text-sm font-medium">🛡️ Garantía 7 días sin preguntas</span>
              <span className="text-green-300 text-sm font-medium">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 1. HERO ===== */}
      <section className="bg-[#1B4332] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
            🌿 La primera plataforma argentina para tiroides
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
            ¿Cansada de tomar la pastilla y<br />
            seguir{' '}
            <span className="text-orange-400">igual</span>{' '}
            de agotada,<br />
            hinchada y sin poder bajar de peso?
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tiroides Activa es la plataforma con 65 recetas argentinas organizadas
            para tu condición — hipotiroidismo, Hashimoto o hipertiroidismo.
            Con ingredientes de tu verdulería, filtros personalizados y
            lista de compras con un clic.
          </p>

          <div className="max-w-2xl mx-auto my-8 px-4">
            <Image
              src="/mockup-plataforma.png"
              alt="Tiroides Activa — plataforma de recetas"
              width={800}
              height={500}
              className="w-full drop-shadow-2xl rounded-xl"
              priority
            />
          </div>

          <button
            onClick={() => document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            🌿 Quiero acceder a la plataforma →
          </button>
          <TrustRow dark />
        </div>
      </section>

      {/* ===== 2. SOCIAL PROOF BAR ===== */}
      <section className="bg-[#0f2b1f] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center divide-x divide-white/20">
          <div>
            <p className="font-serif text-4xl md:text-5xl font-bold text-orange-400">+500</p>
            <p className="text-white/60 text-sm mt-1 leading-snug">mujeres<br />que ya<br />accedieron</p>
          </div>
          <div>
            <p className="font-serif text-4xl md:text-5xl font-bold text-orange-400">65</p>
            <p className="text-white/60 text-sm mt-1 leading-snug">recetas<br />organizadas</p>
          </div>
          <div>
            <p className="font-serif text-4xl md:text-5xl font-bold text-orange-400">4.9★</p>
            <p className="text-white/60 text-sm mt-1 leading-snug">calificación<br />promedio</p>
          </div>
        </div>
      </section>

      {/* ===== 3. DOLORES ===== */}
      <section className="bg-[#FAFAF7] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">¿Te identificás con esto?</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 leading-snug">
              Tu médico te dijo "cuidá la alimentación"...<br />
              pero no te explicó qué comer exactamente
            </h2>
          </div>
          <div className="space-y-4">
            {DOLORES.map((d, i) => (
              <div key={i} className="bg-white border-l-4 border-orange-500 rounded-xl p-5 shadow-sm">
                <p className="font-semibold text-stone-900">
                  <span className="mr-2">{d.emoji}</span>
                  {d.titulo}
                </p>
                <p className="text-stone-600 mt-1 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. SOLUCIÓN ===== */}
      <section className="bg-[#F0FDF4] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">La solución que estabas buscando</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 leading-snug text-[#1B4332]">
              Una plataforma organizada de recetas{' '}
              <em className="not-italic text-orange-500">diseñadas específicamente</em>{' '}
              para tu tiroides
            </h2>
            <p className="text-stone-600 mt-4 max-w-xl mx-auto leading-relaxed">
              Tiroides Activa no es otro PDF que vas a bajar y nunca abrir.
              Es una plataforma con 65 recetas argentinas, filtradas por tu condición,
              con ingredientes que conseguís en cualquier verdulería.
            </p>
          </div>

        </div>
      </section>

      {/* SECCIÓN MOCKUPS 3D */}
      <section className="py-16 px-5 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <p className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-3 text-center">
            🎁 BONOS EXCLUSIVOS
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] text-center mb-3 leading-tight">
            Comprando hoy te llevás todo esto
          </h2>
          <p className="text-[#57534E] text-center text-base mb-4 leading-relaxed">
            Todo incluido en tu acceso vitalicio — sin costos adicionales
          </p>

          {/* Badge solo en plan completo */}
          <div className="flex justify-center mb-10">
            <span className="bg-[#1B4332] text-white text-xs font-bold px-4 py-2 rounded-full">
              🌿 Todo incluido en el acceso
            </span>
          </div>

          {/* MOCKUP PRINCIPAL — 65 Recetas (destacado, ancho completo) */}
          <div className="mb-6">
            <div className="relative group">
              <Image
                src="/mockups/mockup-recetas.png"
                alt="65 Recetas para Tiroides — incluido en tu acceso"
                width={800}
                height={500}
                className="w-full rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="mt-3 text-center">
                <p className="font-semibold text-[#1B4332] text-lg">65 Recetas para Tiroides</p>
                <p className="text-[#57534E] text-sm">Desayunos, almuerzos, cenas, postres y jugos organizados para tu condición</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[#57534E] text-sm line-through">Valor: $25.000</span>
                  <span className="bg-[#1B4332] text-white text-xs px-2 py-0.5 rounded-full font-bold">HOY GRATIS</span>
                </div>
              </div>
            </div>
          </div>

          {/* GRID 2x2 — Guía alimentos + Jugos + Lista + Receta del día */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              {
                img: '/mockups/mockup-guia-alimentos.png',
                alt: 'Guía de Alimentos Verde Amarillo Rojo',
                titulo: 'Guía de Alimentos',
                desc: 'Verde, amarillo y rojo para tu condición',
                valor: '$15.000',
              },
              {
                img: '/mockups/mockup-jugos.png',
                alt: 'Jugos Verdes Antiinflamatorios — Bono 1',
                titulo: 'Jugos Verdes',
                desc: '5 jugos especiales para la tiroides',
                valor: '$8.000',
              },
              {
                img: '/mockups/mockup-lista-compras.png',
                alt: 'Lista de Compras Inteligente — Bono 2',
                titulo: 'Lista de Compras',
                desc: 'Organizá tu semana con un toque',
                valor: '$8.000',
              },
              {
                img: '/mockups/mockup-receta-dia.png',
                alt: 'Receta del Día Personalizada — Bono 3',
                titulo: 'Receta del Día',
                desc: 'Personalizada para tu condición',
                valor: '$5.000',
              },
            ].map(item => (
              <div key={item.titulo} className="group">
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full rounded-xl shadow-md group-hover:scale-[1.03] transition-transform duration-300"
                />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-[#1B4332] text-sm">{item.titulo}</p>
                  <p className="text-[#57534E] text-xs">{item.desc}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-[#57534E] text-xs line-through">{item.valor}</span>
                    <span className="bg-[#1B4332] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">GRATIS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GRID 2 mockups finales — Ritual + Intestino */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              {
                img: '/mockups/mockup-ritual.png',
                alt: 'Ritual de Mañana — Bono 4',
                titulo: 'Ritual de Mañana',
                desc: 'Agua con cúrcuma, jugo verde y probiótico',
                valor: '$5.000',
              },
              {
                img: '/mockups/mockup-intestino.png',
                alt: 'Guía del Intestino — Bono 5',
                titulo: 'Guía del Intestino',
                desc: 'Probióticos y permeabilidad intestinal',
                valor: '$5.000',
              },
            ].map(item => (
              <div key={item.titulo} className="group">
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full rounded-xl shadow-md group-hover:scale-[1.03] transition-transform duration-300"
                />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-[#1B4332] text-sm">{item.titulo}</p>
                  <p className="text-[#57534E] text-xs">{item.desc}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-[#57534E] text-xs line-through">{item.valor}</span>
                    <span className="bg-[#1B4332] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">GRATIS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VALOR TOTAL */}
          <div className="bg-white border border-[#E7E5E4] rounded-2xl p-6 text-center mb-8 shadow-sm">
            <p className="text-[#57534E] text-sm mb-1">Valor total de todo lo que recibís</p>
            <p className="text-[#57534E] text-lg line-through mb-1">$71.000</p>
            <p className="font-serif text-4xl text-[#1B4332] font-bold">
              Hoy: <span className="text-[#F97316]">$19.999</span>
            </p>
            <p className="text-[#57534E] text-xs mt-2">
              Acceso vitalicio · Sin suscripciones · Actualizaciones gratuitas incluidas
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-orange-200"
            >
              🌿 Quiero acceder con todo incluido →
            </button>
          </div>

        </div>
      </section>

      {/* ===== 6. RESULTADOS ===== */}
      <section className="bg-green-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Lo que vas a lograr</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3">
              ¿Qué cambia cuando comés bien para tu tiroides?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESULTADOS.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                <p className="text-2xl mb-2">{r.emoji}</p>
                <p className="font-bold text-stone-900 mb-1">{r.titulo}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== 7. CÓMO FUNCIONA ===== */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Cómo accedés a la plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PASOS.map((paso, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {paso.num}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{paso.titulo}</p>
                  <p className="text-stone-600 text-sm mt-0.5">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== 8. SLIDER — así se ve la plataforma ===== */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-3 text-center">
            Así se ve por dentro
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] text-center mb-3 leading-tight">
            Una plataforma real, no un PDF
          </h2>
          <p className="text-stone-500 text-center text-base mb-10 leading-relaxed">
            Navegá por las pantallas y conocé todo lo que tenés disponible desde el primer día.
          </p>

          {/* Frame de celular */}
          <div className="max-w-[300px] mx-auto">
            <div className="bg-[#1B4332] rounded-t-3xl px-4 py-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-green-300 font-medium">Tiroides Activa</span>
              <div className="w-12" />
            </div>

            <div className="border-x-2 border-[#1B4332] overflow-hidden bg-[#FAFAF7]" style={{ minHeight: '520px' }}>
              <Image
                key={slideActivo}
                src={slides[slideActivo].img}
                alt={slides[slideActivo].titulo}
                width={300}
                height={560}
                className="w-full transition-opacity duration-300"
              />
            </div>

            <div className="bg-[#1B4332] rounded-b-3xl px-4 py-3 flex items-center justify-center gap-6">
              {['🏠', '📖', '✨', '⭐', '🛒', '👤'].map((icon, i) => (
                <span key={i} className="text-lg opacity-70">{icon}</span>
              ))}
            </div>
          </div>

          {/* Descripción del slide */}
          <div className="mt-6 text-center max-w-xs mx-auto min-h-[72px]">
            <p className="font-semibold text-[#1B4332] text-base mb-1">{slides[slideActivo].titulo}</p>
            <p className="text-stone-500 text-sm leading-relaxed">{slides[slideActivo].descripcion}</p>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideActivo(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === slideActivo
                    ? 'w-6 h-2.5 bg-[#1B4332]'
                    : 'w-2.5 h-2.5 bg-green-100 hover:bg-green-300'
                }`}
                aria-label={`Ver pantalla ${i + 1}`}
              />
            ))}
          </div>

          {/* Flechas */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setSlideActivo(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full border-2 border-[#1B4332] text-[#1B4332] flex items-center justify-center text-lg font-bold hover:bg-[#1B4332] hover:text-white transition-colors"
              aria-label="Anterior"
            >
              ←
            </button>
            <span className="text-sm text-stone-500 tabular-nums">{slideActivo + 1} / {slides.length}</span>
            <button
              onClick={() => setSlideActivo(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full border-2 border-[#1B4332] text-[#1B4332] flex items-center justify-center text-lg font-bold hover:bg-[#1B4332] hover:text-white transition-colors"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              onClick={handleClickCompra}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base px-8 py-4 rounded-full transition-colors shadow-lg shadow-orange-200 cursor-pointer"
            >
              🌿 Quiero acceder a la plataforma →
            </button>
          </div>
        </div>
      </section>

      {/* ===== 10. PRECIO + URGENCIA ===== */}
      <section className="py-16 px-5 bg-[#1B4332]" id="comprar">
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-6">
            <span className="bg-orange-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              🔥 OFERTA ESPECIAL — SOLO POR HOY {hoyMayus}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-3 leading-tight">
            Accedé ahora y empezá a
            <em className="not-italic text-orange-400"> comer bien para tu tiroides</em>
          </h2>
          <p className="text-green-300 text-center text-sm mb-8">
            Tu lugar estará reservado durante los próximos 15 minutos.
            Si no accedés, el descuento pasará a la siguiente persona.
          </p>

          <div className="bg-white/5 border border-white/15 rounded-2xl p-6 mb-6">

            <div className="text-center mb-6">
              <p className="text-green-300 text-sm line-through opacity-70 mb-1">Precio normal: $79.999</p>
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                75% OFF — SOLO HOY {hoyMayus}
              </span>
              <p className="font-serif text-6xl text-white mt-3 leading-none">$19.999</p>
              <p className="text-green-300 text-xs mt-1">ARS · Pago único · Sin suscripciones</p>
            </div>

            <div className="bg-orange-500 rounded-xl p-4 mb-6 text-center">
              <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">
                ⚡ OFERTA HOY {hoyMayus} — Tu lugar reservado por:
              </p>
              <p className="text-white font-bold text-5xl tracking-widest tabular-nums">
                {String(minutos).padStart(2, '0')} : {String(segundos).padStart(2, '0')}
              </p>
              <p className="text-orange-100 text-xs mt-1">Minutos · Segundos</p>
            </div>

            <button
              onClick={handleClickCompra}
              className="w-full bg-[#25D366] hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mb-4 cursor-pointer"
            >
              🌿 Quiero acceder ahora →
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-green-300 mb-4">
              <span>🔒 Compra 100% segura</span>
              <span>·</span>
              <span>⚡ Acceso inmediato</span>
              <span>·</span>
              <span>📱 Desde cualquier dispositivo</span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-green-300 text-xs">Pagás con:</span>
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">💳 Mercado Pago</span>
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">Visa</span>
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">Mastercard</span>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-300">
                <span>✅</span>
                <span>Tu compra incluye <strong className="text-white">futuras actualizaciones gratuitas</strong> dentro de la plataforma</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-300">
                <span>📲</span>
                <span><strong className="text-white">+500 mujeres</strong> ya usan la plataforma y sumando cada día</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-300">
                <span>🔒</span>
                <span>Pago 100% seguro procesado por <strong className="text-white">Mercado Pago</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/15 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">🛡️</p>
            <p className="font-serif text-xl text-white mb-2">Garantía Total de 7 Días</p>
            <p className="text-green-300 text-sm leading-relaxed">
              Si en los primeros 7 días no quedás 100% satisfecha con la plataforma,
              te devolvemos todo el dinero sin preguntas.
              <strong className="text-white"> Es riesgo CERO para vos.</strong>
            </p>
          </div>

        </div>
      </section>

      {/* MURO DE TESTIMONIOS */}
      <section className="py-16 px-5 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <h2 className="font-serif text-3xl text-[#1B4332] text-center mb-3 leading-tight">
            Ellas ya organizaron su alimentación
            con <em className="not-italic text-[#F97316]">Tiroides Activa</em>
          </h2>
          <p className="text-[#57534E] text-center text-sm mb-4">
            Mujeres reales que empezaron a sentirse mejor con recetas simples y organizadas
          </p>

          {/* Estrellas + cantidad */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
            <span className="text-[#57534E] text-sm font-medium">4.9 · 47 reseñas</span>
          </div>

          {/* Grid masonry 2 columnas */}
          <div className="columns-2 gap-3 space-y-3">
            {[
              {
                nombre: 'María Elena G.',
                ciudad: 'Buenos Aires',
                condicion: 'Hipotiroidismo',
                texto: 'Hace 3 semanas que uso la plataforma y la diferencia es impresionante. Mis valores de TSH mejoraron y mi endocrinóloga me preguntó qué había cambiado. Los desayunos con avena y semillas de calabaza se transformaron en mi ritual de cada mañana. ¡Por fin algo que funciona y encima es rico! 🙌',
                foto: '/recetas/receta-1.jpg',
                color: 'bg-amber-50',
              },
              {
                nombre: 'Claudia F.',
                ciudad: 'Córdoba',
                condicion: 'Hashimoto',
                texto: 'Tengo Hashimoto hace 5 años y nunca había encontrado recetas que realmente se adaptaran a mis restricciones. Sin gluten, sin lácteos y encima ricas. Mi familia ni se da cuenta que son "recetas especiales". La guía de alimentos es un golazo. 💚',
                foto: '/recetas/receta-20.jpg',
                color: 'bg-green-50',
              },
              {
                nombre: 'Patricia M.',
                ciudad: 'Rosario',
                condicion: 'Hipotiroidismo',
                texto: 'Lo que más me gustó es que los ingredientes los consigo en cualquier verdulería. No tuve que comprar nada raro ni gastar de más. En un mes bajé 3 kilos sin hacer dieta, solo siguiendo las recetas del almuerzo y la cena. La sopa de lentejas con cúrcuma es mi favorita. 100% recomendada.',
                foto: '/recetas/receta-16.jpg',
                color: 'bg-orange-50',
              },
              {
                nombre: 'Valeria R.',
                ciudad: 'Mendoza',
                condicion: 'Hashimoto',
                texto: 'Estaba agotada de buscar en Google y encontrar información contradictoria. Acá todo está organizado, explicado y con ingredientes argentinos reales. La lista de compras que se genera sola desde las recetas me salvó la semana. ¡Gracias! ✨',
                foto: '/recetas/receta-18.jpg',
                color: 'bg-blue-50',
              },
              {
                nombre: 'Gabriela S.',
                ciudad: 'Tucumán',
                condicion: 'Hipertiroidismo',
                texto: 'Tengo hipertiroidismo y encontrar postres que pueda comer sin sentirme mal era misión imposible. Probé la mousse de chocolate con palta y no lo podía creer: riquísima y sin un solo ingrediente que me haga mal. Mi familia tampoco se dio cuenta de la diferencia. 🍫',
                foto: '/recetas/receta-46.jpg',
                color: 'bg-pink-50',
              },
              {
                nombre: 'Laura B.',
                ciudad: 'Mar del Plata',
                condicion: 'Hipotiroidismo',
                texto: 'La receta del día es lo mejor. Cada mañana ya sé qué voy a cocinar y el mensaje personalizado para mi hipotiroidismo me da contexto de por qué esa receta me hace bien. Es como tener una nutricionista en el bolsillo. Llevo 2 meses y no lo cambio por nada. 💪',
                foto: '/recetas/receta-3.jpg',
                color: 'bg-yellow-50',
              },
              {
                nombre: 'Romina V.',
                ciudad: 'La Plata',
                condicion: 'Hashimoto',
                texto: 'Pensé que iba a ser una plataforma más pero me sorprendió. Los jugos verdes de la mañana se convirtieron en mi hábito y ya noto la diferencia en la energía. El agua con limón y cúrcuma es lo primero que tomo cada día. Muy recomendada para Hashimoto. 🌿',
                foto: '/recetas/receta-61.jpg',
                color: 'bg-emerald-50',
              },
              {
                nombre: 'Daniela C.',
                ciudad: 'Salta',
                condicion: 'Hipotiroidismo',
                texto: 'Me diagnosticaron hipotiroidismo hace 8 meses y estaba perdida con la alimentación. Mi médico solo me daba la receta de Eutirox y nada más. Acá encontré la guía de alimentos que me faltaba. Ya sé qué comer, qué evitar y por qué. Eso no tiene precio. ⭐',
                foto: '/recetas/receta-25.jpg',
                color: 'bg-purple-50',
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`${t.color} rounded-2xl p-4 break-inside-avoid mb-3 border border-white shadow-sm`}
              >
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={t.foto}
                    alt={`Receta de ${t.nombre}`}
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#57534E] text-xs leading-relaxed mb-3 italic">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.nombre[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">{t.nombre}</p>
                    <p className="text-[10px] text-[#57534E]">{t.ciudad} · {t.condicion}</p>
                  </div>
                  <span className="ml-auto text-[10px] text-[#1B4332] font-semibold">✓ Verificada</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA debajo */}
          <div className="text-center mt-10">
            <p className="text-[#57534E] text-sm mb-4">
              Vos también podés empezar hoy 💚
            </p>
            <button
              onClick={() => document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold text-base px-8 py-4 rounded-full transition-colors shadow-lg shadow-orange-200"
            >
              🌿 QUIERO EMPEZAR HOY →
            </button>
          </div>

        </div>
      </section>

      {/* ===== 12. QUÉ INCLUYE TU COMPRA ===== */}
      <section className="bg-[#1B4332] py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { emoji: '📱', titulo: 'Acceso desde celular y computadora', desc: 'Usá la plataforma desde donde estés, cuando quieras.' },
              { emoji: '⚡', titulo: 'Activación en menos de 5 minutos', desc: 'Te mandamos el acceso por WhatsApp inmediatamente.' },
              { emoji: '♾️', titulo: 'Acceso de por vida + actualizaciones', desc: 'El material es tuyo para siempre. Nuevas recetas incluidas sin costo.' },
            ].map((c, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 text-center border border-white/10">
                <p className="text-4xl mb-3">{c.emoji}</p>
                <p className="font-bold mb-1 text-sm">{c.titulo}</p>
                <p className="text-white/60 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <CTAButton text="🌿 QUIERO ACCESO YA →" />
          </div>
        </div>
      </section>

      {/* ===== 13. FAQ ===== */}
      <section className="bg-[#FAFAF7] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-stone-900 hover:bg-stone-50 transition-colors"
                  onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className="text-orange-500 text-xl font-bold ml-4 flex-shrink-0 leading-none">
                    {faqAbierto === i ? '−' : '+'}
                  </span>
                </button>
                {faqAbierto === i && (
                  <div className="px-5 pb-4 pt-2 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 14. CTA FINAL ===== */}
      <section className="bg-[#0f2b1f] py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Empezá a comer bien para tu tiroides hoy
          </h2>
          <p className="text-white/70 text-lg mb-6 leading-relaxed">
            65 recetas argentinas que cuidan tu tiroides.<br />
            Sin riesgo. Acceso inmediato.
          </p>
          <p className="text-white/40 line-through text-sm mb-1">Antes: $79.999</p>
          <p className="font-serif text-5xl font-bold text-orange-400 mb-8">$19.999</p>
          <CTAButton text="🌿 SÍ, QUIERO MIS RECETAS YA →" />
          <TrustRow dark />
        </div>
      </section>

      {/* ===== 15. FOOTER ===== */}
      <footer className="bg-[#0a1e14] py-8 px-4 text-center text-stone-500 text-xs">
        <p className="mb-2 font-medium">© 2026 Tiroides Activa — Todos los derechos reservados.</p>
        <p className="max-w-xl mx-auto leading-relaxed">
          El contenido de esta plataforma es de carácter informativo y educativo.
          No reemplaza el consejo médico profesional. Consultá con tu médico antes de realizar
          cambios en tu alimentación.
        </p>
      </footer>

      {/* ===== POPUP COMPRA RECIENTE ===== */}
      {popup && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '16px',
            background: '#fff',
            border: '1px solid #E7E5E4',
            borderLeft: '4px solid #1B4332',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,.12)',
            zIndex: 999,
            maxWidth: '280px',
            animation: 'slideIn .3s ease',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#1B4332', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}
            >
              {popup.nombre[0]}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', margin: 0 }}>
                {popup.nombre} de {popup.ciudad}
              </p>
              <p style={{ fontSize: 12, color: '#57534E', margin: 0 }}>
                Accedió hace {popup.hace} min · {popup.condicion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
