import express from 'express';
import {
  getNoteGroups,
  getNoteGroup,
  createNoteGroup,
  deleteNoteGroup,
} from '../controllers/noteGroupController.js';

const router = express.Router();

router.get('/', getNoteGroups);
router.get('/:id', getNoteGroup);
router.post('/', createNoteGroup);
router.delete('/:id', deleteNoteGroup);

export default router;