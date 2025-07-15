module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'healthdetect',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
};