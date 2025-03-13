import express from 'express'
import { formLogin, formRegister } from '../controlers/userControler.js';

const router = express.Router();


router.get('/login', formLogin)

router.get('/registro', formRegister)



export default router;