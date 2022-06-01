const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');


function criaTokenJWT(id, [tempoQuantidade, tempoUnidade], allowlist) {
    const payload = { id };
  
    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade + tempoUnidade});
    return token;
  
}
  
function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist){
    const tokeOpaco = crypto.randomBytes(24).toString('hex');
    const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();
    await allowlist.adiciona(tokeOpaco, id, dataExpiracao);
    
    return tokeOpaco;
}

module.exports = {
    access: {
        expiracao: [15, 'm'],
        cria(id){
            return criaTokenJWT(id, this.expiracao);
        }
    },
    refresh:{
        expiracao: [5, 'd'],
        cria(id){
            return criaTokenOpaco(id, this.expiracao);
        }
    },
    verificacaoEmail: {
        nome: 'token de verificação de email',
        expiracao: [1, 'h'],
        cria(id) {
            return criaTokenJWT(id, this.expiracao);
        }
    }
}