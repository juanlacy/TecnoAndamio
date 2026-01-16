/**
 * Validador de RUT chileno
 */

/**
 * Limpiar RUT (remover puntos y guiones)
 */
export const limpiarRut = (rut) => {
  if (!rut) return '';
  return rut.toString().replace(/[.-]/g, '').toUpperCase();
};

/**
 * Formatear RUT (12.345.678-9)
 */
export const formatearRut = (rut) => {
  const rutLimpio = limpiarRut(rut);
  if (rutLimpio.length < 2) return rutLimpio;

  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Agregar puntos cada 3 dígitos
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${numeroFormateado}-${dv}`;
};

/**
 * Calcular dígito verificador del RUT
 */
export const calcularDV = (rut) => {
  let suma = 0;
  let multiplo = 2;

  // Recorrer el RUT de derecha a izquierda
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);

  if (dvEsperado === 11) return '0';
  if (dvEsperado === 10) return 'K';
  return dvEsperado.toString();
};

/**
 * Validar RUT chileno
 * @param {String} rut - RUT a validar (con o sin formato)
 * @returns {Boolean} - True si es válido
 */
export const validarRut = (rut) => {
  if (!rut) return false;

  const rutLimpio = limpiarRut(rut);

  // Debe tener al menos 2 caracteres (número + DV)
  if (rutLimpio.length < 2) return false;

  // Separar número y dígito verificador
  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // El número debe ser numérico
  if (!/^\d+$/.test(numero)) return false;

  // Calcular DV esperado
  const dvCalculado = calcularDV(numero);

  // Comparar DV
  return dv === dvCalculado;
};

/**
 * Validar y formatear RUT
 * @param {String} rut - RUT a procesar
 * @returns {Object} - { valido: Boolean, rutFormateado: String, mensaje: String }
 */
export const procesarRut = (rut) => {
  const valido = validarRut(rut);

  if (!valido) {
    return {
      valido: false,
      rutFormateado: null,
      mensaje: 'RUT inválido',
    };
  }

  return {
    valido: true,
    rutFormateado: formatearRut(rut),
    mensaje: 'RUT válido',
  };
};

export default {
  limpiarRut,
  formatearRut,
  calcularDV,
  validarRut,
  procesarRut,
};
