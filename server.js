const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));


// events array initialized so when user adds any event it will be added here
let events = [];
let eventId = 1;

// Routing 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/create.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/events.html'));
});


// API 


// gets the data in events and serves it
app.get('/api/events', (req, res) => {
res.status(200).json(events);
}
);


// pushes the data coming from the user to events array but before that it checks if title and time is provided
app.post('/api/events', (req, res) => {
    const {title, startTime, endTime, location} = req.body;

    if (!title || !startTime || !endTime || !location) {
        return res.status(400).json({
            message: 'Title, Start Date/Time, End Date/Time, and Location are required'
        });
    }

    const newEvent = {
        id: eventId++,
        title, date, startTime, endTime, location
    };
    events.push(newEvent);
    res.status(201).json(newEvent)

});

// when delete is trieggered it this function will look for the index of that event and delete it.

app.delete('/api/events/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const index = events.findIndex(event => event.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            message: 'Event does not exist already'
        })

    }

    events.splice(index, 1);

    res.status(200).json({
        message: 'Event deleted'
    });
});

// this is just for safety, incase some route is provided but it does not exist
app.use((req, res) => {
    res.status(404).json({
        message: 'Route does not exist'
    });
});


// for starting the server

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});