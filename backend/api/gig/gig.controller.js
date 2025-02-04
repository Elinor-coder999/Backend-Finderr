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
    const gig = await gigService.getById(gigId)
    res.json(gig)
  } catch (err) {
    logger.error('Failed to get gig', err)
    res.status(500).send({ err: 'Failed to get gig' })
  }
}

async function addGig(req, res) {

  if (!req.loggedinUser) {
    res.status(401).send({ err: 'User not found' })
    return
  }
  const { _id: userId } = req.loggedinUser
  try {
    const gig = req.body
    gig.owner_id = userId
    console.log('gig.owner_id', gig.owner_id);
    
    const addedGig = await gigService.add(gig)
    res.json(addedGig)
  } catch (err) {
    logger.error('Failed to add gig', err)
    res.status(500).send({ err: 'Failed to add gig' })
  }
}

async function updateGig(req, res) {
  if (!req.loggedinUser) {
    res.status(401).send({ err: 'User not found' })
    return
  }
  try {
    const gig = req.body
    const gigDb = await gigService.getById(gig._id)
  
    if (req.loggedinUser._id !== gigDb.owner_id.toString()) {
      return res.status(403).send({ err: 'You are not authorized to update this gig' })
    }
    const updatedGig = await gigService.update(gig)
    res.json(updatedGig)
  } catch (err) {
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}

async function AddAndRemoveToWishlist(req, res) {
  if (!req.loggedinUser) {
    res.status(401).send({ err: 'User not found' })
    return
  }
  try {
    const { gigId } = req.body
    if (!gigId) {
      return res.status(400).send({ err: 'Gig ID is required' })
    }
    const gigDb = await gigService.getById(gigId)
    if (!gigDb) {
      return res.status(404).send({ err: 'Gig not found' })
    }
    if (!gigDb.wishList) {
      gigDb.wishList = []
    }
    if (gigDb.wishList.includes(req.loggedinUser._id)) {
      gigDb.wishList = gigDb.wishList.filter(id => id !== req.loggedinUser._id)
      const gigRemoved = await gigService.update(gigDb)
      return res.json(gigRemoved)
    }

    gigDb.wishList.push(req.loggedinUser._id)
    const gigAdded = await gigService.update(gigDb)

    res.json(gigAdded)
  } catch (err) {
    logger.error('Failed to update gig', err)
    res.status(500).send({ err: 'Failed to update gig' })
  }
}


async function removeGig(req, res) {
  if (!req.loggedinUser) {
    res.status(401).send({ err: 'user not found' })
    return
  }
  try {
    const gigId = req.params.id
    const gigDb = await gigService.getById(gigId)
  
    if (req.loggedinUser._id !== gigDb.owner_id) {
      return res.status(403).send({ err: 'You are not authorized to update this gig' })
    }
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
  AddAndRemoveToWishlist,
}
