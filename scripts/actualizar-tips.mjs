import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recetasPath = path.join(__dirname, '../data/recetas.json');
const recetas = JSON.parse(fs.readFileSync(recetasPath, 'utf-8'));

const AGREGADO = ' Esta receta no contiene trigo, harina ni maíz — tres alimentos que pueden aumentar la permeabilidad intestinal y empeorar la inflamación tiroidea con el tiempo.';

let actualizadas = 0;
const recetasActualizadas = recetas.map(r => {
  if (r.sin_gluten && !r.tip_nutricional.includes('trigo, harina ni maíz')) {
    actualizadas++;
    return { ...r, tip_nutricional: r.tip_nutricional + AGREGADO };
  }
  return r;
});

fs.writeFileSync(recetasPath, JSON.stringify(recetasActualizadas, null, 2), 'utf-8');
console.log(`✅  Tips actualizados en ${actualizadas} recetas sin gluten`);
