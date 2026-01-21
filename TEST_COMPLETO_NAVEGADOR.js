/**
 * TEST COMPLETO - Ejecutar en navegador
 *
 * 1. Abre https://tecnoandamio.huelemu.com.ar
 * 2. Abre consola (F12)
 * 3. Copia y pega todo este código
 * 4. Presiona Enter
 */

console.clear();
console.log('%c🔍 TEST COMPLETO - TecnoAndamio', 'font-size: 20px; font-weight: bold; color: #4CAF50');
console.log('==========================================\n');

// Función auxiliar para logging
const log = (emoji, title, content, isError = false) => {
    const style = isError ? 'color: #f44336' : 'color: #2196F3';
    console.log(`%c${emoji} ${title}`, `font-weight: bold; ${style}`);
    if (content) console.log(content);
    console.log('');
};

// Test 1: LocalStorage
log('1️⃣', 'LOCALSTORAGE', null);
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('Token:', token ? '✅ Existe' : '❌ No existe');
console.log('User:', userStr ? '✅ Existe' : '❌ No existe');

if (token) {
    console.log('\n📦 Decodificando token...');
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            console.log('Payload:', payload);

            const iat = new Date(payload.iat * 1000);
            const exp = new Date(payload.exp * 1000);
            const now = new Date();

            console.log('\n⏰ Fechas:');
            console.log('  Emitido:', iat.toLocaleString());
            console.log('  Expira:', exp.toLocaleString());
            console.log('  Ahora:', now.toLocaleString());
            console.log('  Estado:', now < exp ? '✅ Válido' : '❌ EXPIRADO');

            if (now > exp) {
                console.log('\n%c⚠️ PROBLEMA: El token está EXPIRADO', 'color: #ff9800; font-weight: bold');
                console.log('SOLUCIÓN: localStorage.clear(); location.href = "/login";');
            }
        }
    } catch (e) {
        console.error('Error decodificando:', e.message);
    }
}

console.log('\n');

// Test 2: Login endpoint
log('2️⃣', 'TEST LOGIN ENDPOINT', null);

fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'demo@demo.com',
        password: 'demo123'
    })
})
.then(async response => {
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 200 && data.success) {
        console.log('\n%c✅ LOGIN FUNCIONA', 'color: #4CAF50; font-weight: bold');
        console.log('Token nuevo:', data.data.token.substring(0, 50) + '...');

        // Decodificar token nuevo
        try {
            const newPayload = JSON.parse(atob(data.data.token.split('.')[1]));
            console.log('Nuevo payload:', newPayload);
            console.log('Expira:', new Date(newPayload.exp * 1000).toLocaleString());
        } catch (e) {
            console.error('Error decodificando nuevo token:', e);
        }

        console.log('\n%c🔧 SOLUCIÓN: Limpia localStorage y haz login', 'color: #2196F3; font-weight: bold');
        console.log('Ejecuta: localStorage.clear(); location.href = "/login";');

    } else {
        console.log('\n%c❌ LOGIN FALLÓ', 'color: #f44336; font-weight: bold');
        console.log('Verifica que el usuario demo existe en la BD');
    }
})
.catch(err => {
    console.error('❌ Error en request:', err);
});

console.log('Esperando respuesta del login...\n');

// Test 3: Auth/me endpoint
if (token) {
    log('3️⃣', 'TEST /auth/me ENDPOINT', null);

    fetch('/api/v1/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.status === 401) {
            console.log('\n%c❌ TOKEN RECHAZADO POR EL SERVIDOR', 'color: #f44336; font-weight: bold');
            console.log('\n📋 Posibles causas:');
            console.log('1. JWT_SECRET en producción es diferente al usado para generar el token');
            console.log('2. Token fue generado con .env de desarrollo');
            console.log('3. Backend no se reinició después de cambiar .env');
            console.log('4. Token expirado');

            console.log('\n%c🔧 SOLUCIÓN:', 'color: #2196F3; font-weight: bold');
            console.log('1. Verifica que el backend se reinició: ps aux | grep node');
            console.log('2. Verifica .env en servidor: cat /ruta/backend/.env | grep JWT_SECRET');
            console.log('3. Limpia localStorage y haz login nuevamente');
            console.log('');
            console.log('Ejecuta: localStorage.clear(); location.href = "/login";');

        } else if (response.status === 200) {
            console.log('\n%c✅ TOKEN VÁLIDO', 'color: #4CAF50; font-weight: bold');
        }
    })
    .catch(err => {
        console.error('❌ Error en request:', err);
    });

    console.log('Esperando respuesta de /auth/me...\n');
}

// Test 4: Test simple sin token
log('4️⃣', 'TEST LOGIN DIRECTO (Probar nuevo token)', null);

console.log('Vamos a hacer login y probar el token inmediatamente...\n');

fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'demo@demo.com',
        password: 'demo123'
    })
})
.then(async loginResponse => {
    const loginData = await loginResponse.json();

    if (loginResponse.status === 200 && loginData.success) {
        const freshToken = loginData.data.token;
        console.log('✅ Login exitoso, token obtenido');
        console.log('Token:', freshToken.substring(0, 50) + '...');

        // Inmediatamente probar con /auth/me
        console.log('\nProbando token recién generado con /auth/me...');

        return fetch('/api/v1/auth/me', {
            headers: {
                'Authorization': `Bearer ${freshToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(async meResponse => {
            const meData = await meResponse.json();
            console.log('\nRespuesta de /auth/me con token NUEVO:');
            console.log('Status:', meResponse.status);
            console.log('Data:', meData);

            if (meResponse.status === 200) {
                console.log('\n%c✅ BACKEND FUNCIONA CORRECTAMENTE', 'color: #4CAF50; font-weight: bold; font-size: 16px');
                console.log('El problema es que tu token en localStorage está desactualizado o inválido.');
                console.log('\n%c🔧 SOLUCIÓN DEFINITIVA:', 'color: #2196F3; font-weight: bold');
                console.log('localStorage.clear(); location.href = "/login";');
            } else {
                console.log('\n%c❌ PROBLEMA EN EL BACKEND', 'color: #f44336; font-weight: bold; font-size: 16px');
                console.log('Incluso tokens recién generados son rechazados.');
                console.log('Esto indica un problema de configuración en el servidor.');
                console.log('\n📋 Verifica en el servidor:');
                console.log('1. Backend se reinició: sudo systemctl status tecnoandamio-backend');
                console.log('2. .env tiene JWT_SECRET correcto');
                console.log('3. No hay múltiples procesos del backend corriendo');
            }
        });
    } else {
        console.log('%c❌ Login falló', 'color: #f44336; font-weight: bold');
    }
})
.catch(err => {
    console.error('❌ Error:', err);
});

console.log('\n==========================================');
console.log('%cEsperando resultados...', 'font-style: italic; color: #666');
console.log('==========================================');
