import { validationResult } from "express-validator"
import {Price, Category, Property} from '../models/index.js'

const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'My real state',
        bar: true
    })
}
//Formulario para crear una nueva propiedad
const create = async (req, res) => {
    //Consultar precios y categorias
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/create', {
        page: 'Create property',
        bar: true,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}


const save = async (req, res) => {
    //Validacion
    let result = validationResult(req)
    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render('properties/create', {
            page: 'Create property',
            bar: true,
            categories,
            csrfToken: req.csrfToken(),
            prices,
            errors: result.array(),
            data: req.body
        })
    }


    //Generar registro

    const {title, description, rooms, parking, bathrooms, street, lat, lng, price: priceId, category : categoryId} = req.body

    try {
        const saverProperty = await Property.create({
            title,
            description,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            priceId 
        })
    } catch (error) {
        console.log(error)
    }

}

export {
    admin,
    create,
    save
}