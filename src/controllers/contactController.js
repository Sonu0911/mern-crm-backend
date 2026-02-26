const Contact = require('../models/Contact');
const ActivityLog = require('../models/ActivityLog');

exports.getContacts = async (req, res) => {
  try {
    const { page=1, limit=10, search, status } = req.query;
    const query = { createdBy: req.user.id };
    if (search) query.$text = { $search: search };
    if (status) query.status = status;
    const skip = (page-1)*limit;
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(+skip).limit(+limit),
      Contact.countDocuments(query)
    ]);
    res.json({ contacts, pagination: { total, page: +page, limit: +limit, totalPages: Math.ceil(total/+limit) }});
  } catch(err) { res.status(500).json({ message: err.message }); }
};

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, createdBy: req.user.id });
    await ActivityLog.create({ user: req.user.id, action: 'ADD', contact: contact.name, details: `Added contact: ${contact.name}` });
    res.status(201).json(contact);
  } catch(err) { res.status(500).json({ message: err.message }); }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await ActivityLog.create({ user: req.user.id, action: 'EDIT', contact: contact.name, details: `Updated contact: ${contact.name}` });
    res.json(contact);
  } catch(err) { res.status(500).json({ message: err.message }); }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!contact) return res.status(404).json({ message: 'Not found' });
    await ActivityLog.create({ user: req.user.id, action: 'DELETE', contact: contact.name, details: `Deleted contact: ${contact.name}` });
    res.json({ message: 'Deleted' });
  } catch(err) { res.status(500).json({ message: err.message }); }
};