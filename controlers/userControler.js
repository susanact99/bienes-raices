import { check, validationResult } from 'express-validator'
import User from "../models/User.js"
import { generateId } from '../helpers/token.js'
import { emailRegister } from '../helpers/email.js'

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: "Login"
    })
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: "Create acount",
        csrfToken: req.csrfToken()
    })
}

const userRegister = async (req, res) => {
    //Validacion
    await check('name').notEmpty().withMessage('The name can not be empty').run(req)
    await check('email').isEmail().withMessage('The email must include an @').run(req)
    await check('password').isLength({ min: 6 }).withMessage('The password must be longer than 6 characters').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('The passwords are no equals').run(req)

    let result = validationResult(req)


    //Verificar que el resultado entre vacio
    if (!result.isEmpty()) {
        //Errores
        return res.render('auth/register', {
            page: "Create acount",
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    const { name, email, password } = req.body

    //Verificar que el usuario no esté duplicado
    const duplicateUser = await User.findOne({ where: { email } })

    if (duplicateUser) {
        return res.render('auth/register', {
            page: "Create acount",
            csrfToken: req.csrfToken(),
            errors: [{
                msg: 'This email is being used'
            }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    //Enviar email de confirmacion
    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    }
    )

    //Mostrar mensaje de confirmacion
    res.render('templates/message', {
        page: 'The account has been created successfully.',
        message: 'We have sent a confirmation email, click on the link'
    })
}

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    //Verificar que el token es válido
    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirm-account', {
            page: 'Error confirming the account',
            message: 'An error occurred while confirming the account, try again',
            error: true
        })
    }

    //Confirmar la cuenta
    user.token = null;
    user.confirmed = true;
    await user.save();

    res.render('auth/confirm-account', {
        page: 'Account confirmed',
        message: 'Your account has been successfully confirmed!',
        error: false
    })
}

const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: "Recover you access to Real State",
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('The email must include an @').run(req)

    let result = validationResult(req)


    //Verificar que el resultado entre vacio
    if (!result.isEmpty()) {
        //Errores
        return res.render('auth/forgot-password', {
            page: "Recover you access to Real State",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })
    }

    //Buscar el usuario
    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if(!user){
        return res.render('auth/forgot-password', {
            page: "Recover you access to Real State",
            csrfToken: req.csrfToken(),
            errors: [{msg: "The email does not belong to any user"}]
        })
    }
}

export {
    formLogin,
    formRegister,
    formForgotPassword,
    userRegister,
    confirmAccount,
    resetPassword
}