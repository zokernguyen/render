const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const Person = require('./models/person.js')

require("dotenv").config();

//server init
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

//# morgan
morgan.token("reqBody", (req, res) => {
    return JSON.stringify(req.body);
});

//#error handler middleware
const errorHandler = (error, req, res, next) => {
    console.error(error);

    switch (error.name) {
        case "CastError":
            res.status(400).json({ error: 'malformatted id' });
            break;
        case "ValidationError":
            res.status(400).json({ error: error.message });
            break;
        default:
            next(error);
    }
};

const customFormat = ':method :url :status :res[content-length] - :response-time ms :reqBody';

app.use(morgan(customFormat));

//run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//routes

// GET - info page
app.get('/info', async (req, res) => {
    try {
        const dateOptions = {
            weekday: "short",
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'long',
            timeZone: 'GMT',
        };

        const date = new Date().toLocaleString("en-US", dateOptions);

        const persons = await Person.find({});

        res.send(
            `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
      </div>`
        );
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

//GET - show all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons));
});

//GET - filter person by id
app.get("/api/persons/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const person = await Person.findById(id);

        if (!person) res.status(404).end();

        res.json(person);
    } catch (error) {
        next(error);
    };
});

//DELETE - remove person by id
app.delete("/api/persons/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const delPerson = await Person.findByIdAndDelete(id);

        if (!delPerson) {
            return res.status(404)
                .send('The Person with the given ID was not found');
        };
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// POST - add new person
app.post("/api/persons", async (req, res, next) => {
    const body = req.body;

    try {
        const person = new Person({
            name: body.name,
            number: body.number
        });

        const savedPerson = await person.save();

        res.json(savedPerson);

    } catch (error) {
        next(error);
    }
});

//PUT - update contact number
app.put('/api/persons/:id', async (req, res, next) => {
    try {
        const { name, number } = req.body;
        const updatedPerson = {
            name,
            number
        };

        const update = await Person.findByIdAndUpdate(
            req.params.id,
            updatedPerson,
            {
                new: true,
                runValidators: true,
                context: "query"
            });
        res.json(update);
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);