import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const identifyUser = async (req,res,next) => {
    //Identificar si hay un token en la cookies
    const {_token} = req.cookies
    if(!_token){
        req.user = null
        return next()
    }

    //Comprobar el token

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await User.scope('removePassword').findByPk(decoded.id)
        //Almacenar el usuario al Req
        if(user){
            req.user = user
        }
        return next()
    } catch (error) {
        console.log('Invalid token or error decoding JWT:', error)
        res.clearCookie('_token')
        req.user = null
        return next()
    }
}

export default identifyUser