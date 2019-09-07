let valida = function validaCampos(dados) {

    let erros = []

    if(!dados.nome || typeof dados.nome == undefined || dados.nome == null) {
        erros.push({
            texto: 'Nome da categoria inválido.'
        })
    }

    if(dados.nome.length < 2) {
        erros.push({
            texto: 'Nome da categoria muito pequeno.'
        })
    }

    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        erros.push({
            texto: 'Slug inválido.'
        })
    }

    return erros
}

module.exports = valida