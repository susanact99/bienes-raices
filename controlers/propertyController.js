import { validationResult } from "express-validator"
import { Price, Category, Property } from '../models/index.js'

const admin = (req, res) => {
    res.render('properties/admin', {
        page: 'My real state'
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
            categories,
            csrfToken: req.csrfToken(),
            prices,
            errors: result.array(),
            data: req.body
        })
    }


    //Generar registro

    const { title, description, rooms, parking, bathrooms, street, lat, lng, price: priceId, category: categoryId } = req.body

    const { id: userId } = req.user

    try {
        const savedProperty = await Property.create({
            title,
            description,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            priceId,
            userId,
            image: ''
        })

        const { id } = savedProperty

        res.redirect(`/properties/add-image/${id}`)
    } catch (error) {
        console.log(error)
    }

}

const addImage = async (req, res) => {
    const { id } = req.params
    //Validar que la propiedad exista
    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-realstate')
    }
    //Validar que la propiedad no este publicada
    if (property.posted) {
        return res.redirect('/my-realstate')
    }

    //Validar que la propiedad pertenezca a quien la publica
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect('/my-realstate')
    }


    res.render('properties/add-image', {
        page: `Add image: ${property.title}`,
        csrfToken: req.csrfToken(),
        property
    })
}

const saveImage = async(req, res, next) => {
    const { id } = req.params
    //Validar que la propiedad exista
    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-realstate')
    }
    //Validar que la propiedad no este publicada
    if (property.posted) {
        return res.redirect('/my-realstate')
    }

    //Validar que la propiedad pertenezca a quien la publica
    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect('/my-realstate')
    }

    try {
        
        //Almacenar imagen y publicar propiedad
        property.image = req.file.filename
        property.posted = 1
        await property.save()

     next()

    } catch (error) {
        console.log(error)
    }

}

export {
    admin,
    create,
    save,
    addImage,
    saveImage
}