
(function () {
    const lat = 43.4896365;
    const lng = -8.2243143;
    const map = L.map('map-landing-page').setView([lat, lng], 14);

    let markers = new L.FeatureGroup().addTo(map)

    let properties = []

    //Filtros
    const filters = {
        category: '',
        price: ''
    }

    const categorySelect = document.querySelector('#categories')
    const pricesSelect = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    //Filtrado de categorias y precios
    categorySelect.addEventListener('change', e => {
        filters.category = +e.target.value
        filterProperties()
    })

    pricesSelect.addEventListener('change', e => {
        filters.price = +e.target.value
    })

    const getProperties = async () => {
        try {
            const url = '/api/properties'
            const response = await fetch(url)
            properties = await response.json()

            showProperties(properties)

        } catch (error) {
            console.log(error)
        }
    }

    const showProperties = properties => {

        //Limpiar los markers previos//para revisar la funciones a usar se hace un console.log de markers y se revisa prototype
        markers.clearLayers()

        properties.forEach(property => {
            //Agregar los pines
            const marker = new L.marker([property?.lat, property?.lng], {
                autoPan: true
            })
            .addTo(map)
            const popupContent = `
               <p class="text-indigo-600 font-bold">${property.category.name}</p>
               <h1 class="text-xl font-extrabold uppercase my-3">${property?.title}</h1>
               <img src="/uploads/${property.image}" alt="Imagen de la propiedad ${property.title}">
               <p class="text-gray-600 my-2 font-bold brock">${property.price.name}</p> 
               <a href="/property/${property.id}" class="bg-gray-100 block p-3 text-center font-bold uppercase hover:bg-gray-200">Ver propiedad</a>
            `;

            marker.bindPopup(popupContent);
            

            markers.addLayer(marker)
        });
    }

    const filterProperties = () => {
        const result = properties.filter(filterCategory).filter(filterPrice)
        showProperties(result)
    }

    const filterCategory = (property) => {
        return filters.category ? property.categoryId === filters.category : property
    }
    const filterPrice = (property) => {
        return filters.price ? property.priceId === filters.price : property
    }

    getProperties()
})()