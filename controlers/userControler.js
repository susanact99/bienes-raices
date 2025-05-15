import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from "../models/User.js"
import { generateId, generateJWT } from '../helpers/token.js'
import { emailRegister, emailForgotPassword } from '../helpers/email.js'


const formLogin = (req, res) => {
    res.render('auth/login', {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken()
    })
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: "Crear cuenta",
        csrfToken: req.csrfToken()
    })
}

const authenticate = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('The email is required').run(req)
    await check('password').notEmpty().withMessage('The password is required').run(req)

    let result = validationResult(req)


    //Verificar que el resultado entre vacio
    if (!result.isEmpty()) {
        //Errores
        return res.render('auth/login', {
            page: "Login",
            csrfToken: req.csrfToken(),
            errors: result.array(),

        })
    }

    //Comprobar si el usuario existe
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
        return res.render('auth/login', {
            page: "Login",
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'User does not exist' }],
        })
    }

    //Comprobar si el usuario est aconfirmado
    if (!user.confirm) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'The user is not confirmed' }]
        })
    }

    //Revisar el password
    if (!(await user.checkPassword(password))) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'The password is incorrect' }]
        })
    }

    //Autenticar al usuario
    const token = generateJWT({id: user.id, name: user.name})

    console.log(token)

    //Almacenar la cookie
    return res.cookie('_token', token, {
        httpOnly: true,
       // expires: 9000
        //secure: true
    }).redirect('/my-realstate')
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
            page: "Crear cuenta",
            csrfToken: req.csrfToken(),
            errors: result.array(),
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
            page: "Crear cuenta",
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
        page: 'La cuenta ha sido creada exitosamente.',
        message: 'Te hemos enviado un email de confirmación, haz click en el link'
    })
}

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    //Verificar que el token es válido
    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirm-account', {
            page: 'Ha ourrido un error confirmando la cuenta',
            message: 'Ha ocurrido un error, intentalo otra vez',
            error: true
        })
    }

    //Confirmar la cuenta
    user.token = null;
    user.confirm = true;
    await user.save();

    res.render('auth/confirm-account', {
        page: 'Cuenta confirmada',
        message: 'Tu cuenta ha sido confirmada exitosamente!',
        error: false
    })
}

const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: "Recupera tu acceso a Real State",
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('El email debe incluir un @').run(req)

    let result = validationResult(req)


    //Verificar que el resultado entre vacio
    if (!result.isEmpty()) {
        //Errores
        return res.render('auth/forgot-password', {
            page: "Recupera tu acceso a Real State",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })
    }

    //Buscar el usuario
    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/forgot-password', {
            page: "Recupera tu acceso a Real State",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "El email no pertenece a ningun usuario" }]
        })
    }

    //Generar un token y enviar un email 
    user.token = generateId()
    await user.save()

    //Enviar un email
    emailForgotPassword({
        email: user.email,
        name: user.name,
        token: user.token
    })

    //Renderizar mensaje
    res.render('templates/message', {
        page: 'Restablece tu contraseña',
        message: 'Hemos enviado un email con las instrucciones',
        error: false
    })
}

const verifyToken = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirm-account', {
            page: 'Cambia la contraseña',
            message: 'Ha ocurrido un error validando la información, intentalo otra vez',
            error: true
        })
    }

    //Mostrar formulario para validar el password

    res.render('auth/reset-password', {
        page: 'Restablece tu contraseña',
        csrfToken: req.csrfToken()
    })
}

const newPassword = async (req, res) => {

    //Validar el password
    await check('password').isLength({ min: 6 }).withMessage('The password must be longer than 6 characters').run(req)
    let result = validationResult(req)


    //Verificar que el resultado entre vacio
    if (!result.isEmpty()) {
        //Errores
        return res.render('auth/reset-password', {
            page: "Restablece tu contraseña",
            csrfToken: req.csrfToken(),
            errors: result.array(),

        })
    }

    const { token } = req.params
    const { password } = req.body

    //Identificar quien hace el cambio

    const user = await User.findOne({ where: { token } })

    //Hashear el nuevo password

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null;
    await user.save()

    res.render('auth/confirm-account', {
        page: 'Nueva contraseña guardada',
        message: 'La contraseña ha sido guardada exitosamente'
    })
}

const closeSesion = async(req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

export {
    formLogin,
    formRegister,
    authenticate,
    formForgotPassword,
    userRegister,
    confirmAccount,
    resetPassword,
    verifyToken,
    newPassword,
    closeSesion
}