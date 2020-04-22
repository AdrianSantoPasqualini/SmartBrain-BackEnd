const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: "John",
            email: "john@hotmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: "Sally",
            email: "sally@hotmail.com",
            password: bcrypt.hashSync('bananas', 10),
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json("Error Logging In");
    }
});

app.post('/register', (req, res) => {
    const {email, password, name} = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    database.users.push({
        id: 125,
        name: name,
        email: email,
        password: hash,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id == id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {   
        res.status(404).json("User Not Found");
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {   
        res.status(404).json("User Not Found");
    }

})

app.listen(3000);
