const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getGigs, getGigById, addGig, updateGig, removeGig} = require('./gig.controller')
const router = express.Router()


router.get('/', log, getGigs)
router.get('/:id', getGigById)
router.post('/',  addGig) //requireAuth
router.put('/:id', updateGig)
router.delete('/:id', removeGig)

module.exports = router