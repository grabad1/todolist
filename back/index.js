const express = require('express');
const cors = require('cors');
const connectDB = require('./mongo');         // konekcija sa bazom
const Task = require('./models/task');         // model taska (ovo možeš koristiti kasnije u rutama)

const app = express();
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.use(express.json());
    app.use(cors());

    // Ovde idu tvoji API endpoint-i, na primer:
    app.get('/', (req, res) => {
        res.send('Server radi i povezan je sa bazom!');
    });

    // Primer GET /tasks ruta (koristi model Task da izvlači podatke iz baze)
    app.get('/tasks', async (req, res) => {
        try {
            const tasks = await Task.find();  // Uzima sve zadatke iz baze
            res.json(tasks);
        } catch (error) {
            console.error('Greška pri dohvatanju taskova:', error);
            res.status(500).json({ error: 'Greška na serveru' });
        }
    });

    // Ostale rute (POST, DELETE, PATCH) ideš nakon što testiraš ovaj GET
    app.post('/tasks', async (req, res) => {
        try {
            const { text } = req.body;
            const newTask = new Task({
                text,
                done: false
            });
            const savedTask = await newTask.save(); // Sačuvaj u bazi
            res.status(201).json(savedTask);
        } catch (error) {
            console.error('Greška pri dodavanju taska:', error);
            res.status(500).json({ error: 'Greška na serveru' });
        }
    });
    app.delete('/tasks/:id', async (req, res) => {
        try {
            const id = req.params.id; // MongoDB _id je string
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

    app.patch('/tasks/:id', async (req, res) => {
        const { id } = req.params;
        const updates = req.body; // očekuje { done: true/false } ili bilo koje drugo polje koje ažuriraš

        try {
            const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task nije pronađen' });
            }
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom ažuriranja taska', error });
        }
    });
    //dsafsafasaff
    app.listen(PORT, () => {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Neuspešno povezivanje sa bazom:', error);
});