const crearMensaje = (nombre, mensaje) =>{
    console.log('Nombre ----- ' , nombre);
    return {
        nombre,
        mensaje,
        fecha : new Date().getTime()
    };
}

module.exports = {
    crearMensaje
}