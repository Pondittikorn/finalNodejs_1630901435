//Open Call Express 
const express = require('express')
const bodyParser = require('body-parser')
 
const mysql = require('mysql')
 
const app = express()
const port = process.env.PORT || 5000;
 
app.use(bodyParser.json())
 
//MySQL Connect phpMyAdmin
const pool = mysql.createPool({
    connectionLimit : 10,
    connectionTimeout : 20,
    host : 'localhost', //www.google.com/sql or Server IP Address
    user : 'root',
    password : '',
    database : 'lotta_database' //Connect Database from beers.sql (Import to phpMyAdmin)
})
 
//GET (เรียกข้อมูลขึ้นมาดู) | POST (ส่งข้อมูลหน้า Website กลับเข้ามา)
app.get('',(req, res) => {
 
    pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
        //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
         
        connection.query('SELECT * FROM lotta', (err, rows) => { 
            connection.release();
            if(!err){ //ถ้าไม่ error จะใส่ในตัวแปร rows
                //console.log(rows)
                //res.json(rows)
                res.send(rows)
            } else {
                console.log(err)
            }
         }) 
    })
})
 
app.get('/:id',(req, res) => {
 
    pool.getConnection((err, connection) => {  //err คือ connect ไม่ได้ or connection คือ connect ได้ บรรทัดที่ 13-20
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId) //ให้ print บอกว่า Connect ได้ไหม
        //console.log(`connected id : ${connection.threadId}`) //ต้องใช้ ` อยู่ตรงที่เปลี่ยนภาษา ใช้ได้ทั้ง 2 แบบ
 
        connection.query('SELECT * FROM lotta WHERE `id` = ?', req.params.id, (err, rows) => { 
            connection.release();
            if(!err){ //ถ้าไม่ error จะใส่ในตัวแปร rows
                res.send(rows)
            } else {
                console.log(err)
            }
         }) 
    })
})

//POST
app.use(bodyParser.urlencoded({extended: false})) 
app.post('/addlotta',(req, res) => {
    pool.getConnection((err, connection) => { 
        if(err) throw err
            const params = req.body
                connection.query('INSERT INTO lotta SET ?', params, (err, rows) => {
                    connection.release()
                    if(!err){
                        res.send(`${params.name} is complete adding lotta. `)
                    }else {
                        console.log(err)
                    }
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

app.listen(port, () => 
    console.log("listen on port : ?", port)
    )