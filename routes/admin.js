const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

/* Models */
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')

/* Validações */
const CatCamposVal = require('../validations/categorias_val')
const PostCamposVal = require('../validations/postagens_val')

/* Admin */
const {eAdmin} = require('../helpers/eAdmin')

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

/**
 * Lista todas as categorias => READ
 */
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {
            categorias: categorias
        })
    }).catch(erro => {
        req.flash('Erro ao buscar categorias', erro)
        res.redirect('/admin')
    })
})

/**
 * Cadastra uma nova categoria => CREATE
 */
router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    let erros = CatCamposVal(req.body)

    // Valida os campos do form
    if(erros.length > 0) res.render('admin/addcategorias', { erros: erros })
    else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria cadastrada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch(() => {
            req.flash('error_msg', `Ocorreu o erro ao registrar a categoria!`)
            res.redirect('/admin')
        })
    }
})

/**
 * Edita uma categoria => UPDATE
 */
router.get('/categorias/edit/:id', eAdmin, (req, res) => {
    Categoria.findOne({
        _id: req.params.id
    }).then(categoria => {
        res.render('./admin/editcategorias', {categoria: categoria})
    }).catch(() => {
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', eAdmin, (req, res) => {
    let erros = CatCamposVal(req.body)

    // Valida os campos do form
    if(erros.length > 0) res.render('admin/addcategorias', { erros: erros })
    else {
        Categoria.findOne({
            _id: req.body.id
        }).then(categoria => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorias')
            }).catch(() => {
                req.flash('error_msg', 'Erro interno ao editar categoria!')
                res.redirect('/admin/categorias')
            })
        }).catch(() => {
            req.flash('error_msg', 'Esta categoria não existe!')
            res.redirect('/admin/categorias')
        })
    }
})

/**
 * Deleta uma categoria => DELETE
 */
router.post('/categorias/delete/:id', eAdmin, (req, res) => {
    Categoria.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg','Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria!')
        res.redirect('/admin/categorias')
    })
})
 
/**
 * Postagens
 */

// Lista Postagens => UPDATE
router.get('/postagens', eAdmin, (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).then(postagens => {
        res.render('admin/postagens', { postagens: postagens })
    }).catch(erro => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens!', erro)
        req.redirect('/admin')
    })
})

// Cria uma postagem => CREATE
router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find()
    .then(categorias => {
        res.render('admin/addpostagens', {
            categorias: categorias
        })
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao carregar formulário!')
        req.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin, (req, res) => {
    let erros = PostCamposVal(req.body)

    // Valida os campos do form
    if(req.body.categoria == '0') erros.push({texto: 'Categoria inválida!'})
    if(erros.length > 0) res.render('admin/addpostagens', { erros: erros })
    else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem cadastrada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro ao criar a postagem!', error)
            res.redirect('/admin/postagens')
        })
    }
})

//Edita uma postagem => UPDATE
router.get('/postagens/edit/:id', eAdmin, (req, res) => {
    Postagem.findOne({
        _id: req.params.id
    }).then(postagem => {
        Categoria.find().then(categorias => {
            res.render('./admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch(() => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias!', error)
            res.redirect('/admin/postagens')
        })
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição!')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', eAdmin, (req, res) => {
    let erros = PostCamposVal(req.body)

    // Valida os campos do form
    if(erros.length > 0) res.render('admin/addpostagens', { erros: erros })
    else {
        Postagem.findOne({
            _id: req.body.id
        }).then(postagem => {
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
    
            postagem.save().then(() => {
                req.flash('success_msg', 'Postagem editada com sucesso!')
                res.redirect('/admin/postagens')
            }).catch(() => {
                req.flash('error_msg', 'Erro interno ao editar postagem!')
                res.redirect('/admin/postagens')
            })
        }).catch((erro) => {
            req.flash('error_msg', 'Esta postagem não existe!', erro)
            res.redirect('/admin/postagens')
        })
    }
})

// Deleta uma postagem => DELETE
router.post('/postagens/delete/:id', eAdmin, (req, res) => {
    Postagem.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg','Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    }).catch(() => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem!')
        res.redirect('/admin/postagens')
    })
})

module.exports = router