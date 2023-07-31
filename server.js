const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')
require('dotenv').config();


const app = express()

app.set('port', process.env.PORT || 3001)

const dbOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Bienvenido a mi API')
});


//ruta para todos los productos del menu

app.get('/Productos', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT p.producto_id, p.nombre, p.precio, p.descripcion, p.categoria_id, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.categoria_id ORDER BY c.categoria_id', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows)
        })
    })
})


//RUTAS PARA EL MENU

//ruta categoria vino

app.get('/Productos/vino', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT * FROM productos WHERE categoria_id = 1', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows)
        })
    })
})

//ruta categoria espumante
app.get('/Productos/espumante', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT * FROM productos WHERE categoria_id = 2', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows)
        })
    })
})



//ruta de categorias

app.get('/Categorias', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT * FROM categorias', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows)
        })
    })
})


//RUTAS DE PRODUCTOS

//ruta para borrar un producto

app.delete('/Productos/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('DELETE FROM productos WHERE producto_id = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)

            res.send(rows)
        })
    })
})


//ruta para crear un producto

app.post('/Productos', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('INSERT INTO productos set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)

            res.send(rows)
        })
    })
})

//ruta para modificar un producto

app.put('/Productos/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('UPDATE productos set ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)

            res.send(rows)
        })
    })
})



//RUTA PARA VERIFICAR CUENTA

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    const values = [username, password]

    req.getConnection((err, conn) => {
        if (err) return res.send(err)

        conn.query('SELECT * FROM usuarios WHERE username = ? AND password= ?', values, (err, result) => {
            if (err) {
                console.log('Error en la consulta', err)
                res.status(500).send(err)
            } else {
                console.log('Resultados de la consulta:', result)
                if (result.length > 0) {
                    res.status(200).send("Usuario correcto")
                } else {
                    res.status(400).send("Usuario no existe")
                }
            }
        })
    })
})


app.listen(app.get('port'), () => {
    console.log('server corriendo en el puerto', app.get('port'))
})

module.exports = app;