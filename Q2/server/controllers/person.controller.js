const Person = require('../models/person.model');

// Get all persons
exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving persons', error: error.message });
  }
};

// Get a single person by ID
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving person', error: error.message });
  }
};

// Create a new person
exports.createPerson = async (req, res) => {
  try {
    const { name, age, gender, mobile } = req.body;
    
    // Create a new person
    const person = new Person({
      name,
      age,
      gender,
      mobile
    });
    
    // Save the person
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(400).json({ message: 'Error creating person', error: error.message });
  }
};

// Update a person
exports.updatePerson = async (req, res) => {
  try {
    const { name, age, gender, mobile } = req.body;
    
    // Find and update the person
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, mobile },
      { new: true, runValidators: true }
    );
    
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.status(200).json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: 'Error updating person', error: error.message });
  }
};

// Delete a person
exports.deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);
    
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error: error.message });
  }
};