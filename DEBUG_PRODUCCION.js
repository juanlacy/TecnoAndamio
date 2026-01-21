// ==========================================
// Script de Debug para Producción
// ==========================================
// Copia y pega este código en la consola del navegador (F12)
// cuando estés en https://tecnoandamio.huelemu.com.ar

console.clear();
console.log('=== DEBUG TECNOANDAMIO ===\n');

// 1. Verificar datos del usuario
const userStr = localStorage.getItem('user');
const token = localStorage.getItem('token');

console.log('1. DATOS EN LOCALSTORAGE:');
console.log('   Token existe:', token ? '✅ Sí' : '❌ No');
console.log('   Usuario existe:', userStr ? '✅ Sí' : '❌ No');

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('\n2. DATOS DEL USUARIO:');
    console.log('   ID:', user.id);
    console.log('   Nombre:', user.nombre);
    console.log('   Email:', user.email);
    console.log('   Activo:', user.activo);
    console.log('   Campo "rol":', user.rol);
    console.log('   Campo "roles":', user.roles);
    console.log('   Tipo de roles:', Array.isArray(user.roles) ? 'Array' : typeof user.roles);

    if (user.roles) {
      console.log('   Cantidad de roles:', user.roles.length);
      console.log('   Primer rol:', user.roles[0]);
      console.log('   Tipo del primer rol:', typeof user.roles[0]);
    }
  } catch (e) {
    console.error('   ❌ Error parseando usuario:', e);
  }
}

// 3. Verificar conectividad con backend
console.log('\n3. PROBANDO BACKEND:');
fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(data => {
    console.log('   ✅ Backend responde:');
    console.log('   Success:', data.success);
    if (data.success && data.data && data.data.usuario) {
      console.log('   Usuario del backend:', data.data.usuario);
      console.log('   Roles del backend:', data.data.usuario.roles);
    } else if (data.error) {
      console.log('   ❌ Error:', data.error);
    }
  })
  .catch(err => {
    console.error('   ❌ Error de conexión:', err);
  });

// 4. Verificar si el módulo de Usuarios está en el DOM
setTimeout(() => {
  console.log('\n4. VERIFICANDO MENÚ:');
  const menuItems = document.querySelectorAll('mat-nav-list a');
  console.log('   Items del menú encontrados:', menuItems.length);

  menuItems.forEach((item, i) => {
    const text = item.textContent?.trim();
    console.log(`   ${i + 1}. ${text}`);
  });

  const usuariosLink = Array.from(menuItems).find(item =>
    item.textContent?.toLowerCase().includes('usuario')
  );

  if (usuariosLink) {
    console.log('\n   ✅ Link "Usuarios" EXISTE en el DOM');
  } else {
    console.log('\n   ❌ Link "Usuarios" NO EXISTE en el DOM');
  }

  console.log('\n=== FIN DEBUG ===');
}, 2000);
