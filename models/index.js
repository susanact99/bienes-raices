import Property from './Property.js'
import Price from './Price.js'
import Category from './Category.js'
import User from './User.js'


Property.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Property.belongsTo(Price, { foreignKey: 'priceId', onDelete: 'CASCADE' });
Property.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });


 
export{
    Property,
    Price,
    Category,
    User
}