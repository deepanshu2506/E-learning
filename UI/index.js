var express = require('express');
var app = express();
const cors = require('cors');
var path = require('path');
// var chatRoutes = require('./routes/populate-chatbot');
// var adminRoutes = require('./routes/admin-routes');
// var loginRoutes = require('./routes/loginRoutes');

app.use(cors())
app.use(express.static('./static'));

// app.use('/admin',adminRoutes);

// app.use('/chat', chatRoutes);

// app.use('/login', loginRoutes);

app.get('/login', (req, res) => {
    res.sendfile(path.join(__dirname + '/static/login.html'))
});
app.listen(8080);

module.exports = app;