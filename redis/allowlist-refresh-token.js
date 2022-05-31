const redis = require('redis');
const manipulaLista = require('./manipula-lista'); 
const allowlist = redis.createClient({prefix: 'allow-refresh-token:'});
module.exports = manipulaLista(allowlist);