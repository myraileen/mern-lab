const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET ALL USERS
router.get('/', (req, res) => {
    User.find().then(users => res.json(users))
  })	

// GET USER BY ID
router.get("/:id", (req, res) => {
    User.findById(req.params.id).then(user => res.json(user))
});

// CREATE A USER
router.post("/", (req, res) => {
    User.create(req.body).then(newUser => res.json(newUser))
});

// UPDATE A USER
router.put("/:id", (req, res) => {});

// DELETE A USER
router.delete("/:id", (req, res) => {});

module.exports = router;
