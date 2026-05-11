import { CondicionTiroidea } from '@/types';

const BADGE_CONDICION: Record<string, { label: string; color: string }> = {
  hipotiroidismo: { label: 'Hipotiroidismo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  hipertiroidismo: { label: 'Hipertiroidismo', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  hashimoto: { label: 'Hashimoto', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  sin_diagnostico: { label: 'Sin diagnóstico', color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' },
};

export function getBadgeCondicion(condicion: string | null) {
  if (!condicion) return BADGE_CONDICION['sin_diagnostico'];
  return BADGE_CONDICION[condicion] || BADGE_CONDICION['sin_diagnostico'];
}

export function getMensajePersonalizado(
  condicion: CondicionTiroidea | null,
  sintomas: string[]
): string {
  const mensajes: Record<string, Record<string, string>> = {
    hipotiroidismo: {
      cansancio: 'Esta receta aporta selenio y zinc que apoyan la función tiroidea y pueden ayudarte con los niveles de energía.',
      dificultad_bajar_peso: 'Con ingredientes que favorecen el metabolismo, es una elección inteligente para tu condición.',
      caida_pelo: 'Rica en proteínas y zinc, dos nutrientes clave para la salud del cabello en hipotiroidismo.',
      niebla_mental: 'El omega-3 y los antioxidantes apoyan la función cognitiva y la claridad mental.',
      default: 'Pensada especialmente para hipotiroidismo, con ingredientes que complementan tu tratamiento.',
    },
    hipertiroidismo: {
      ansiedad: 'Sin estimulantes y con ingredientes calmantes, pensada para acompañar mejor la ansiedad del hipertiroidismo.',
      problemas_sueno: 'Ingredientes naturalmente relajantes para acompañar mejor el descanso.',
      default: 'Sin exceso de yodo y con ingredientes que modulan naturalmente la actividad tiroidea.',
    },
    hashimoto: {
      cansancio: 'Sin gluten y antiinflamatoria, apoya la reducción de la inflamación sistémica del Hashimoto.',
      hinchazón: 'Sus ingredientes antiinflamatorios pueden ayudar con la hinchazón del Hashimoto.',
      caida_pelo: 'Rica en omega-3 y zinc, dos nutrientes clave para Hashimoto y la salud del cabello.',
      default: 'Diseñada para Hashimoto: sin gluten, sin soja, con omega-3 y antioxidantes.',
    },
  };

  if (!condicion || !mensajes[condicion]) {
    return 'Una receta nutritiva y equilibrada para cuidar tu bienestar.';
  }
  const mc = mensajes[condicion];
  for (const sintoma of sintomas) {
    if (mc[sintoma]) return mc[sintoma];
  }
  return mc['default'];
}

export function getSaludoDelDia(nombre: string): string {
  const hora = new Date().getHours();
  if (hora < 12) return `Buenos días, ${nombre}!`;
  if (hora < 19) return `Buenas tardes, ${nombre}!`;
  return `Buenas noches, ${nombre}!`;
}

export function getCategoriaEmoji(categoria: string): string {
  const emojis: Record<string, string> = {
    desayuno: '🌅',
    almuerzo: '🥗',
    cena: '🌙',
    postre: '🍮',
    jugo: '🥤',
  };
  return emojis[categoria] || '🍽️';
}
