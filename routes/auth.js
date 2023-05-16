import express from 'express'
import {login} from '../controller/atuh.js';

const router =express.Router()


router.post('/login', login);

export default router;