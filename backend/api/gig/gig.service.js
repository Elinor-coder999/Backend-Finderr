const { log } = require('../../middlewares/logger.middleware')
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria', criteria)
        const collection = await dbService.getCollection('gig_db')
        var gigs = await collection.find(criteria).toArray()
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

// function _buildCriteria(filterBy, userId) {
//     let criteria = {}
//     if (userId) {
//         criteria = { "owner._id": ObjectId(userId) }
//     } else {
//         if (filterBy.title) {
//             criteria.title = { $regex: filterBy.title, $options: 'i' }
//         }
//         if (filterBy.maxPrice === '') filterBy.maxPrice = Infinity
//         if (filterBy.minPrice && filterBy.maxPrice) {
//             criteria = { ...criteria, "$and": [{ "price": { "$gte": +filterBy.minPrice } }, { "price": { "$lte": +filterBy.maxPrice } }] }
//         }
//         if (filterBy.daysToMake) {
//             criteria.daysToMake = { $lte: +filterBy.daysToMake || Infinity }
//         }

//         if (filterBy.category){
//             criteria.tags = {$regex: filterBy.title, $options: 'i' }
//         }
//     }
//     return criteria
// }

function _buildCriteria(filterBy){
    let criteria = {}
    console.log('filterBy.category', filterBy.category)
    if (filterBy.category){
        criteria.tags = {'$all': [filterBy.category] }
        console.log(' criteria.tags',  criteria.tags)
    }

    if (filterBy.minPrice || filterBy.maxPrice) {
        criteria = { 
            ...criteria, 
            "$and": [
                { price: { $gte: filterBy.minPrice } },
                { price: { $lte: filterBy.maxPrice } }
            ]
        }
    }

    if (filterBy.daysToMake) {
        criteria.daysToMake = { $lte: +filterBy.daysToMake || Infinity }
    }

    // if(filterBy.category){
    //     criteria.search = { $text: { $search:filterBy.search }}
    // }
    
    return criteria

}
async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig_db')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}
async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig_db')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        return gigId
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}
async function add(gig) {
    try {
        gig.owner._id = ObjectId(gig.owner._id)
        gig.owner.rate = 4
        gig.owner.ratingsCount = 638
        gig.owner.level = 'basic/premium'
        const collection = await dbService.getCollection('gig_db')
        await collection.insertOne(gig)
        return gig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}
async function update(gig) {
    try {
        const gigToSave = {
            price: gig.price,
            title: gig.title,
            description: gig.description,
            tags: gig.tags,
            daysToMake: gig.daysToMake,
            imgUrl: gig.imgUrl,
            wishList: gig.wishList,
        }
        const collection = await dbService.getCollection('gig_db')
        await collection.updateOne({ _id: ObjectId(gig._id) }, { $set: gigToSave })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gig._id}`, err)
        throw err
    }

}
async function addMsgToChat(msg, gigId) {
    try {
        console.log('gigId', gigId);
        const collection = await dbService.getCollection('gig_db')
        // const toy = await collection.findOne({ "_id": ObjectId(toyId) })
        // toy.chatHistory = toy.chatHistory ? [...toy.chatHistory, msg] : [msg]
        // await collection.replaceOne({ '_id': ObjectId(toyId) }, toy)
        // Can be done with $push!
        await collection.updateOne({ '_id': ObjectId(gigId) }, { $push: { chat: msg } })
    } catch (err) {
        console.log(`ERROR: cannot add message to gig`)
        throw err;
    }
}
// async function addMsgToChat(msg, gigId) {
//     try {
//         console.log('gigId', gigId);
//         const collection = await dbService.getCollection('gig')
//         // const toy = await collection.findOne({ "_id": ObjectId(gigId) })
//         // toy.chatHistory = toy.chatHistory ? [...toy.chatHistory, msg] : [msg]
//         // await collection.replaceOne({ '_id': ObjectId(gigId) }, toy)
//         // Can be done with $push!
//         await collection.updateOne({ '_id': ObjectId(gigId) }, { $push: { chatHistory: msg } })
//     } catch (err) {
//         console.log(`ERROR: cannot add message to gig`)
//         throw err;
//     }
// }
// async function addGigMsg(gigId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('gig')
//         await collection.updateOne({ _id: ObjectId(gigId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add gig msg ${gigId}`, err)
//         throw err
//     }
// }
// async function removeGigMsg(gigId, msgId) {
//     try {
//         const collection = await dbService.getCollection('gig')
//         await collection.updateOne({ _id: ObjectId(gigId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add gig msg ${gigId}`, err)
//         throw err
//     }
// }
module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addMsgToChat
    // addMsgToChat
    // addGigMsg,
    // removeGigMsg
}