import express from 'express'
import {admin} from '../controlers/propertyController.js'

const router = express.Router()

router.get('/my-realstate', admin)


export default router