const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/passwordDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const passwordSchema = new mongoose.Schema({
    website: String,
    username: String,
    password: String
});

const Password = mongoose.model('Password', passwordSchema);

app.listen(port, () => {
    console.log('Server listening at http://localhost:%s', port);
});

app.get('/passwords', async (req, res) => {
    const passwords = await Password.find();
    res.json(passwords);
});

app.post('/passwords', async (req, res) => {
    const { website, username, password } = req.body;

    const newPassword = new Password({ website, username, password });
    await newPassword.save();
    res.status(201).json(newPassword);
});

app.put('/passwords/:id', async (req, res) => {
    const { website, username, password } = req.body;

    const updatedPassword = await Password.findByIdAndUpdate(
        req.params.id,
        { website, username, password },
        { new: true }
    );
    res.json(updatedPassword);
});

app.delete('/passwords/:id', async (req, res) => {
    try {
        const result = await Password.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ message: 'Password not found' });
        }
        res.send({ message: 'Password deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
