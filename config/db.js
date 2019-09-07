if(process.env.NODE_ENV == 'production') {
    module.exports = {
        MONGODB_URI: 'mongodb://leandrobeandrade:blogapp1234@cluster0-ll7gs.mongodb.net/test?retryWrites=true&w=majority',
    }
}
else {
    module.exports = {
        MONGODB_URI: 'mongodb://localhost/blogapp'
    }
}