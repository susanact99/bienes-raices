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
        houses
    })
}

const category = (req,res) =>{
    
}

const notFound = (req,res) =>{
    
}

const search = (req,res) =>{
    
}

export {
    landing,
    category,
    notFound,
    search
}