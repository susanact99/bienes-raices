import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'



import db from './config/db.js'

const app = express()

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
const csrfProtection = csrf({
    cookie: true
})
app.use(csrfProtection)

//Conexion a la base de datos
try{
    await db.authenticate();
    await  db.sync()
    console.log('Conexion correcta a la BD')
}catch(error){
    console.error(error)
}

//habilitar pug
app.set('view engine','pug')
app.set('views','./views')

//carpeta publica
app.use(express.static('public'))

//routing
app.use('/', appRoutes)
app.use('/auth', userRoutes)
app.use('/', propertyRoutes)
app.use('/api', apiRoutes)




//definir puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})





