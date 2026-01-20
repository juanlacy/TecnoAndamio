/**
 * Script para generar hash de contraseña con bcrypt
 * Uso: node generar-password-hash.js
 */

import bcrypt from 'bcryptjs';

// Configuración
const password = 'demo123';  // Cambiar si quieres otra contraseña
const saltRounds = 10;

console.log('==========================================');
console.log('Generador de Hash de Contraseña (bcrypt)');
console.log('==========================================\n');

console.log(`Contraseña a hashear: "${password}"`);
console.log(`Salt rounds: ${saltRounds}\n`);

// Generar hash
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error al generar hash:', err);
    return;
  }

  console.log('✅ Hash generado exitosamente!\n');
  console.log('Hash de la contraseña:');
  console.log(hash);
  console.log('\n==========================================');
  console.log('SQL para insertar usuario demo:');
  console.log('==========================================\n');

  const sql = `INSERT INTO usuarios (nombre, email, password, rol, activo, created_at, updated_at)
VALUES (
  'Usuario Demo',
  'demo@demo.com',
  '${hash}',
  'admin',
  1,
  NOW(),
  NOW()
);`;

  console.log(sql);
  console.log('\n==========================================');
  console.log('Verificar contraseña:');
  console.log('==========================================\n');

  // Verificar que el hash funciona
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('❌ Error al verificar:', err);
      return;
    }
    console.log(`Verificación: ${result ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    console.log(`La contraseña "${password}" ${result ? 'coincide' : 'NO coincide'} con el hash generado\n`);
  });
});
