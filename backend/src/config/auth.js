import { config } from './env.js';

export const authConfig = {
  jwt: {
    secret: config.jwt.secret,
    expiresIn: config.jwt.expiresIn,
    algorithm: 'HS256',
  },

  bcrypt: {
    saltRounds: 10,
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 requests por ventana
    message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
  },

  // Configuración de sesión
  session: {
    name: 'tecnoandamios.sid',
    secret: config.jwt.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  },
};

export default authConfig;
