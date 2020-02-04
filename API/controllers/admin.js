const connectionPool = require('../database-connection');
const _ = require('lodash');
const shortid = require('shortid');
// const getNextQuestion = "select * from question where quizId = ? and isAnswered = 0;"
const createQuiz = "insert into quizes(QuizName,field,adminId) values (?,?,?);";
const createQuestion = "insert into question(question,timeLimit ,option1,option2,option3,option4,answers,quizId) values (?,60,?,?,?,?,?,?);"
const validateQuiz = 'update quizes set quizCode = ? where quizId = ?'
const getQuizes = 'select QuizName,quizId, time from quizes where adminId = ?';
const getQuestions = "select * from question where quizId = ?";
const getAnswers = "select * from useranswer where questionId = ?";
const getUsername = "select * from learners where userId = ?";
// const config = require('../config/variables');
let controllers = {
    createQuiz: async (req, res) => {
        if(req.body.quizName == undefined || req.body.field == undefined || req.body.adminId == undefined){
            res.send({code:0 , message:" all fields are required"});
        }
        else{

            connectionPool.getConnection((err,conn) => {
                if(err){
                    res.send({code : 0 , message : 'could  not connect '})
                }
                
                conn.query(createQuiz, [req.body.quizName , req.body.field,req.body.adminId], (err, results, fields) => {
                    if(err){
                        res.send({
                            code:0 ,
                            message: 'an error occured while fetching details'
                        });
                    }
                    res.send({
                        code:1 , quizId:results.insertId
                    });
                });
                conn.release();        
            });
        }
    },
    createQuestion: async (req,res)=>{
        const questionData = [req.body.question , req.body.option1,req.body.option2,req.body.option3,req.body.option4,JSON.stringify(req.body.answersarr),req.body.quizId];
        console.log(questionData)
        if(req.body.question == undefined || req.body.option1 == undefined || req.body.option2 == undefined || req.body.option3 == undefined || req.body.option4 == undefined || req.body.answersarr.length == 0){
            res.send({code:0 , message:" all fields are required"});
        }
        else{

            connectionPool.getConnection((err,conn) => {
                if(err){
                    res.send({code : 0 , message : 'could  not connect '})
                }
                
                conn.query(createQuestion,questionData , (err, results, fields) => {
                    if(err){
                        res.send({
                            code:0 ,
                            message: 'an error occured while fetching details',
                            err
                        });
                    }
                    res.send({
                        code:1 , quizId:results.insertId
                    });
                });
                conn.release();        
            });
        }
    },
    validateQuiz: async (req,res)=>{
        let quizCode = shortid.generate();

        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            
            conn.query(validateQuiz,[quizCode , req.body.quizId] , (err, results, fields) => {
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details',
                        err
                    });
                }
                res.send({
                    code:1 , quizCode
                });
            });
            conn.release();        
        });
    },
    getQuizes: async (req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            
            conn.query(getQuizes,[req.body.adminId] , (err, results, fields) => {
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details',
                        err
                    });
                }
                res.send({
                    code:1 ,
                    data: results
                });
            });
            conn.release();        
        });
    },
    getQuizData: async(req,res)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            
            conn.query(getQuestions,[req.body.quizId] , (err, results, fields) => {
                let data = [];
                if(err){
                    res.send({
                        code:0 ,
                        message: 'an error occured while fetching details',
                        err
                    });
                }
                for(question in result){
                    let eachData = {}
                    eachData['question'] = question.question;
                    eachData['answers'] = [];
                    conn.query(getAnswers,[question.questionId] , (err, results, fields) => {

                        if(err){
                            res.send({
                                code:0 ,
                                message: 'an error occured while fetching details',
                                err
                            });
                        }
                        for(answer in results){
                            let eachAnswer = {};
                            eachAnswer['answer'] = answer.answerOption
                            conn.query(getUsername,[answer.userId] , (err, results, fields) => {
                                if(err){
                                    res.send({
                                        code:0 ,
                                        message: 'an error occured while fetching details',
                                        err
                                    });
                                }

                                let username = results.username;
                                eachAnswer['username'] = username;
                            });
                            eachData['answers'].push(eachAnswer);
                        }
                    });
                    data.push(eachData)
                }
            });
            conn.release();        
        });
    }
};

module.exports = controllers;