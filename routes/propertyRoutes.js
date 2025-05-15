import express from 'express'
import{body} from 'express-validator'
import {admin, create, save, addImage, saveImage, edit, saveChanges, deleteProperty, changeState, showProperty, sendMessage, seeMessages} from '../controlers/propertyController.js'
import protectRoute from '../middleware/protectRoutes.js'
import upload from '../middleware/uploadImage.js'
import identifyUser from "../middleware/identifyUser.js"

const router = express.Router()

router.get('/my-realstate',protectRoute, admin)
router.get('/properties/create',protectRoute, create)
router.post('/properties/create',protectRoute, 
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


router.get('/properties/add-image/:id', protectRoute, addImage)

router.post('/properties/add-image/:id', 
    protectRoute, 
    upload.single('image'),
    saveImage
)

router.get('/properties/edit/:id',
    protectRoute,
    edit
)

router.post('/properties/edit/:id',protectRoute, 
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

    saveChanges)

router.post('/properties/delete/:id',
    protectRoute,
    deleteProperty
)

router.put('/properties/:id',
    protectRoute,
    changeState
)

//Area publica
router.get('/property/:id',
    identifyUser,
    showProperty
)

//Almacenar los mensajes
router.post('/property/:id',
    identifyUser,
    body('message').isLength({min:10}).withMessage('El mensaje no puede ir vacio ni muy corto'),
    sendMessage
)

router.get('/messages/:id',
    protectRoute,
    seeMessages
)


export default router