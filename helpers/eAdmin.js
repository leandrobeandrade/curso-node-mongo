module.exports = {
    eAdmin: ((req, res, next) => {

        if(req.isAuthenticated() && req.user.eAdmin == true) return next()
        
        console.log(req.user)
        console.log(req.isAuthenticated())
        req.flash('error_msg', 'Você precisa ser administrador para ter acesso!')
        res.redirect('/')   
    })
}