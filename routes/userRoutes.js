import express from 'express'
import { formLogin, formRegister, formForgotPassword } from '../controlers/userControler.js';

const router = express.Router();


router.get('/login', formLogin)

router.get('/register', formRegister)

router.get('/forgot-password', formForgotPassword)




export default router;