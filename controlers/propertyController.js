
const admin = (req,res) => {
    res.render('properties/admin',{
        page: 'My real state',
        bar: true
    })
}

export{
    admin
}