import { Sequelize, Op } from "sequelize"
import { Price, Category, Property } from "../models/index.js"


const landing = async(req,res) =>{

    const [categories, prices, apartments, houses] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2
            },
            include: [
                {
                    model: Price,
                    as: 'price'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    res.render('landingPage', {
        page: 'Inicio',
        categories,
        prices,
        apartments, 
        houses,
        csrfToken: req.csrfToken()
    })
}

const category = async(req,res) =>{
    const {id} = req.params

    //Comprobar que la categoría exista
    const category = await Category.findByPk(id)
    if(!category){
        return res.redirect('/404')
    }

    //Obtener las propiedades de la categoria

    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include: [
            {model: Price, as: 'price'}
        ]
    })

    res.render('category', {
        page: 'Categoría',
        properties,
        csrfToken: req.csrfToken()
    })
}

const notFound = (req,res) =>{
    res.render('404', {
        page: 'No encontrada',
        csrfToken: req.csrfToken() 
    })
}

const search = async (req,res) =>{
    const {search} = req.body
 
    //Validar que no este vacio
    if(!search.trim()){
        return res.redirect('back')
    }

    //Consultar las propiedades
    const properties = await Property.findAll({
        where: {
            title: {
                [Op.like]: `%${search}%`
            }
        },
        include: [
            {model: Price, as: 'price'}
        ]
    })

    res.render('search', {
        page: 'Resultados de la búsqueda',
        properties,
        csrfToken: req.csrfToken()
    })
}

export {
    landing,
    category,
    notFound,
    search
}