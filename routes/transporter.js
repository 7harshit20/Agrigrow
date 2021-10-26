const express = require('express');
const router = express();
const authenticate = require('../middleware/authenticate')
const admin = require('../middleware/admin')
const db = require('../config/db');

// Available orders
router.get('/acceptedProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE state= 2;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.put('/acceptedProducts/:id', authenticate, async (req, res) => {
    let sql, data;
    sql = 'UPDATE orders SET state = ? WHERE id= ?;'
    data = [3, req.params.id];
    let [result] = await db.promise().query(sql, data);
    sql = 'UPDATE orders SET transporter_id = ? WHERE id= ?;'
    data = [req.user.id, req.params.id];
    [result] = await db.promise().query(sql, data);
    res.send(result);
});


// Shipped orders
router.get('/shippedProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE state= ? AND transporter_id = ?;'
    data = [3, req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.put('/shippedProducts/:id', authenticate, async (req, res) => {
    let sql, data;
    sql = 'UPDATE orders SET state = ? WHERE id= ?;'
    data = [4, req.params.id];
    let [result] = await db.promise().query(sql, data);

    sql = 'UPDATE transporter SET successful_deliveries = successful_deliveries + 1 WHERE id= ?;'
    data = [req.user.id];
    await db.promise().query(sql, data);

    sql = 'SELECT * FROM orders WHERE id= ?;'
    data = [req.params.id];
    [result] = await db.promise().query(sql, data);

    sql = 'UPDATE farmer SET successful_order = successful_order + 1 WHERE id= ?;'
    data = [result[0].farmer_id];
    await db.promise().query(sql, data);

    sql = 'UPDATE product SET deliveries = deliveries + 1 WHERE id= ?;'
    data = [result[0].product_id];
    await db.promise().query(sql, data);

    res.send(result);
});


// Delivered orders
router.get('/deliveredProducts', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE state= 4 AND transporter_id = ?;'
    data = [req.user.id, , req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});


// Profile
router.get('/get_profile', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM transporter WHERE id= ?;';
    data = [req.user.id];
    let [result] = await db.promise().query(sql, data);
    res.json(result[0]);
});

router.post('/set_profile', authenticate, async (req, res) => {
    let sql, data;
    sql = 'UPDATE transporter SET phone=?,gst=?,pan=?,bank=?,address=?, city=?, state=?, pin=? WHERE id= ?;'
    data = [req.body.phone, req.body.gst, req.body.pan, req.body.bank, req.body.address, req.body.city, req.body.state, req.body.pin, req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});


module.exports = router;