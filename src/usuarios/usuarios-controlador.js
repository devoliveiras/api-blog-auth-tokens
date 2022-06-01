const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const tokens = require('./tokens');
const { EmailVerificacao, EmailVerificacao } = require('./emails');

function geraEndereco(rota, token){
  const baseURL = 'localhost:3000';
  return `${baseURL}${rota}${token}`;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id);

      //Envio de email de verificação
      const endereco = geraEndereco('/usuario/verifica-email/', token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail().catch(console.log)
      
      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: async (req, res) => {
    const acesstoken = tokens.access.cria(req.user.id);
    const refreshToken = await tokens.refresh.cria(req.user.id);
    res.set('Authorization', acesstoken);
    res.status(200).send({ refreshToken });
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  async verificaEmail(req, res){
    try {
      const usuario = req.user;
      await usuario.verificaEmail();
      res.status(200).json();
    } catch (erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
