const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');

// Get all persons
router.get('/', personController.getAllPersons);

// Get a single person
router.get('/:id', personController.getPersonById);

// Create a new person
router.post('/', personController.createPerson);

// Update a person
router.put('/:id', personController.updatePerson);

// Delete a person
router.delete('/:id', personController.deletePerson);

module.exports = router;