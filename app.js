/**
 * Imports
 */
const express    = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')
const app        = express()
const session    = require('express-session')
const flash      = require('connect-flash')
const admin      = require('./routes/admin')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db') 

/**
 * Configurações
 */

// Session
app.use(session({
    secret: 'teste1234',                        // chave que gera sessão
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())                                // sempre abaixo da session

// Middlewares
app.use((req, res, next) => {                   // locals <- variaveis globais no app
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error_msg_posts = req.flash('error_msg_posts')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

// Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.MONGODB_URI, { useNewUrlParser: true })  // <- Heroku
//mongoose.connect('mongodb://localhost/blogapp', { useNewUrlParser: true })   <- Antigo
.then(() => {
    console.log('Conectado ao Mongo...')
}).catch(erro => {
    console.log('Erro ao se conectar: ', erro)
})

/**
 * Rotas
 */
// Rota Principal
app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).limit(4)
    .then(postagens => res.render('index', { postagens: postagens }))
    .catch(() => {
        req.flash('error_msg', 'Houve um erro interno!')
        res.redirect('/404')
    })
})

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug })
    .then(postagem => {
        if(postagem) res.render('postagens/index', { postagem: postagem })
        else { 
            req.flash('error_msg', 'Esta postagem não existe!')
            req.redirect('/')
        }
    }).catch((req, res) => {
        req.flash('error_msg', 'Houve um erro interno!')
        req.redirect('/')
    })
})

app.get('/listas', (req, res) => {
    Categoria.find()
    .then(categorias => res.render('listas/lista', { categorias: categorias }))
    .catch(() => {
        req.flash('error_msg', 'Houve um erro interno ao listar!')
        req.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then(categoria => {
        if(categoria) {
            Postagem.find({ categoria: categoria._id }).then(postagens => {
                res.render('categorias/index', { postagens: postagens, categoria: categoria })
            }).catch((erro) => {
                console.log(erro)
                req.flash('error_msg', 'Houve um erro interno ao listar a postagem!')
                res.redirect('/')
            })
        } else {
            req.flash('error_msg', 'Esta categoria não existe!')
            res.redirect('/')
        }
    }).catch((erro) => {
        console.log(erro)
        req.flash('error_msg', 'Houve um erro interno ao listar as categorias!')
        res.redirect('/')
    })
})

app.get('/404', res => {
    res.render('partials/404')
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)

/**
 * Rodar
 */
const PORTA = process.env.PORT || 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta: ${PORTA}`)
})