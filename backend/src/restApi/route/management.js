import express from 'express'
const router = express.Router()
import management from '../controller/management'
import project from "../controller/project";

// GET request for list of all items
router.get('/', management.list)
router.post('/add', management.validationRules('add'), management.validate, management.add)
router.post('/remove', management.validationRules('remove'), management.validate, management.remove)
export default router