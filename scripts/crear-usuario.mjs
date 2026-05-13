import bcrypt from 'bcryptjs';

const CHARS = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%';

function generarPassword(largo = 10) {
  let pass = '';
  for (let i = 0; i < largo; i++) {
    pass += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return pass;
}

const [nombre, email] = process.argv.slice(2);

if (!nombre || !email) {
  console.error('Uso: node scripts/crear-usuario.mjs "Nombre Apellido" "email@gmail.com"');
  process.exit(1);
}

const password = generarPassword();
const hash = await bcrypt.hash(password, 12);

console.log('\n=== SQL para Supabase ===\n');
console.log(`INSERT INTO usuarios (nombre, email, password_hash, acceso_activo, vio_bienvenida)`);
console.log(`VALUES ('${nombre}', '${email}', '${hash}', true, false);`);

console.log('\n=== Mensaje para WhatsApp ===\n');
console.log(`Hola ${nombre.split(' ')[0]}! 👋`);
console.log(`Ya tenés tu acceso a la Plataforma Tiroides.`);
console.log(``);
console.log(`🔗 https://plataforma-tiroides.vercel.app/login`);
console.log(`📧 Usuario: ${email}`);
console.log(`🔑 Contraseña: ${password}`);
console.log(``);
console.log(`Cualquier duda me avisás! 😊`);
