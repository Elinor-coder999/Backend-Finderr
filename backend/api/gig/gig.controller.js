const gigService = require('./gig.service.js')

const logger = require('../../services/logger.service')

async function getGigs(req, res) {
  try {
    const filterBy = {
      categories: req.query.categories,
      minPrice: +req.query.minPrice || 0,
      maxPrice: +req.query.maxPrice || Infinity,
      daysToMake: +req.query.daysToMake
    }
    const gigs = await gigService.query(filterBy)

    res.json(gigs)
  } catch (err) {
    logger.error('Failed to get gigs', err)
    res.status(400).send({ err: 'Failed to get gigs' })
  }
}

async function getGigById(req, res) {
  try {
    const gigId = req.params.id
    console.log(gigId)
    const gig = await gigService.getById(gigId)
    res.json(gig)
  } catch (err) {
    logger.error('Failed to get gig', err)
    res.status(500).send({ err: 'Failed to get gig' })
  }
}

async function addGig(req, res) {

  if (!req.loggedinUser) {
    res.status(401).send({ err: 'user not found' })
    return
  }

  const { _id: userId } = req.loggedinUser
  
  try {    
    const gig = req.body
    gig.owner_id = userId
    const addedGig = await gigService.add(gig)
    res.json(addedGig)
  } catch (err) {
    logger.error('Failed to add gig', err)
    res.status(500).send({ err: 'Failed to add gig' })
  }
}

async function updateGig(req, res) {
  try {
    const gig = req.body
    const updatedGig = await gigService.update(gig)
    res.json(updatedGig)
  } catch (err) {
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}

async function removeGig(req, res) {
  try {
    const gigId = req.params.id
    const removedId = await gigService.remove(gigId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove gig', err)
    res.status(500).send({ err: 'Failed to remove gig' })
  }
}

module.exports = {
  getGigs,
  getGigById,
  addGig,
  updateGig,
  removeGig,

}
