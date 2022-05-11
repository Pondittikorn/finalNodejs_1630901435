//Open Call Express 
const express = require('express')
const bodyParser = require('body-parser')
 
const mysql = require('mysql')
 
const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))
app.set('view engine','ejs')

//MySQL Connect phpMyAdmin
const pool = mysql.createPool({
    connectionLimit : 10,
    connectionTimeout : 20,
    host : 'localhost', //www.google.com/sql or Server IP Address
    user : 'root',
    password : '',
    database : 'lotta_database' //Connect Database from beers.sql (Import to phpMyAdmin)
})
 
//GET
var obj = {}

app.get('/addlotta',(req, res) => {   
    res.render('addlotta')
})

app.get('/credits',(req, res) => {   
    res.render('credits')
})

app.get('',(req, res) => {
 
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId)
        connection.query('SELECT * FROM lotta', (err, rows) => { 
            connection.release();
            if(!err){ 
                obj = { lotta: rows, Error : err}
                res.render('index', obj)
            } else {
                console.log(err)
            }
         }) 
    })
})
 
app.get('/:id',(req, res) => {
 
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId)
        connection.query('SELECT * FROM lotta WHERE `id` = ?', req.params.id, (err, rows) => { 
            connection.release();
            if(!err){
                //res.send(rows)
                obj = { lotta : rows, Error : err,}
                res.render('showbyid', obj)
            } else {
                console.log(err)
            }
         }) 
    })
})

//POST
app.post('/addlotta',(req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
            const params = req.body
                //Check 
                pool.getConnection((err, connection2) => {
                    connection2.query(`SELECT COUNT(id) AS count FROM lotta WHERE id = ${params.id}`, (err, rows) => {
                        if(!rows[0].count){
                            connection.query('INSERT INTO lotta SET ?', params, (err, rows) => {
                                connection.release()
                                if(!err){
                                    //res.send(`${params.name} is complete adding lotta. `)
                                    obj = {Error:err, mesg : `Success adding lotta ${params.name}`}                                   
                                    res.render('addlotta', obj)
                                }else {
                                    console.log(err)
                                    }
                                })           
                        } else {
                            //res.send(`${params.name} do not insert lotta`)
                            obj = {Error:err, mesg : `Can not adding lotta ${params.name}`}                           
                            res.render('addlotta', obj)
                        }
                    })
                })
    })
})

//DELETE
app.delete('/delete/:id',(req, res) => {
    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log("connected id : ?", connection.threadId)
        connection.query('DELETE FROM `lotta` WHERE `lotta`.`id` = ?', [req.params.id], (err, rows) => {
            connection.release();
            if(!err){ 
                res.send(`${[req.params.id]} is complete delete lotta. `) 
            } else {
                console.log(err)
            }
        })
    })
})

//PUT
app.put('/update',(req, res) => {
    pool.getConnection((err, connection) =>{
        console.log("connected id : ?", connection.threadId)
        const {date, type, id, reward} = req.body 
        connection.query('UPDATE lotta SET type = ?, id = ?, reward = ? WHERE date = ?', [type, id, reward, date], (err, rows) => {
            connection.release();
            if(!err){ 
                res.send(`${type} is complete update lotta. `) 
            } else {
                console.log(err)
            }
        })
    })
})

app.listen(port, () => 
    console.log("listen on port : ?", port)
    )