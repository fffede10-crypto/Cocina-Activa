import bcrypt from 'bcryptjs';

const password = 'Test1234!';
const hash = await bcrypt.hash(password, 12);

console.log('Email: test@tiroidesactiva.com.ar');
console.log('Password: Test1234!');
console.log('Hash:', hash);
console.log('');
console.log('SQL para ejecutar en Supabase:');
console.log(`INSERT INTO usuarios (email, password_hash, nombre, acceso_activo, vio_bienvenida)`);
console.log(`VALUES ('test@tiroidesactiva.com.ar', '${hash}', 'Usuaria Test', true, false);`);
