const Joi= require('joi');
const {JoiPassword}= require('joi-password');
// const config= require('config');
// const mysql= require('mysql');

// const db= mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: config.get('database_password'),
//     database: 'agricultural_management_system'
// });

// db.connect(err=>{
//     if(err)console.log(err);;
//     console.log('Connected to agro database');
// });

// let sql,data;

// sql= 'SHOW CREATE TABLE farmer;'
// db.query(sql,(err,result)=>{
//     if(err){
//         console.log(err);
//         sql= 'CREATE TABLE farmer ( farmer_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL UNIQUE, isAdmin BOOLEAN,password VARCHAR(1000) NOT NULL,rating DECIMAL(2,1) NOT NULL DEFAULT 0,successful_order INT NOT NULL DEFAULT 0 );'
//         db.query(sql,(err,res)=>{
//             if(err)console.log(err);
//             console.log(res);
//         })
//     }
//     console.log(result);
// });

function validateUser(user){
    const schema= Joi.object({
        name: Joi.string().min(3).max(40).required(),
        email: Joi.string().required().email(),
        password: JoiPassword.string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
        confirm_password: Joi.ref('password')
    });
    return schema.validate(user);
}

module.exports= validateUser;