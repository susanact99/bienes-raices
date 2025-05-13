import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Price, Category, Property, Message, User } from '../models/index.js'
import { isSeller, formatDate } from '../helpers/index.js'

const admin = async (req, res) => {

    //Leer QueryString
    const { page: currentPage } = req.query

    const expresion = /^[1-9]$/

    if (!expresion.test(currentPage)) {
        return res.redirect('/my-realstate?page=1')
    }

    try {
        const { id } = req.user

        //Limites y offset
        const limit = 5
        const offset = ((currentPage * limit) - limit)

        const [properties, total] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where: {
                    userId: id
                },
                include: [
                    { model: Category, as: 'category' },
                    { model: Price, as: 'price' },
                    {model: Message, as: 'messages'}
                ]
            }),
            Property.count({
                where: {
                    userId: id
                }
            })
        ])

        res.render('properties/admin', {
            page: 'My real state',
            csrfToken: req.csrfToken(),
            properties,
            pages: Math.ceil(total / limit),
            currentPage: Number(currentPage),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }
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

    const { title, description, rooms, parking, bathrooms, street, lat, lng, price, category } = req.body;


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
            priceId: price,
            categoryId: category,
            userId,
            image: ''
        });


        const { id } = savedProperty
        console.log('Body:', req.body)


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
    if (req.user.id.toString() !== property.userId.toString()) {
        return res.redirect('/my-realstate')
    }


    res.render('properties/add-image', {
        page: `Add image: ${property.title}`,
        csrfToken: req.csrfToken(),
        property
    })
}

const saveImage = async (req, res, next) => {
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
    if (req.user.id.toString() !== property.userId.toString()) {
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

const edit = async (req, res) => {
    //Validar que la propiedad exista
    const { id } = req.params

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-realstate')
    }

    //Revisar que quien visita la URL es quien creó la propiedad
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-realstate')
    }

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/edit', {
        page: 'Edit property',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    })
}


const saveChanges = async (req, res) => {

    //Validacion
    let result = validationResult(req)
    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render('properties/edit', {
            page: `Edit property: ${property.title}`,
            categories,
            csrfToken: req.csrfToken(),
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { id } = req.params

    //Validar que la propiedad exista

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-realstate')
    }

    //Revisar que quien visita la URL es quien creó la propiedad
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-realstate')
    }


    //Reescribir los valores de la propiedad
    try {

        const { title, description, rooms, parking, bathrooms, street, lat, lng, price: priceId, category: categoryId } = req.body

        property.set({
            title,
            description,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            priceId,
            categoryId
        })

        await property.save()

        res.redirect('/my-realstate')

    } catch (error) {
        console.log(error)
    }
}

const deleteProperty = async (req, res) => {

    const { id } = req.params

    //Validar que la propiedad exista

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-realstate')
    }

    //Revisar que quien visita la URL es quien creó la propiedad
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-realstate')
    }

    //Eliminar la imagen asociada
    if (property.image) {
        await unlink(`public/uploads/${property.image}`);
    }


    //Eliminar la propiedad
    property.destroy()
    res.redirect('/my-realstate')
}

//Mostrar propiedad
const showProperty = async (req, res) => {
    const { id } = req.params

    //Comprobar que la propiedad existe
    const property = await Property.findByPk(id, {
        include: [
            { model: Price, as: 'price' },
            { model: Category, as: 'category' }
        ]
    })

    if (!property) {
        return res.redirect('/404')
    }


    res.render('properties/show', {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId)
    })
}

const sendMessage = async (req, res) => {
    const { id } = req.params

    //Comprobar que la propiedad existe
    const property = await Property.findByPk(id, {
        include: [
            { model: Price, as: 'price' },
            { model: Category, as: 'category' }
        ]
    })

    if (!property) {
        return res.redirect('/404')
    }

    //Validacion
    let result = validationResult(req)
    if (!result.isEmpty()) {
        return res.render('properties/show', {
            property,
            page: property.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, property.userId),
            errors: result.array()
        })
    }

    //Almacenar mensaje
    const {message} = req.body
    const {id:propertyId} = req.params
    const {id: userId} = req.user

    await Message.create({
        message,
        propertyId,
        userId
    })


    res.render('properties/show', {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, property.userId),
        sended: true
    })
}

const seeMessages = async(req, res) => {
    const { id } = req.params

    //Validar que la propiedad exista

    const property = await Property.findByPk(id, {
        include: [
            {model: Message, as: 'messages', 
                include: [
                    {model: User.scope('removePassword'), as: 'user'}
                ]
            }
        ]
    })

    if (!property) {
        return res.redirect('/my-realstate')
    }

    //Revisar que quien visita la URL es quien creó la propiedad
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-realstate')
    }

    res.render('properties/messages', {
        page: 'Messages',
        messages: property.messages,
        formatDate
    }
    )
}

export {
    admin,
    create,
    save,
    addImage,
    saveImage,
    edit,
    saveChanges,
    deleteProperty,
    showProperty,
    sendMessage,
    seeMessages
}