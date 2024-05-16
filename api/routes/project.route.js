import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { procreate, deleteproject, getprojects, updateproject } from '../controllers/project.controller.js';

const router = express.Router();

router.post('/procreate', verifyToken, procreate)
router.get('/getprojects', getprojects)
router.delete('/deleteproject/:projectId/:userId', verifyToken, deleteproject)
router.put('/updateproject/:projectId/:userId', verifyToken, updateproject)


export default router;