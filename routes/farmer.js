const express = require('express');
const router = express();
const authenticate = require('../middleware/authenticate')
const admin = require('../middleware/admin')
const validate = require('../models/products');
const db = require('../config/db');

// Profile
router.get('/get_profile', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM farmer WHERE id= ?;';
    data = [req.user.id];
    let [result] = await db.promise().query(sql, data);
    res.json(result[0]);
});

router.post('/set_profile', authenticate, async (req, res) => {
    let sql, data;
    sql = 'UPDATE farmer SET contactAddress=?,phone=?,gst=?,pan=?,bank=?,address=?, city=?, state=?, pin=? WHERE id= ?;'
    data = [req.body.contract, req.body.phone, req.body.gst, req.body.pan, req.body.bank, req.body.address, req.body.city, req.body.state, req.body.pin, req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});


// Inventory
router.get('/getProducts/myproducts', authenticate, (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM product WHERE farmer_id= ?;';
    data = [req.user.id];
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.post('/addProduct', authenticate, async (req, res) => {
    const error = validate(req.body).error;
    if (error) {
        res.status(400).send(error.details[0]);
        return;
    }
    let sql, data;
    sql = 'INSERT INTO product(farmer_id,name,quantity,price,desction) VALUES (?,?,?,?,?);'
    data = [req.user.id, req.body.name, req.body.quantity, req.body.price, req.body.desc];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});


// Orders
router.get('/newProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE farmer_id= ? AND state= 1;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.put('/newProducts/:id', authenticate, async (req, res) => {
    let sql, data;
    sql = 'UPDATE orders SET state = ? WHERE id= ?;'
    data = [2, req.params.id];
    const [result] = await db.promise().query(sql, data);
    sql = 'UPDATE product SET quantity = ? WHERE id = ?';
    data = [req.body.remQuantity, req.body.product_id];
    await db.promise().query(sql, data);
    res.send(result);
});

router.get('/acceptedProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE farmer_id= ? AND state= 2;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.get('/shippedProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE farmer_id= ? AND state= 3;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.get('/deliveredProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE farmer_id= ? AND state= 4;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.get('/getTransporter/:id', authenticate, async (req, res) => {
    sql = 'SELECT * FROM transporter WHERE id= ?;';
    data = [req.params.id];
    let [result] = await db.promise().query(sql, data);
    res.send(result[0]);
});


// Feedback
router.get('/getraf', authenticate, async (req, res) => {
    let sql, data, result;
    sql = "SELECT * FROM orders WHERE farmer_id= ? AND state= 4 AND NOT rating = 'null'";
    data = [req.user.id];
    [result] = await db.promise().query(sql, data);
    res.send(result);
});


module.exports = router;