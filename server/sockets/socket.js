const { io } = require('../server');
const {Usuarios} = require('../clases/usuarios');    
const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {

    //ENTRAR AL CHAT
    client.on('entrarChat',(data, callback)=>{
        console.log(data);
        if (!data.nombre || !data.sala){
            callback({
                error: true,
                mensaje: 'El nombre o la sala son necesarios'
            });
        }
        
        client.join(data.sala);
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje',(data) =>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
    });
    
    client.on('disconnect',()=> {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Adminsitrador',`${personaBorrada.nombre}, salio`))
        //console.log('Personas en lista ', usuarios.getPersonas());
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala));
    });
    
    // Mensajes privados
    client.on('mensajePrivado', (data) =>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));
    });
    
    
    //console.log('Usuario conectado');

    // client.emit('enviarMensaje', {
    //     usuario: 'Administrador',
    //     mensaje: 'Bienvenido a esta aplicación'
    // });



    // client.on('disconnect', () => {
    //     console.log('Usuario desconectado');
    // });

    // // Escuchar el cliente
    // client.on('enviarMensaje', (data, callback) => {

    //     console.log(data);

    //     client.broadcast.emit('enviarMensaje', data);


    //     // if (mensaje.usuario) {
    //     //     callback({
    //     //         resp: 'TODO SALIO BIEN!'
    //     //     });

    //     // } else {
    //     //     callback({
    //     //         resp: 'TODO SALIO MAL!!!!!!!!'
    //     //     });
    //     // }



    // });

});