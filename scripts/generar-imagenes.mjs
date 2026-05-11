/**
 * Genera imágenes para las 60 recetas usando IA.
 *
 * Soporta tres proveedores (auto-detecta por env var):
 *   OPENAI_API_KEY      → DALL-E 3  (recomendado, mejor calidad)
 *   FAL_KEY             → fal.ai flux/schnell  (más rápido y barato)
 *   REPLICATE_API_TOKEN → Replicate flux-schnell
 *
 * Uso:
 *   npm run generar-imagenes
 *   npm run generar-imagenes -- --desde 10 --hasta 20   (rango)
 *   npm run generar-imagenes -- --id 5                  (una sola)
 *   npm run generar-imagenes -- --forzar                (re-genera existentes)
 *
 * Las imágenes se guardan en /public/recetas/{id}.jpg
 * Al terminar actualiza imagen_url en data/recetas.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_PATH = join(ROOT, 'data', 'recetas.json');
const OUTPUT_DIR = join(ROOT, 'public', 'recetas');

// ── Detectar proveedor ────────────────────────────────────────────────────────

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const FAL_KEY = process.env.FAL_KEY;
const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN;

const PROVEEDOR = OPENAI_KEY ? 'openai'
  : FAL_KEY    ? 'fal'
  : REPLICATE_KEY ? 'replicate'
  : null;

if (!PROVEEDOR) {
  console.error('\n❌  No encontré ninguna API key en las variables de entorno.');
  console.error('   Configurá una de estas:\n');
  console.error('   OPENAI_API_KEY      → DALL-E 3 (mejor calidad)');
  console.error('   FAL_KEY             → fal.ai flux/schnell (más rápido)');
  console.error('   REPLICATE_API_TOKEN → Replicate\n');
  console.error('   Ejemplo: set OPENAI_API_KEY=sk-... && npm run generar-imagenes\n');
  process.exit(1);
}

console.log(`\n🔑  Proveedor: ${PROVEEDOR.toUpperCase()}`);

// ── Argumentos CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const desdeArg = Number(getArg('--desde') ?? 1);
const hastaArg = Number(getArg('--hasta') ?? 60);
const idArg    = getArg('--id') ? Number(getArg('--id')) : null;
const forzar   = args.includes('--forzar');

// ── Datos ─────────────────────────────────────────────────────────────────────

const recetas = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
mkdirSync(OUTPUT_DIR, { recursive: true });

const DELAY_MS = PROVEEDOR === 'openai' ? 6000   // DALL-E 3: ~10 req/min en tier 1
  : PROVEEDOR === 'fal'      ? 2000
  : 3000;

// ── Generador de prompt ───────────────────────────────────────────────────────

function buildPrompt(receta) {
  const ingredientes = receta.ingredientes
    .slice(0, 5)
    .map(i => i.nombre)
    .join(', ');

  const categoriaDesc = {
    desayuno: 'breakfast',
    almuerzo: 'lunch bowl',
    cena:     'dinner plate',
    postre:   'healthy dessert',
  }[receta.categoria] ?? 'dish';

  return [
    `Professional food photography of "${receta.nombre}", a healthy ${categoriaDesc}.`,
    `Main ingredients: ${ingredientes}.`,
    'Styled on a light wooden table or white marble surface.',
    'Natural window light, soft shadows, shallow depth of field.',
    'Clean and appetizing presentation. No text. No watermarks.',
    'Shot from 45 degrees overhead, Instagram food photography style.',
  ].join(' ');
}

// ── Descarga de URL a archivo ─────────────────────────────────────────────────

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode} al descargar ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

// ── Proveedores ───────────────────────────────────────────────────────────────

async function generarConOpenAI(prompt) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: OPENAI_KEY });

  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  return response.data[0].url;
}

async function generarConFal(prompt) {
  const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: 'square_hd',
      num_inference_steps: 4,
      num_images: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.images?.[0]?.url;
}

async function generarConReplicate(prompt) {
  const createRes = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({
        input: { prompt, num_outputs: 1, aspect_ratio: '1:1', output_format: 'jpg' },
      }),
    }
  );

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Replicate error ${createRes.status}: ${text}`);
  }

  const prediction = await createRes.json();

  if (prediction.status === 'succeeded') {
    return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  }

  // Poll si no llegó con Prefer: wait
  const id = prediction.id;
  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${REPLICATE_KEY}` },
    });
    const poll = await pollRes.json();
    if (poll.status === 'succeeded') {
      return Array.isArray(poll.output) ? poll.output[0] : poll.output;
    }
    if (poll.status === 'failed') throw new Error(`Replicate: predicción falló — ${poll.error}`);
  }
  throw new Error('Replicate: timeout esperando la imagen');
}

async function generarImagen(prompt) {
  if (PROVEEDOR === 'openai')   return generarConOpenAI(prompt);
  if (PROVEEDOR === 'fal')      return generarConFal(prompt);
  if (PROVEEDOR === 'replicate') return generarConReplicate(prompt);
  throw new Error('Proveedor desconocido');
}

// ── Utilidades ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function formatMs(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const recetasAGenerar = idArg
  ? recetas.filter(r => r.id === idArg)
  : recetas.filter(r => r.id >= desdeArg && r.id <= hastaArg);

if (recetasAGenerar.length === 0) {
  console.error('❌  No encontré recetas con ese filtro.');
  process.exit(1);
}

console.log(`📸  Generando imágenes para ${recetasAGenerar.length} recetas\n`);

let exitosas = 0;
let saltadas = 0;
let errores = 0;

for (let i = 0; i < recetasAGenerar.length; i++) {
  const receta = recetasAGenerar[i];
  const destPath = join(OUTPUT_DIR, `${receta.id}.jpg`);
  const prefijo = `[${i + 1}/${recetasAGenerar.length}]`;

  if (!forzar && existsSync(destPath)) {
    console.log(`${prefijo} ⏭️  ${receta.nombre} — ya existe, saltando`);
    saltadas++;
    continue;
  }

  const prompt = buildPrompt(receta);
  process.stdout.write(`${prefijo} 🎨  ${receta.nombre} ... `);

  const t0 = Date.now();
  try {
    const imageUrl = await generarImagen(prompt);
    await downloadFile(imageUrl, destPath);
    const elapsed = Date.now() - t0;
    console.log(`✅  ${formatMs(elapsed)}`);
    exitosas++;
  } catch (err) {
    console.log(`❌  Error: ${err.message}`);
    errores++;
  }

  // Espera entre requests (salvo el último)
  if (i < recetasAGenerar.length - 1) {
    await sleep(DELAY_MS);
  }
}

// ── Actualizar imagen_url en recetas.json ─────────────────────────────────────

console.log('\n📝  Actualizando imagen_url en recetas.json...');

let actualizadas = 0;
const recetasActualizadas = recetas.map(r => {
  const imagePath = join(OUTPUT_DIR, `${r.id}.jpg`);
  if (existsSync(imagePath)) {
    actualizadas++;
    return { ...r, imagen_url: `/recetas/${r.id}.jpg` };
  }
  return r;
});

writeFileSync(DATA_PATH, JSON.stringify(recetasActualizadas, null, 2), 'utf-8');

// ── Resumen ───────────────────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Generadas:  ${exitosas}
⏭️   Saltadas:   ${saltadas}
❌  Errores:    ${errores}
📁  Destino:    public/recetas/
🔗  JSON:       ${actualizadas} imagen_url actualizadas
━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

if (errores > 0) {
  console.log('💡  Para reintentar solo las fallidas, corré:');
  console.log('    npm run generar-imagenes -- --forzar\n');
}
