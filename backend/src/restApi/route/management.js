import express from 'express'
const router = express.Router()
import management from '../controller/management'

// GET request for list of all items
router.get('/', management.list)
router.post('/add', management.add)
router.post('/remove', management.remove)
export default router