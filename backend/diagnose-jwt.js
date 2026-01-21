/**
 * Script de diagnóstico para verificar configuración JWT en producción
 * Ejecutar en el servidor: node diagnose-jwt.js
 */

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Cargar variables de entorno
dotenv.config();

console.log('\n🔍 DIAGNÓSTICO DE JWT - TecnoAndamio\n');
console.log('=====================================\n');

// 1. Verificar variables de entorno
console.log('1️⃣ VARIABLES DE ENTORNO:');
console.log('   NODE_ENV:', process.env.NODE_ENV || '❌ NO DEFINIDO');
console.log('   PORT:', process.env.PORT || '❌ NO DEFINIDO (usando default: 9000)');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ DEFINIDO' : '⚠️ NO DEFINIDO (usando default inseguro)');
console.log('   JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '❌ NO DEFINIDO (usando default: 24h)');
console.log('   DB_HOST:', process.env.DB_HOST || '❌ NO DEFINIDO');
console.log('   DB_NAME:', process.env.DB_NAME || '❌ NO DEFINIDO');
console.log('');

// 2. Valor actual del JWT_SECRET
const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
console.log('2️⃣ JWT_SECRET ACTIVO:');
if (jwtSecret === 'your-super-secret-key-change-in-production') {
  console.log('   ⚠️ ADVERTENCIA: Usando JWT_SECRET por defecto (inseguro para producción)');
  console.log('   Secret:', jwtSecret);
} else {
  console.log('   ✅ JWT_SECRET personalizado configurado');
  console.log('   Length:', jwtSecret.length, 'caracteres');
  console.log('   Preview:', jwtSecret.substring(0, 10) + '...');
}
console.log('');

// 3. Generar un token de prueba
console.log('3️⃣ PRUEBA DE GENERACIÓN DE TOKEN:');
try {
  const testPayload = {
    id: 1,
    email: 'demo@demo.com',
    roles: ['admin']
  };

  const testToken = jwt.sign(testPayload, jwtSecret, { expiresIn: '24h' });
  console.log('   ✅ Token generado exitosamente');
  console.log('   Token (primeros 50 chars):', testToken.substring(0, 50) + '...');
  console.log('');

  // 4. Verificar el token
  console.log('4️⃣ PRUEBA DE VERIFICACIÓN DE TOKEN:');
  try {
    const decoded = jwt.verify(testToken, jwtSecret);
    console.log('   ✅ Token verificado exitosamente');
    console.log('   Payload decodificado:', JSON.stringify(decoded, null, 2));
  } catch (verifyError) {
    console.log('   ❌ Error verificando token:', verifyError.message);
  }
} catch (signError) {
  console.log('   ❌ Error generando token:', signError.message);
}
console.log('');

// 5. Probar con un token que podría estar en producción
console.log('5️⃣ INSTRUCCIONES PARA PROBAR TOKEN REAL:');
console.log('   En el navegador del usuario (F12 → Console), ejecuta:');
console.log('   const token = localStorage.getItem("token");');
console.log('   console.log(token);');
console.log('');
console.log('   Luego copia el token y ejecuta en el servidor:');
console.log('   node diagnose-jwt.js <TOKEN_AQUI>');
console.log('');

// Si se pasó un token como argumento, verificarlo
const tokenToTest = process.argv[2];
if (tokenToTest) {
  console.log('6️⃣ VERIFICANDO TOKEN PROPORCIONADO:');
  try {
    const decoded = jwt.verify(tokenToTest, jwtSecret);
    console.log('   ✅ Token válido');
    console.log('   Usuario ID:', decoded.id);
    console.log('   Email:', decoded.email);
    console.log('   Roles:', decoded.roles);
    console.log('   Emitido:', new Date(decoded.iat * 1000).toLocaleString());
    console.log('   Expira:', new Date(decoded.exp * 1000).toLocaleString());
  } catch (error) {
    console.log('   ❌ Token inválido:', error.message);
    console.log('');
    console.log('   POSIBLES CAUSAS:');
    console.log('   - El JWT_SECRET en producción es diferente al usado para generar el token');
    console.log('   - El token está corrupto o fue modificado');
    console.log('   - El token expiró');
    console.log('');
    console.log('   SOLUCIÓN:');
    console.log('   1. Verificar que el .env en producción tenga JWT_SECRET configurado');
    console.log('   2. Hacer login nuevamente para generar un nuevo token');
    console.log('   3. Si cambiaste JWT_SECRET, todos los usuarios deben hacer logout/login');
  }
  console.log('');
}

// 7. Verificar archivo .env
console.log('7️⃣ VERIFICAR ARCHIVO .ENV:');
console.log('   Ubicación esperada: ./backend/.env');
console.log('   Contenido mínimo requerido:');
console.log('');
console.log('   NODE_ENV=production');
console.log('   PORT=9000');
console.log('   JWT_SECRET=un-secret-largo-y-seguro-minimo-32-caracteres');
console.log('   JWT_EXPIRES_IN=24h');
console.log('   DB_HOST=localhost');
console.log('   DB_PORT=3306');
console.log('   DB_NAME=tecnoandamios_db');
console.log('   DB_USER=tu_usuario_db');
console.log('   DB_PASSWORD=tu_password_db');
console.log('');

console.log('=====================================');
console.log('Diagnóstico completado.\n');
