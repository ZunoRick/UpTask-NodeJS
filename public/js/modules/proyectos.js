import Swal from 'sweetalert2';
const axios = require('axios').default;

const btnEliminar = document.querySelector('#eliminar-proyecto');
const nombreProyecto = document.querySelector('.contenido-principal h2');
const btnOK = document.querySelector('.swal2-confirm');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: `¿Deseas borrar "${nombreProyecto.textContent}"?`,
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //Enviar petición a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                
                axios.delete(url, {
                        params: { 
                            urlProyecto 
                        }
                    })
                    .then( respuesta =>{
                        Swal.fire(
                            'Proyecto Eliminado!', 
                            respuesta.data, 
                            'success'
                        ).then( result => {
                            if(result.isConfirmed)
                                //Redireccionar al inicio
                                window.location.href = '/';
                        });
                    })
                    .catch( () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        }).then( result => {
                            if(result.isConfirmed)
                                //Redireccionar al inicio
                                window.location.href = '/';
                        });
                    });
            }
        });
    });
}

export default btnEliminar;