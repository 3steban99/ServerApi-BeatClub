const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')
require('dotenv').config();


const app = express()

app.set('port', process.env.PORT || 3001)

const dbOptions={
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())
app.use(cors())


app.get('/', (req, res)=>{
    res.send('Bienvenido a mi API')
});


//ruta para todos los productos del menu

app.get('/Productos/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM productos', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//ruta para la categoria vino

app.get('/Productos/vino', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM productos WHERE categoria_id = 1', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

app.get('/Productos/espumante', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM productos WHERE categoria_id = 2', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})



//ruta para verificar cuenta

app.post('/api/login', (req, res)=>{
    const {username, password} = req.body
    const values = [username, password]

    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM usuarios WHERE username = ? AND password= ?', values, (err, result)=>{
            if(err) {
                res.status(500).send(err)
            }else{
                if(result.length > 0){
                    res.status(200).send("Usuario correcto")
                }else{
                    res.status(400).send("Usuario no existe")
                }
            }
        })
    })
})


app.listen(app.get('port'), ()=>{
    console.log('server corriendo en el puerto', app.get('port'))
})

module.exports = app;