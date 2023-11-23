const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express();
app.use(cors())
const port = 3000;
const secretkey ='256-bit-secret';
app.get('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'example',
        email: 'user@example.com'
    };
    const token = jwt.sign(user, secretkey, {expiresIn: '1h'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000
    });
    res.send('logged in with httponly cookies');
});
app.get('/something', (req, res) => {
    const verify = jwt.verify(req.cookies['token'], secretkey)
    console.log(verify)
    res.send("verified")
})
app.listen(port, () => {
    console.log(`listening at port ${port}`);
});