const connectionPool = require('../database-connection');
const getAdminQuery = 'select * from admins where username=?';
const getLearnerQuery = 'select * from learners where username=?';
const addAdmin = "insert into admins(name,username,password,designation,field) values(?,?,?,?,?);";
const addLearner = "insert into learners(name,username,password,designation,field) values(?,?,?,?,?);";
const getLearner = "select * from learners where learnerId = ?;";

// const config = require('../config/variables');
let controllers = {
    authenticateAdmin: async (req, res) => {
        if (req.body.password == undefined) {
            res.send({ code: 0, message: "password not specified" });
        }
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getAdminQuery, req.body.username, (err, results, fields) => {
                console.log(err);
                console.log(results)
                if (results.length == 0) {
                    res.send({code:0, message:'username incorrect'})
                }
                else {
                    if (req.body.password === results[0].password) {
                        res.send({ code: 1, message: 'user authenticated',user:results[0] });    
                    }
                    else {
                        res.send({ code: 0, message: 'password does not match' });
                    }   
                }
                
            });
            conn.release();        
        });
    },
    authenticateLearner: async (req, res) => {
        if (req.body.password == undefined) {
            res.send({ code: 0, message: "password not specified" });
        }
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getLearnerQuery, req.body.username, (err, results, fields) => {
                if (results.length == 0) {
                    res.send({code:0, message:'username incorrect'})
                }
                else {
                    if (req.body.password === results[0].password) {
                        res.send({ code: 1, message: 'user authenticated',user:results[0] });    
                    }
                    else {
                        res.send({ code: 0, message: 'password does not match' });
                    }   
                }
                
            });
            conn.release();        
        });
        
    },

    register: async (req,res)=>{
        if(req.body.type == undefined || req.body.username == undefined || !req.body.name == undefined || !req.body.designation == undefined || req.body.field == undefined || req.body.password == undefined){
            res.send({code: 0 , message: "all fields are compulsory"});
        }
        else{
            if(req.body.type == 0){
                connectionPool.getConnection((err,conn) => {
                    if(err){
                        res.send({code : 0 , message : 'could  not connect '})
                    }
                    conn.query(getAdminQuery, req.body.username, (err, results, fields) => {
                        console.log(err);
                        console.log(results)
                        if (results.length != 0) {
                            res.send({code:0, message:'user already present'})
                        }
                        else{
                            var data = [req.body.name , req.body.username,req.body.password , req.body.designation,req.body.field]
                            conn.query(addAdmin,data, (err, results, fields) => {
                                if(err){
                                    res.send({code:0,err,message:'error has occured'});
                                }
                                res.send({
                                    code:1,
                                    message:'Admin successfully registered'
                                })
                            });
                        }
                    });
                   
                    conn.release();        
                });
            }else{
                connectionPool.getConnection((err,conn) => {
                    if(err){
                        res.send({code : 0 , message : 'could  not connect '})
                    }
                    conn.query(getLearnerQuery, req.body.username, (err, results, fields) => {
                        console.log(err);
                        console.log(results)
                        if (results.length != 0) {
                            res.send({code:0, message:'user already present'})
                        }
                        else{
                            var data = [req.body.name , req.body.username,req.body.password , req.body.designation,req.body.field]
                            conn.query(addLearner,data, (err, results, fields) => {
                                if(err){
                                    res.send({code:0,err,message:'error has occured'});
                                }
                                res.send({
                                    code:1,
                                    message:'Admin successfully registered'
                                })
                            });
                        }
                    });
                   
                    conn.release();        
                });
            }
        }
    },
    getUser: async (req,res)=>{
        if(req.body.learnerId == undefined){
            res.send({code:0})
        }
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
                conn.query(getLearner,req.body.learnerId, (err, results, fields) => {
                if(err){
                    res.send({code:0,err,message:'error has occured'});
                }
                res.send({
                    code:1,
                    message:'user found'
                })
            });
            conn.release();        
        });
    }
}

module.exports = controllers;