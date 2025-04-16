import express from 'express'
import{body} from 'express-validator'
import {admin, create, save} from '../controlers/propertyController.js'

const router = express.Router()

router.get('/my-realstate', admin)
router.get('/properties/create', create)
router.post('/properties/create',
    body('title').notEmpty().withMessage('The title of the post is required'),
    body('description')
        .notEmpty().withMessage('The title of the post is required')
        .isLength({max: 50}).withMessage('The description is to long'),
    body('category').isNumeric().withMessage('Select a category'),
    body('price').isNumeric().withMessage('Select a price range'),
    body('rooms').isNumeric().withMessage('Select a number of rooms'),
    body('parking').isNumeric().withMessage('Select a number of parkins'),
    body('bathrooms').isNumeric().withMessage('Select a number of bathrooms'),
    body('lat').notEmpty().withMessage('Locate the property on the map'),

    save)




export default router