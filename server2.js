const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://formUser:Rokkam@cluster0.2jsg2.mongodb.net/Comprehension?retryWrites=true&w=majority&appName=Cluster0');

const connectdbComprehension = mongoose.connection

connectdbComprehension.once('open',()=>{
    console.log('database is connected')
})

connectdbComprehension.on('error',(error)=>{
    console.log(error)
})

// Schema
const QuestionSchema = new mongoose.Schema({
  passage: String,
  questions: [
    {
      question: String,
      options: [String],
      selectedOption: String,
    },
  ],
});

const Comprehension = mongoose.model('Comprehension', QuestionSchema);

app.get('/api/getComprehend',async(req,res)=>{
    const userObj = await Comprehension.find()
    res.status(200).json({data:userObj})
})

app.post('/api/save', async (req, res) => {
  try {
    const { passage, questions } = req.body;

    const newComprehension = new Comprehension({
      passage,
      questions,
    });

    await newComprehension.save();
    res.status(200).send({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error saving data', error });
  }
});

app.put('/api/comprehensionfillForm/:id', async (req, res) => {
    const player_id = req.params.id;
    console.log(player_id);
    console.log(req.body);

    try {
        const result = await Comprehension.updateOne({ _id: player_id }, { $set: req.body });

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
app.listen(2022, () => {
  console.log('Server is running on http://localhost:2022');
});
