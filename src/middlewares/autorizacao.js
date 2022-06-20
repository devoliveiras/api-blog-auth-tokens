const controle = require('../controleAcesso')

const metodos = {
    ler: {
        todos: 'readAny',
        apenasSeu: 'readOwn',
    },
    criar:{
        todos: 'createAny',
        apenasSeu: 'createOwn',
    },
    remover:{
        todos: 'deleteAny',
        apenasSeu: 'deleteOwn',
    }
}

module.exports = (entidade, acao) => (req, res, next) => {

    const permissaoCargo = controle.can(req.user.cargo)
    const acoes = metodos[acao]
    const permissaoTodos = permissaoCargo[acoes.todos](entidade)
    const permissaoApenasSeu = permissaoCargo[acoes.apenasSeu](entidade)

    if(permissaoTodos.granted === false && permissaoApenasSeu.granted === false){
        res.status(403).json({ message: 'Usuário sem permissão' })
        res.end()
        return
    }

    req.acesso = {
        todos: {
            permitido: permissaoTodos.granted,
            atributos: permissaoTodos.attributes
        },
        apenasSeu: {
            permitido: permissaoApenasSeu.granted,
            atributos: permissaoApenasSeu.attributes
        }
        
    }

    next()
}