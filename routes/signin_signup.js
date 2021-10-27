const _ = require('lodash');
const config = require('config');
const express = require('express');
const router = express.Router();
const validate = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

let sql, data;

router.get('/create', async (req, res) => {
    let result;
    sql = 'CREATE TABLE farmer ( id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(40) NOT NULL,email VARCHAR(40) NOT NULL UNIQUE,isAdmin BOOLEAN,password VARCHAR(1000) NOT NULL,successful_order INT DEFAULT 0,phone VARCHAR(10),gst VARCHAR(15),pan VARCHAR(10),bank VARCHAR(15),address VARCHAR(2000),city VARCHAR(15),state VARCHAR(15),pin VARCHAR(15));';
    [result] = await db.promise().query(sql);
    console.log(result);

    sql = 'CREATE TABLE customer ( id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(40) NOT NULL,email VARCHAR(40) NOT NULL UNIQUE,isAdmin BOOLEAN,password VARCHAR(1000) NOT NULL,address VARCHAR(100),phone INT);';
    [result] = await db.promise().query(sql);
    console.log(result);

    sql = 'CREATE TABLE transporter ( id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(40) NOT NULL,email VARCHAR(40) NOT NULL UNIQUE,isAdmin BOOLEAN,password VARCHAR(1000) NOT NULL,successful_deliveries INT DEFAULT 0,phone VARCHAR(10),gst VARCHAR(15),pan VARCHAR(10),bank VARCHAR(15),address VARCHAR(2000),city VARCHAR(15),state VARCHAR(15),pin VARCHAR(15));';
    [result] = await db.promise().query(sql);
    console.log(result);

    sql = 'CREATE TABLE product(id INT AUTO_INCREMENT,farmer_id INT,name VARCHAR(40) NOT NULL,quantity INT NOT NULL,price INT NOT NULL,desction VARCHAR(10000),stars INT DEFAULT 0,deliveries INT DEFAULT 0,feedbacks INT DEFAULT 0,PRIMARY KEY(id, farmer_id),FOREIGN KEY(farmer_id) REFERENCES farmer(id) ON DELETE CASCADE);';
    [result] = await db.promise().query(sql);
    console.log(result);

    sql = 'CREATE TABLE cart(id INT AUTO_INCREMENT,customer_id INT NOT NULL,product_id INT NOT NULL,quantity INT NOT NULL,PRIMARY KEY(id, customer_id, product_id),FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE CASCADE);';
    [result] = await db.promise().query(sql);
    console.log(result);

    sql = "CREATE TABLE orders(id INT AUTO_INCREMENT,customer_id INT NOT NULL,product_id INT NOT NULL,farmer_id INT NOT NULL,transporter_id INT,quantity INT NOT NULL,buyer VARCHAR(40) NOT NULL,address VARCHAR(2000) NOT NULL,mobile VARCHAR(15) NOT NULL,state ENUM('new ', 'accepted', 'shipped', 'delivered'),rating INT,feedback VARCHAR(2000),PRIMARY KEY(id, customer_id, product_id),FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE CASCADE,FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE,FOREIGN KEY(transporter_id) REFERENCES transporter(id) ON DELETE SET NULL);";
    [result] = await db.promise().query(sql);
    console.log(result);

    res.send('tables created');
});

router.post('/signup/:user', async (req, res) => {
    const error = validate(_.pick(req.body, ['name', 'email', 'password', 'confirm_password'])).error;
    if (error) {
        res.status(400).send(error.details[0]);
        return;
    }

    const user = req.params.user;
    sql = 'SELECT * FROM ?? WHERE ??.email= ?';
    data = [user, user, req.body.email];
    let [result] = await db.promise().query(sql, data);
    if (result.length !== 0) return res.status(400).send({
        sameEmail: 'Account with this email already exist'
    });

    const hashed_password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

    sql = `INSERT INTO ${user}(name,email,password) VALUES(?,?,?)`;
    data = [req.body.name, req.body.email, hashed_password];
    await db.promise().query(sql, data);
    // console.log('user added');

    let entry;
    sql = 'SELECT * FROM ?? WHERE ??.email= ?';
    data = [user, user, req.body.email];
    [[entry]] = await db.promise().query(sql, data);
    // console.log('new user', entry);
    const token = jwt.sign(_.pick(entry, ['id', 'name', 'email', 'isAdmin']), config.get('private_key'));
    // console.log(token);
    res.send({
        status: "success",
        token: token
    });
});


router.post('/signin/:category', (req, res) => {
    const category = req.params.category;
    let user;
    sql = 'SELECT * FROM ?? WHERE ??.email= ?';
    data = [category, category, req.body.email];
    db.query(sql, data, async (err, result) => {
        if (err) return res.send(err);
        if (result.length === 0) return res.status(400).send('Invalid email or password');
        user = result[0];

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password');
        }

        const token = jwt.sign(_.pick(user, ['id', 'name', 'email', 'isAdmin']), config.get('private_key'));
        res.header('x-auth-token', token).send(token);
    });

    // sql= `INSERT INTO ${user}(name,email,password) VALUES(?,?,?)`;
    // data= [req.body.name, req.body.email,hashed_password];
    // db.query(sql,data,(err,result)=>{
    //     if(err)return res.send(err);
    //     res.send(result);
    // })


});



module.exports = router;