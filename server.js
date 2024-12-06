const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB for categorize 
mongoose.connect('mongodb+srv://formUser:Rokkam@cluster0.2jsg2.mongodb.net/formDate?retryWrites=true&w=majority&appName=Cluster0')
const connectdbCategorize = mongoose.connection

connectdbCategorize.once('open',()=>{
    console.log('database is connected')
})

connectdbCategorize.on('error',(error)=>{
    console.log(error)
})
const FormSchema = new mongoose.Schema({
    question: String,
    description: String,
    categories: [
      {
        id: Number,
        name: String,
      },
    ],
    items: [
      {
        item: String,
        belongsTo: String,
      },
    ],
  });
  
const Form = mongoose.model("Form", FormSchema);

app.get('/',(req,res)=>{
    res.status(200).json({messag:'hello server1.js'})
})
// API Endpoint to save form data
app.post("/api/forms", async (req, res) => {
  const formData = req.body;

  try {
    const newForm = new Form(formData);
    await newForm.save();
    res.status(200).json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Failed to save form data." });
  }
});

app.get('/api/getForms',async(req,res)=>{
    const userObj = await Form.find()
    res.status(200).send({data: userObj})
})

app.put('/api/updateForm/:id', async (req, res) => {
    const player_id = req.params.id;
    console.log(player_id);
    console.log(req.body);

    try {
        const result = await Form.updateOne({ _id: player_id }, { $set: req.body });

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
const PORT = 2020;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
