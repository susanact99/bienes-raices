import express from 'express'
import { formLogin, formRegister, formForgotPassword, userRegister, confirmAccount, resetPassword } from '../controlers/userControler.js';

const router = express.Router();


router.get('/login', formLogin)

router.get('/register', formRegister)
router.post('/register', userRegister)

router.get('/confirm/:token', confirmAccount)

router.get('/forgot-password', formForgotPassword)
router.post('/forgot-password', resetPassword)





export default router;