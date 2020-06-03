import express from 'express'
const router = express()
import student from './student'

// Documentation
// https://expressjs.com/en/api.html#router

// Hallgatókat kezelő útvonalak
router.use('/student', student)
export default router