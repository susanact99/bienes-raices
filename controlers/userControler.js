const formLogin = (req, res) => {
    res.render('auth/login', {
        page: "Login"
    })
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: "Create acount"
    })
}

const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: "Recover you access to Real State"
    })
}

export{
    formLogin,
    formRegister,
    formForgotPassword
}