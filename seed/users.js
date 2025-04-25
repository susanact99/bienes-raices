import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Juan',
        email: 'juan@juan.com',
        confirm: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default users