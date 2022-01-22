const express = require('express')
const fs = require('fs')
var jwt = require('jsonwebtoken');
const app = express()
app.use(express.json());
const KEY = "key-super-segret"
app.post('/login', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync("users.json", 'utf8'))
        if(req.body.user && req.body.pass) {
            data[req.body.user]["pass"] === req.body.pass ? res.send({"status": true, "response": jwt.sign({ id: data[req.body.user]["id"], user: req.body.user, type: data[req.body.user]["type"]}, KEY, {expiresIn: 604800})}) : res.send({"status": false, "response": "username/password wrong"});
            return;
        }
        res.send({"status": false, "response": "post data wrong"});
    } catch (e) {
        res.send({"status": false, "response": e.toString()});
    }
})


app.listen(3000)