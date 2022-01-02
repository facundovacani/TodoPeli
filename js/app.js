let pagina = 1;
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");


btnSiguiente.addEventListener('click', () =>{

    if(pagina < 1000){
        pagina += 1;
        cargarPeliculas();
    } 
})
btnAnterior.addEventListener('click', () =>{

    if(pagina > 1){
        pagina -= 1;
        cargarPeliculas();
    } 
})

const cargarPeliculas = async() => { //Con async, hacemos a la la función asíncrona, y así funcionará await, que esta palabra reservada hará que el codigo se detenga hasta la obtención de una respuesta por parte del servidor
    //Cuando se trabaja con funciones asincronas, deberíamos trabajar con try y catch.
    //try intenta ejecutar un codigo, y en caso de que haya error, y no se pueda ejecutar el codigo, se utiliza catch para "atrapar" ese error y así poder identificar el mismo
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=9e62ec52d34030a928f955e75cd4562e&language=es-MX&page=${pagina}`);

        if(respuesta.status === 200){
            const datos = await respuesta.json(); // la respuesta del servidor, tiene un metodo json() que sirve para acceder a la información que nos devolvió el servidor. Este método es asincrono, hay que esperar a que termine. Por eso utilizamos await
            let peliculas = "";

            datos.results.forEach(pelicula => {
                let puntajePeli = pelicula.vote_average / 2;    

                let limitarCaracteres = (p) =>{
                    if(p.overview.length == 0){
                        let nada = "No hay descripción disponible en este momento";
                        return nada;
                    }else{
                        if(p.overview.length < 370){
                            return p.overview;
                        }else if(p.overview.length >= 370){
                            let cadenaNueva = p.overview.substring(0,369);
                            return cadenaNueva + "...";
                        }

                    }
                };
                peliculas +=`
                <div class="pelicula">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" />
                    <h3 class="titulo">${pelicula.title}</h3>
                    <div class="descripcion">
                        <img class="poster-descripcion" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" >
                        <p>${limitarCaracteres(pelicula)}</p>                       

                        <label> Puntuación :
                            <input type="text" disabled value="${puntajePeli}" class="puntuacion"></input>
                        </label>
                        
                    </div>
                </div>
                `
            });
            console.log(datos.results);
            document.getElementById('contenedor').innerHTML = peliculas;
        } else if (respuesta.status === 401){
            console.log("Error en la api");
        } else if( respuesta.status === 404){
            console.log("No se encontró pelicula con esa id");
        } else {
            console.log("Hubo un error indefinido");
        }

    } catch(error){
        console.log(error);
    };

}



const topPelis = async() => {
    try {
        const respuesta2 = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=9e62ec52d34030a928f955e75cd4562e&language=es-MX&page=1`);
        console.log(respuesta2)

        if(respuesta2.status === 200){
            const datos2 = await respuesta2.json(); 
            let topPeliculas = "";
            for(let i = 0; i < 5; i++){
                let pelicula = datos2.results[i];

                let puntajePeli = pelicula.vote_average / 2; 
                   
                topPeliculas +=`
                <div class="peliculaTop">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" />
                    <h4 class="titulo">${pelicula.title}</h4>                            
                    <label> Puntuación :
                        <input type="text" disabled value="${puntajePeli}" class="puntuacion"></input>
                    </label>

                </div>
                `
            }
            console.log(datos2.results);
            document.getElementById('relacionados').innerHTML = topPeliculas;
        }
    }catch(error){
        console.log(error);
    }
}

cargarPeliculas();
topPelis();