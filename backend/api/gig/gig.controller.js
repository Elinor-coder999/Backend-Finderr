const gigService = require('./gig.service.js')

const logger = require('../../services/logger.service')

// async function getGigs(req, res) {
//   try {
//       console.log('req.query.params:', req.query.params)

//       const params = typeof req.query.params === 'string' 
//           ? JSON.parse(req.query.params) 
//           : req.query.params

//       const { filterBy, userId } = params || {}

//       logger.debug('Getting Gigs');
//       const gigs = await gigService.query(filterBy,  userId)
//       res.json(gigs)
//   } catch (err) {
//       logger.error('Failed to get gigs', err);
//       res.status(500).send({ err: 'Failed to get gigs' })
//   }
// }

// async function getGigs(req, res) {
//   const { filterBy } = JSON.parse(req.query.params)
//   const { sortBy } = JSON.parse(req.query.params)
//   const { userId } = JSON.parse(req.query.params)
//   try {
//     logger.debug('Getting Gigs')
//     const gigs = await gigService.query(filterBy, sortBy, userId)
//     res.json(gigs)
//   } catch (err) {
//     logger.error('Failed to get gigs', err)
//     res.status(500).send({ err: 'Failed to get gigs' })
//   }
// }

 async function getGigs(req, res) {
	try {
		const filterBy = {
			minSpeed: +req.query.minSpeed || 0,
		}
		const gigs = await gigService.query(filterBy)
    console.log('gigsssss',gigs);
    
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
  const { loggedinUser } = req
  try {
    const gig = req.body
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
