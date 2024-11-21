const express = require('express');
const app = express();
const PORT = process.env.PORT ?? 1234;
const fs = require('fs');
const path = require('path');
const usersList = require('./users.json');
const cors = require('cors');
app.use(express.urlencoded());
app.use(cors({

    origin: (origin,callb) => {
        return callb(null,true);
    }
}));


app.set('view engine','ejs');

app.use(express.static(path.join('./instafake/','public')));
app.use(express.json());
app.use(function(req, res, next) {
  res.setTimeout(5000, function() { // 5 seconds timeout
    console.log('Request timed out');
    res.status(408).send('Request Timeout');
  });
  next();
});
app.get('/gimmeusers', (req,res) => {
res.header('Access-Control-Allow-Origin','*')
//console.log(usersList);
res.download('users.json');

});


app.get('/', (req,res) => {
//console.log(usersList);
res.render('index.html')

});

app.post('/user',(req,res) => {
   const {
    user,
    password
   } = req.body;
   
   const newUser = {
    user, password
   };
   usersList.push(newUser);

   fs.writeFile('users.json', JSON.stringify(usersList,null,2), 'utf-8', (err) => {
    if(err){
        console.log('error leyendo al usuario');
        return res.status(500).send('error interno del servidor');
    }
    // console.log(path.join(__dirname,'instafake','public','indio.html'));
    res.sendFile(path.join(__dirname,'./instafake','public','indio.html'));
   });
   
   
})
/*app.get('/user', (req, res) => {
   res.render('indio.html');

})*/

app.listen(PORT, () => {
    console.log(`Server listening on PORT http://localhost${PORT}`)
})
