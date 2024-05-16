import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { procreate, deletewin, getwins, updatewin } from '../controllers/win.controller.js';

const router = express.Router();

router.post('/procreate', verifyToken, procreate)
router.get('/getwins', getwins)
router.delete('/deletewin/:winId/:userId', verifyToken, deletewin)
router.put('/updatewin/:winId/:userId', verifyToken, updatewin)


export default router;