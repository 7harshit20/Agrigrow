const express = require('express');
const router = express();
const authenticate = require('../middleware/authenticate')
const db = require('../config/db');


// SEARCH
router.get('/getFarmer/:id', authenticate, async (req, res) => {
    sql = 'SELECT * FROM farmer WHERE id= ?;';
    data = [req.params.id];
    let [result] = await db.promise().query(sql, data);
    res.send(result[0]);
});

router.get('/getProducts/', (req, res) => {
    sql = 'SELECT * FROM product;'
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/getProducts/:product', authenticate, (req, res) => {
    sql = 'SELECT * FROM product WHERE name= ?;';
    data = [req.params.product];
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.post('/addToCart', authenticate, async (req, res) => {
    sql = 'INSERT INTO cart(customer_id, product_id , quantity) VALUES (?,?,?);'
    data = [req.user.id, req.body.product_id, req.body.quantity];
    // console.log(data);
    const [result] = await db.promise().query(sql, data);
    res.send(result);
})

// CART
router.get('/getCart', authenticate, async (req, res) => {
    sql = 'SELECT * FROM cart WHERE customer_id = ?'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.json(result);
})

router.get('/getProducts/id/:id', authenticate, async (req, res) => {
    sql = 'SELECT * FROM product WHERE id= ?;';
    data = [req.params.id];
    const [result] = await db.promise().query(sql, data);
    res.json(result[0]);
});

router.delete('/deleteFromCart/', authenticate, async (req, res) => {
    sql = 'DELETE FROM cart WHERE customer_id=?;';
    data = [req.user.id];
    await db.promise().query(sql, data);
    res.send('Item deleted');
});

router.delete('/deleteFromCart/:id', authenticate, async (req, res) => {
    sql = 'DELETE FROM cart WHERE id= ?;';
    data = [req.params.id];
    const [result] = await db.promise().query(sql, data);
    res.send('Item deleted');
});

router.post('/placeOrder', authenticate, async (req, res) => {
    sql = 'INSERT INTO orders(customer_id, product_id, farmer_id, quantity, buyer, address, mobile, state) VALUES (?,?,?,?,?,?,?,?);'
    data = [req.user.id, req.body.product_id, req.body.farmer_id, req.body.quantity, req.body.buyer, req.body.address, req.body.mobile, 1];
    try {
        const [result] = await db.promise().query(sql, data);
        res.send(result);
    } catch (error) {
        res.send([{
            error
        }])
    }
});


// ORDERS
router.get('/orders', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM orders WHERE customer_id= ?;'
    data = [req.user.id];
    const [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.get('/getTransporter/:id', authenticate, async (req, res) => {
    let sql, data;
    sql = 'SELECT * FROM transporter WHERE id= ?;';
    data = [req.params.id];
    let [result] = await db.promise().query(sql, data);
    res.send(result[0]);
});

router.put('/graf/:id', authenticate, async (req, res) => {
    let sql, data, result, ri = 0, fi = 0;
    sql = 'SELECT rating, feedback FROM orders WHERE id=?;'
    data = [req.params.id];
    [result] = await db.promise().query(sql, data);
    console.log(result);
    if (!result[0].feedback) fi = 1;
    if (!result[0].rating) ri = req.body.rating;
    else ri = req.body.rating - result[0].rating;
    sql = 'UPDATE orders SET rating = ? , feedback = ? WHERE id= ?;';
    data = [req.body.rating, req.body.feedback, req.params.id];
    [result] = await db.promise().query(sql, data);
    sql = 'UPDATE product SET stars = stars + ?, feedbacks = feedbacks + ?  WHERE id= ?;';
    data = [ri, fi, req.body.product_id];
    [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.get('/payment/:id', authenticate, async (req, res) => {
    let sql, data, result;
    // sql = 'UPDATE orders SET paid = true WHERE id = ?';
    // data = [req.body.id];
    [result] = await db.promise().query(sql, data);
    res.send(result);
});

router.put('/order/:id', authenticate, async (req, res) => {
    let sql, data, result;
    sql = 'UPDATE orders SET paid = true WHERE id = ?';
    data = [req.body.id];
    [result] = await db.promise().query(sql, data);
    res.send(result);
});

module.exports = router;
