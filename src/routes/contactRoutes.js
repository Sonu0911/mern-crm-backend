const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const c = require('../controllers/contactController');

router.use(protect);
router.get('/', c.getContacts);
router.post('/', c.createContact);
router.put('/:id', c.updateContact);
router.delete('/:id', c.deleteContact);

module.exports = router;