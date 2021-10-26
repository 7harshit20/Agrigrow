const _ = require('lodash');
const config = require('config');
const express = require('express');
const router = express.Router();
const validate = require('../models/users');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

let sql, data;

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