import bcrypt from 'bcryptjs';

const hash = '$2b$12$y8pX7moxP32/tqs4UBiC8OLwv9rXkP5OaFFzh2KnoY9F.nbCGM2Gi';
const password = 'Test1234!';
const ok = await bcrypt.compare(password, hash);
console.log('¿Hash válido?', ok);
