const autorizacao = require('./autorizacao')
const autenticacao = require('./autorizacao')

module.exports = (entidade, acao) => (req, res, next) => {
    if (req.estaAutenticado === true){
        return autorizacao(entidade, acao)(req, res, next)
    }
    next()
}