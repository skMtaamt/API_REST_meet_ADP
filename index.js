const express = require('express')
const fs = require('fs')
var jwt = require('jsonwebtoken');

const app = express()
app.use(express.json());
const KEY = "key-super-segret"

function verifyUserJwt(token) {
    try {
        jwt.verify(token, KEY);
        return jwt.decode(token);
    } catch(err) {
        return undefined;
    }
}

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

app.post('/group', (req, res) => {
    if(!req.headers.authorization) {
        res.send({"status": false, "response": "not logged"})
        return;
    }
    const user = verifyUserJwt(req.headers.authorization.replaceAll("Bearer ", "")) ? verifyUserJwt(req.headers.authorization.replaceAll("Bearer ", "")) : res.send({"status": false, "response": "not logged"});
    if(!user) return;
    try {
        if(!req.body.group_id) {
            res.send({"status": false, "response": "post data is wrong"});
            return;
        }
        let data = JSON.parse(fs.readFileSync("group.json", 'utf8'));
        if (data[req.body.group_id]["members"].includes(user.id)) {
            res.send({"status": false, "response": "member already in"});
            return;
        }
        data[req.body.group_id]["members"].push(user.id);
        fs.writeFileSync("group.json", JSON.stringify(data));
        res.send({"status": true, "response": "member added in" + req.body.group_id});
    } catch (e) {
        res.send({"status": false, "response": e.toString()});
    }
})

app.listen(3000)