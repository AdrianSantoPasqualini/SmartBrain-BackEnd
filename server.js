const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'smart-brain'
    }
});


const app = express();


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        if (bcrypt.compareSync(req.body.password, data[0].hash)) {
            db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to get User"));
        } else {
            res.status(400).json("Wrong Credentials");
        }
    })
    .catch(err => res.status(400).json("Wrong Credentials"));
});

app.post('/register', (req, res) => {
    const {email, password, name} = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(email => {
            db('users').returning("*").insert({
                email: email[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
            
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => {
        res.status(400).json('Unable To Register');
    });
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json("User Not Found");
        }
    })
    .catch(err => {
        res.status(404).json("Error Getting User");
    });
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => {
        res.status(400).json("Unable to get entry count");
    });
})

app.listen(3000);
