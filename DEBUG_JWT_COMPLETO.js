/**
 * Script de Debug Completo para JWT
 *
 * INSTRUCCIONES:
 * 1. Abre https://tecnoandamio.huelemu.com.ar
 * 2. Abre la consola del navegador (F12)
 * 3. Copia y pega TODO este script
 * 4. Presiona Enter
 */

console.clear();
console.log('🔍 DEBUG JWT COMPLETO - TecnoAndamio\n');
console.log('=====================================\n');

// 1. Verificar localStorage
console.log('1️⃣ LOCALSTORAGE:');
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('Token existe:', token ? '✅ Sí' : '❌ No');
console.log('User existe:', userStr ? '✅ Sí' : '❌ No');

if (token) {
  console.log('\nToken (primeros 50 caracteres):');
  console.log(token.substring(0, 50) + '...');

  // Decodificar JWT (solo la parte del payload, sin verificar firma)
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    console.log('\n📦 Payload del Token (decodificado sin verificar):');
    console.log(JSON.stringify(payload, null, 2));

    // Verificar expiración
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now > expDate;

      console.log('\n⏰ Expiración del Token:');
      console.log('Emitido:', new Date(payload.iat * 1000).toLocaleString());
      console.log('Expira:', expDate.toLocaleString());
      console.log('Estado:', isExpired ? '❌ EXPIRADO' : '✅ Válido');

      if (isExpired) {
        console.log('\n⚠️ PROBLEMA ENCONTRADO: Token expirado');
        console.log('SOLUCIÓN: Haz logout y login nuevamente');
      }
    }
  } catch (e) {
    console.log('❌ Error decodificando token:', e.message);
  }
}

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('\n👤 Usuario en localStorage:');
    console.log(JSON.stringify(user, null, 2));
  } catch (e) {
    console.log('❌ Error parseando usuario:', e.message);
  }
}

console.log('\n');

// 2. Probar endpoint /auth/me con detalles
console.log('2️⃣ PROBANDO /api/v1/auth/me:');

if (token) {
  fetch('/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(async response => {
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    // Mostrar headers de respuesta
    console.log('\nResponse Headers:');
    for (let [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const data = await response.json();
    console.log('\nResponse Body:');
    console.log(JSON.stringify(data, null, 2));

    if (response.status === 401) {
      console.log('\n❌ PROBLEMA: Token rechazado por el servidor');
      console.log('\nPOSIBLES CAUSAS:');
      console.log('1. JWT_SECRET en producción es diferente al usado para generar el token');
      console.log('2. El token fue generado en desarrollo y no es válido en producción');
      console.log('3. El token está corrupto');
      console.log('4. El backend no está leyendo correctamente el .env');

      console.log('\n🔧 SOLUCIONES:');
      console.log('1. Limpia localStorage y haz login nuevamente:');
      console.log('   localStorage.clear(); location.reload();');
      console.log('2. Verifica JWT_SECRET en el servidor (ejecuta diagnose-jwt.js)');
    }
  })
  .catch(error => {
    console.log('❌ Error en request:', error.message);
  });
} else {
  console.log('❌ No hay token para probar');
  console.log('\n🔧 SOLUCIÓN: Haz login primero');
}

console.log('\n');

// 3. Verificar endpoint de login
console.log('3️⃣ PROBANDO ENDPOINT DE LOGIN:');
console.log('Intentando login con usuario demo...\n');

fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'demo@demo.com',
    password: 'demo123'
  })
})
.then(async response => {
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));

  if (response.status === 200 && data.success) {
    console.log('\n✅ LOGIN FUNCIONA CORRECTAMENTE');
    console.log('\nToken nuevo generado:');
    console.log(data.data.token.substring(0, 50) + '...');

    console.log('\n🔧 SOLUCIÓN: Limpia localStorage y haz login desde la UI:');
    console.log('   localStorage.clear();');
    console.log('   location.href = "/login";');
  } else {
    console.log('\n❌ LOGIN FALLÓ');
    console.log('Verifica que el usuario demo existe en la base de datos');
  }
})
.catch(error => {
  console.log('❌ Error en login:', error.message);
});

console.log('\n');

// 4. Información del entorno
console.log('4️⃣ INFORMACIÓN DEL NAVEGADOR:');
console.log('URL actual:', window.location.href);
console.log('Dominio:', window.location.hostname);
console.log('Protocolo:', window.location.protocol);
console.log('User Agent:', navigator.userAgent.substring(0, 100) + '...');

console.log('\n');
console.log('=====================================');
console.log('Esperando respuestas de los endpoints...\n');
console.log('Revisa los resultados arriba ☝️');
