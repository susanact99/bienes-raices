import express from 'express'
import { formLogin, formRegister,authenticate, formForgotPassword, userRegister, confirmAccount, resetPassword, verifyToken, newPassword } from '../controlers/userControler.js';

const router = express.Router();


router.get('/login', formLogin)
router.post('/login', authenticate)


router.get('/register', formRegister)
router.post('/register', userRegister)

router.get('/confirm/:token', confirmAccount)

router.get('/forgot-password', formForgotPassword)
router.post('/forgot-password', resetPassword)

router.get('/forgot-password/:token', verifyToken)
router.post('/forgot-password/:token', newPassword)







export default router;