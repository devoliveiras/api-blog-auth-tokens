module.exports = (cargosObrigatorios) => (req, res, next) => {

    if(cargosObrigatorios.indexOf(req.user.cargo) === -1){
        res.status(403).json({ message: 'Usuário sem permissão' })
        res.end()
        return
    }
    next()
}