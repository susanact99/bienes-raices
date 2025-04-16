import {exit} from 'node:process'
import categories from './categories.js'
import prices from './prices.js'
import db from '../config/db.js'
import {Category,Price} from '../models/index.js'

const importData = async() =>{
    try {
        //Autenticar
        await db.authenticate()

        //Generar columnas
        await db.sync()

        //Insertar datos
        //Si no depende uno de otro se usa Promise.all en vez de un doble await
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices)
        ])

        console.log('Datos importados correctamente')
        exit(0)//finaliza la ejecucion del codigo con exito
    } catch (error) {
        console.log(error)
        exit(1)//finaliza la ejecucion del codigo con error
    }
}

const deleteData = async () =>{
    try {
        await Promise.all([
            Category.destroy({where:{}, truncate: true}),
            Price.destroy({where:{}, truncate: { cascade: true }})
        ])

        //Otra forma de hacerlo
        //await db.sync({force.: true})
        console.log('Data deleted succesfully')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}


if(process.argv[2] ==="-e"){
    deleteData();
}

if(process.argv[2] ==="-i"){
    importData();
}