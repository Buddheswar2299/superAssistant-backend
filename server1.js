const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//connect mongodb for fill in the blanks
mongoose.connect('mongodb+srv://formUser:Rokkam@cluster0.2jsg2.mongodb.net/FillTheBlanks?retryWrites=true&w=majority&appName=Cluster0')
const connectdbFillTheBlank = mongoose.connection

connectdbFillTheBlank.once('open',()=>{
    console.log('database is connected')
})

connectdbFillTheBlank.on('error',(error)=>{
    console.log(error)
})

const SentenceSchema = new mongoose.Schema({
    sentence: { type: String, required: true },
    underlined: { type: [String], required: true },
});

// Create Model
const Sentence = mongoose.model('Sentence', SentenceSchema);

app.get('/api/getFillform',async(req,res)=>{
    const userObj = await Sentence.find()
    res.status(200).json({data:userObj})
})

app.post('/api/fillForm', async (req, res) => {
    try {
        const { sentence, underlined } = req.body;
        const newSentence = new Sentence({ sentence, underlined });
        await newSentence.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
});

app.put('/api/updatefillForm/:id', async (req, res) => {
    const player_id = req.params.id;
    console.log(player_id);
    console.log(req.body);

    try {
        const result = await Sentence.updateOne({ _id: player_id }, { $set: req.body });

        if (result.nModified === 0) {
            return res.status(404).send({
                success: false,
                message: "No form found with the provided ID."
            });
        }

        res.status(200).send({
            success: true,
            message: "Form details have been updated."
        });
    } catch (error) {
        console.error("Error updating form data:", error);
        res.status(500).send({
            success: false,
            message: "Failed to update form data."
        });
    }
});



// Start the server
const PORT = 2021;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
