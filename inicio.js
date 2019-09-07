const mongoose = require('mongoose')


/**
 * Configurando o Mongoose e inicializando o MongoDB 
 */
mongoose.connect('mongodb://localhost/usuario', {useNewUrlParser: true}) // usuario <- nome da base de dados criada
.then(() => {
    console.log('Conectado ao MongoDB!')
})
.catch((erro) => {
    console.log('Houve um erro ao se conectar ao MongoDB: ', erro)
})


/**
 * Criando um Model
 */
const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    cidade: {
        type: String
    }
})

// usuarios <- nome da collection(tabela)
mongoose.model('usuarios', UsuarioSchema)

// relaciona o NovoUsuario a collection
const NovoUsuario = mongoose.model('usuarios')

// cria um novo usuário a partir do Model
new NovoUsuario({
    nome:  'Alice',
    sobrenome: 'Andrade',
    idade: 03,
    email: 'alice@gmail.com',
    cidade: 'Indaiatuba'
}).save()
.then(() => {
    console.log('Usuário criado com sucesso!')
})
.catch((erro) => {
    console.log('Hoive um erro ao criar usuário!: ', erro)
})



