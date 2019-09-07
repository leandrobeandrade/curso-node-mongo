let valida = function validaCampos(dados) {

    let erros = []

    if(!dados.titulo || typeof dados.titulo == undefined || dados.titulo == null) {
        erros.push({
            texto: 'Título inválido.'
        })
    }

    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        erros.push({
            texto: 'Slug inválido.'
        })
    }

    if(!dados.descricao || typeof dados.descricao == undefined || dados.descricao == null) {
        erros.push({
            texto: 'Descrição inválida.'
        })
    }

    if(!dados.conteudo || typeof dados.conteudo == undefined || dados.conteudo == null) {
        erros.push({
            texto: 'Conteudo inválido.'
        })
    }

    return erros
}

module.exports = valida