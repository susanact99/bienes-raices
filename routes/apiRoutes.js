import express from 'express'
import { properties } from '../controlers/apiController.js'
const router = express.Router()

router.get('/properties', properties)

export default router