import express from 'express'
import {landing, category, notFound, search} from '../controlers/appController.js'

const router = express.Router()

//Pagina de inicio
router.get('/', landing)

//Categorías
router.get('/categories/:id', category)

//Pagina 404
router.get('/404', notFound)

//Buscador
router.post('/search', search )

export default router;