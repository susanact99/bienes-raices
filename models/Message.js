import { DataTypes } from "sequelize";
import db from '../config/db.js'

const Message = db.define('messages', {
    message: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    propertyId: {
        type: DataTypes.UUID, // o INTEGER si usas ID numéricos
        allowNull: false,
        references: {
            model: 'properties',
            key: 'id'
        }
    }
    
})

export default Message;