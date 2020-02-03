const connectionPool = require('../database-connection');
const getAdminQuery = 'select * from admins where username=?';
const getLearnerQuery = 'select * from learners where username=?';
const addAdmin = "insert into admins(name,username,password,designation,field) values(?,?,?,?,?);";
const addLearner = "insert into learners(name,username,password,designation,field) values(?,?,?,?,?);";
const getNextQuestion = "select * from question where quizId = ? and isAnswered = 0;"


// const config = require('../config/variables');
let controllers = {
    getNextQuestion: async (req, res) => {
        
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getNextQuestion, req.body.quizId, (err, results, fields) => {
                if(err){
                    res.send({
                        code:1 ,
                        message: 'an error occured while fetching details'
                    });
                }
                res.send({
                    code:1 , data : results[0]
                });
            });
            conn.release();        
        });
    }
}

module.exports = controllers;