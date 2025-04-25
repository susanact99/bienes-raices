import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const User = db.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    hooks: {
        beforeCreate: async function(user){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password , salt)
        }
    },
    scopes: {
        removePassword: {
            attributes: {
            exclude: ['password', 'token', 'confirm', 'createdAt', 'updatedAt']
            }
        }
    }
})

//Metodos personalizados

User.prototype.checkPassword =async function (password){
    if (!password || !this.password) return false;
    return await bcrypt.compareSync(password, this.password);
}

export default User;