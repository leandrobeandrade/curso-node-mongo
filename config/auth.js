const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = (passport) => {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        
        Usuario.findOne({email: email}).then(usuario => {
            if(!usuario) return done(null, false, {
                message: 'Esta conta não existe!'
            })

            // compara as senhas
            bcrypt.compare(senha, usuario.senha, (erro, iguais) => {
                if(iguais) return done(null, usuario)
                else return done(null, false, {
                    message: 'Senhas incorretas!'
                })
            }) 
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}

// parâmetros do done()

/* 
    null    = conta a ser autenticada
    false   = caso seja autenticada
    message = mensagem
*/