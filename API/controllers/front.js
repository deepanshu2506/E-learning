const connectionPool = require('../database-connection');
const _ = require('lodash');
const getNextQuestion = "select * from question where quizId = ? and isAnswered = 0;"
const startSession = "select * from quizSessions where quizCode = ?";
const createSession = "insert into quizSessions(quizCode,startTime,numberOfUsers) values (?,ADDTIME(now(), '00:00:30'),?);";
const addUserToSession = "insert into quizUsers(quizCode,UserId,sessionId) values (?,?,?);";
const joinSession = "update quizSessions set numberOfUsers = ? where id = ?;";
const getNumberOfActiveUsers = "select numberOfUsers from quizsessions where id = ?";
const validateCode = "select * from quizes where quizCode = ?";
const getQuiz = 'select * from question where quizId = ?';

const setAnswer = 'insert into useranswer(questionId,answerOption,userId,sessionId) values (?,?,?,?)';
const getAnalysis = 'select * from useranswer where questionId = ? and sessionId = ?';

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
    },
    getActiveUsers: async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getNumberOfActiveUsers, req.body.sessionId, (err, results, fields) => {
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details'
                    });
                }
                res.send({
                    code:1 , users : results[0].numberOfUsers
                });
            });
            conn.release();        
        });
    },
    joinSession: async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }

            conn.query(validateCode , req.body.quizCode , (err,re,fields)=>{
                // console.log(re[0].quizId)
                if(re.length == 0){
                    res.send({code: 0 , message: "invalid code"})
                }
                else{
                    conn.query(startSession, req.body.quizCode, (err, results, fields) => {
                        if(results.length == 0){
                            res.send({code: 0 })
                        }
                        if(err){
                            res.send({
                                code:0 ,
                                message: 'an error occured while fetching details'
                            });
                        }
                        results = _.filter(results,function(sessions){
                            startTime = new Date(sessions.startTime);
                            // console.log(startTime.getHours() +"  " + startTime.getMinutes());
                            return (startTime - new Date())/1000 > 10; 
                        });
                        // console.log(results);
                        if(results.length == 0){
                            conn.query(createSession , [req.body.quizCode,1] , function(err,resu,fields){
                                // res.send({code:1,sessionId: results.insertId});
                                if(err){
                                    console.log(err);
                                }
                                conn.query(addUserToSession ,[req.body.quizCode,req.body.userId,resu.insertId],function(err,r,fields){
                                    if(err){
                                        console.log(err);
                                    }
        
                                    res.send({
                                        code: 1,
                                        sessionId: resu.insertId,
                                        numberOfUsers:1,
                                        timeRemaining: 30,
                                        quizCode:'df',
                                        quizId:re[0].quizId
                                    })
                                });
                            });
                        }
                        else{
                            conn.query(joinSession , [results[0].numberOfUsers + 1,results[0].id],function(err,resu,fields){
                                if(err){
                                    console.log(err);
                                }
                                conn.query(addUserToSession ,[req.body.quizCode,req.body.userId,results[0].id],function(err,r,fields){
                                    if(err){
                                        console.log(err);
                                    }
        
                                    res.send({
                                        code: 1,
                                        sessionId: results[0].id,
                                        numberOfUsers:results[0].numberOfUsers + 1,
                                        timeRemaining: (new Date(results[0].startTime) - new Date())/1000,
                                        quizId:re[0].quizId
                                    });
                                });
                            });
                        }
                    });
                }
            });
            
            conn.release();        
        });
    },
    getQuiz: async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getQuiz, req.body.quizId, (err, results, fields) => {
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details'
                    });
                }
                res.send({
                    code:1 , quiz: results
                });
            });
            conn.release();        
        });
    },
    setAnswer:async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(setAnswer, [req.body.questionId,req.body.answer,req.body.userId,req.body.sessionId], (err, results, fields) => {
                if(err){
                    console.log(err)
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details'
                    });
                }
                res.send({
                    code:1 
                });
            });
            conn.release();        
        });
    },
    getAnalysis:async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(getAnalysis, [req.body.questionId,req.body.sessionId], (err, results, fields) => {
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details'
                    });
                }
                res.send({
                    code:1,data:results
                });
            });
            conn.release();        
        });
    }
}

module.exports = controllers;