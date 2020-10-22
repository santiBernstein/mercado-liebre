const express = require('express');
const app = express();
const path = require('path');

app.listen(3030, () => console.log('Server running in 3030 port'));


app.get('/', function(req,res){
    let file = path.resolve('vistas/index.html')
    res.sendFile(file)
});

app.get('/register', function(req,res){
    let file = path.resolve('vistas/register.html')
    res.sendFile(file)
});

app.get('/login', function(req,res){
    let file = path.resolve('vistas/login.html')
    res.sendFile(file)
});


app.get('*', function (req,res){
    if (req.url.endsWith('.css')) {
        let file = path.resolve('public/styles' + req.url)
        return res.sendFile(file)
    }

    let images = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg']
    let ext = req.url.split('.')[1]

    if (images.includes(ext)){
        let file = path.resolve('public/images' + req.url)
        return res.sendFile(file)
    }
})    