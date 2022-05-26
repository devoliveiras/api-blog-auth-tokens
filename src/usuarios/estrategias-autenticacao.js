const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const Usuario = require('./usuarios-modelo');
const { invalidArgumentError } = require('../erros');

function verificaUsuario(usuario){
    if(!usuario){
        throw new Error('Não existe um usuário com esse e-mail.');
    }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
        throw new invalidArgumentError('E-mail ou senha inválidos')
    }
}

passport.use(
    new localStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    },async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUsuario(usuario); 
            await verificaSenha(senha, usuario.senhaHash);

            done(null, usuario);

        } catch (error) {
            done(error);
        }
        
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) =>{
            try {
                const payload = jwt.verify(token, process.env.CHAVE_JWT);
                const usuario = await Usuario.buscaPorId(payload.id);
                done(null, usuario);                
            } catch (error) {
                done(error);
            }
        }
    )
)