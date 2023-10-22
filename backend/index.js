const express = require("express");
const joi = require("joi");
const morgan = require("morgan");

//server init
const app = express();

//middlewares
app.use(express.json());

//# morgan
morgan.token("reqBody", (req, res) => {
   return JSON.stringify(req.body);
});

const customFormat = ':method :url :status :res[content-length] - :response-time ms :reqBody';

app.use(morgan(customFormat));

//data point
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

//run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

//utility functions
const genNewId = () => {
    return Math.floor(Math.random() * (persons.length * 100));
};

//schemas
const personSchema = joi.object({
    id: joi.number(),
    name: joi.string().required(),
    number: joi.string().required()
});

//routes
app.get("/info", (req, res) => {

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

    res.send(
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    </div>`
    )
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    
    if (!person) {
        return res.status(404)
            .send('The Person with the given ID was not found');
    };

    res.body = person;

    res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        return res.status(404)
            .send('The Person with the given ID was not found');
    };

    persons = persons.filter(person => person.id !== id);

    res.status(204)
});

app.post("/api/persons", (req, res) => {
    const person = {
        id: genNewId(),
        name: req.body.name,
        number: req.body.number
    };

    const { error } = personSchema.validate(person);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    };

    if (persons.find(p => p.name === req.body.name)) {
        return res.status(409).json('Name must be unique');
    };

    persons=[...persons, person];
    res
        // .json(person)
        .send('is add to phonebook');
});