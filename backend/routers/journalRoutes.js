const express = require("express")
const { authUser } = require("../middlewares/authMiddleware")
const {createJournalEntry, getJournalEntries, getJournalEntryById, deleteJournalEntry} = require("../controllers/journalController")

const router = express.Router()

router.post("/", authUser, createJournalEntry)
router.get("/", authUser, getJournalEntries)
router.get("/:id", authUser, getJournalEntryById)
router.delete("/:id", authUser, deleteJournalEntry)

module.exports = router
