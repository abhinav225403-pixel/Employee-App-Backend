const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
// Task1: initiate app and run server at 3000

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 



const uri = 'mongodb+srv://abhinav225403_db_user:XU1z4apEzbiOg4eW@cluster0.padohc0.mongodb.net/?appName=Cluster0';

const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('EmployeeDB');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

connectDB();

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await db.collection('employees').find({}).toArray();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});



app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        const employee = await db.collection('employees').findOne({
            _id: new ObjectId(id)
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});




app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        if (!name || !location || !position || salary === undefined) {
            return res.status(400).json({ error: 'All employee fields are required' });
        }

        const employee = {
            name,
            location,
            position,
            salary
        };

        const result = await db.collection('employees').insertOne(employee);

        res.status(201).json({
            message: 'Employee added successfully',
            _id: result.insertedId,
            ...employee
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add employee' });
    }
});





app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        const result = await db.collection('employees').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});




app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        const { name, location, position, salary } = req.body;

        const result = await db.collection('employees').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { name, location, position, salary }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
});
//Request body format:{name:'',location:'',position:'',salary:''}


//! dont delete this code. it connects the front end file.
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/Frontend/index.html'));
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


