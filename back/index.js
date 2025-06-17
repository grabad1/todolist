require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');          // sigurnosni headeri
const connectDB = require('./mongo');
const Task = require('./models/task');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test ruta pre bilo kakvih API-ja
app.get('/', (req, res) => {
    res.send('Server radi i povezan je sa bazom!');
});

app.get('/test-db', async (req, res) => {
    try {
        await Task.findOne();
        res.json({ status: 'OK', message: 'Povezan sa bazom i može da čita' });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', message: 'Ne može da se poveže sa bazom', error: err.message });
    }
});

// GET /tasks - Dohvati sve taskove
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Greška pri dohvatanju taskova:', error);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

// POST /tasks - Dodaj novi task
app.post('/tasks', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Polje "text" je obavezno' });
        }

        const newTask = new Task({ text, done: false });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Greška pri dodavanju taska:', error);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

// DELETE /tasks/:id - Briši task po id-u
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task nije pronađen' });
        }

        res.json({ message: 'Task obrisan', deletedTask });
    } catch (error) {
        console.error('Greška u DELETE /tasks/:id:', error);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

// PATCH /tasks/:id - Ažuriraj task
app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const allowedUpdates = ['text', 'done'];
    const updates = Object.keys(req.body);

    // Validacija dozvoljenih polja
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ message: 'Nepoznata polja za ažuriranje' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task nije pronađen' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error('Greška prilikom ažuriranja taska:', error);
        res.status(500).json({ message: 'Greška prilikom ažuriranja taska', error });
    }
});

// Pokretanje servera sa povezivanjem na bazu
async function startServer() {
    try {
        await connectDB();
        console.log('Povezan sa bazom.');
        app.listen(PORT, () => {
            console.log(`Server je pokrenut na http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Neuspešno povezivanje sa bazom:', error);
        process.exit(1);  // Exit process sa greškom
    }
}

startServer();