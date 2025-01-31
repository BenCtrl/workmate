import express from 'express';
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/', getPages);
router.get('/:id', getPage);
router.post('/', createPage);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

export default router;