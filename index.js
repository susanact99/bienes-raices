import express from 'express'
import userRoutes from './routes/userRoutes.js'

const app = express()

//routing
app.use('/auth', userRoutes)

//habilitar pug
app.set('view engine','pug')
app.set('views','./views')

//carpeta publica
app.use(express.static('public'))


//definir puerto y arrancar el proyecto
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})