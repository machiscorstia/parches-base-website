const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err))

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'Error de conexión:'))

database.once('open', function() {
  console.log("Conectado correctamente en la base de datos: ", database.name)
})