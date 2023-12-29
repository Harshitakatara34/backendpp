const express = require("express");
const { NoteModel } = require("../Model/notes.model");
const notes = express.Router();

notes.post("/create", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Assuming req.user._id is set by the auth middleware
    const newNote = new NoteModel({
      title,
      description,
      userId: req.user.userId,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notes.get("/notes", async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.user.userId }).sort({
      createdAt: "desc",
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notes.delete("/notes/:id", async (req, res) => {
  try {
    await NoteModel.findByIdAndDelete(req.params.id);
    res.send({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notes.put("/notes/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedNote = await NoteModel.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// notes.get("/notes/:page", async (req, res) => {
//   const { page } = req.params;
//   const { authorId } = req.body;
//   const limit = 3;
//   let skipped = (page - 1) * limit;

//   const note = await NoteModel.find({ authorId });

//   if (note.length==0) {
//     res.status(404).send("Note not found");
//   } else {
//     console.log(note)
//     let data = await NoteModel.find({ authorId })
//       .skip(skipped)
//       .limit(limit);
//     res.json({ notes: data });
//   }
// });

module.exports = {
  notes,
};
