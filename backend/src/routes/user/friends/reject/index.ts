import { FastifyPluginAsync } from 'fastify'
import { isFriendsPending } from '../../../../utils/friendsMethods'
import { FriendBody } from '../types'

const rejectFriendRequest : FastifyPluginAsync = async(fastify , options) =>
{ 
  fastify.put<{
    Body : FriendBody
  }>("/" , async(request , reply) => 
  {
    const { userId } = request.user
    const { friendId } = request.body

    if(!friendId || !userId)
      throw fastify.httpErrors.badRequest("We doesn't have the needed userId")

    const users = await fastify.store.User.find({
      _id : [ userId , friendId ]
    } , { friendsPending : true , friendsRequest : true })
  
    const [ userRejecting , userToReject ] = users

    if(!userRejecting || !userToReject)    
      throw fastify.httpErrors.notFound("Some of the two users hadn't been found")

    const isPending = isFriendsPending(userToReject , userRejecting)

    if(!isPending)
      throw fastify.httpErrors.notAcceptable("You can't reject to someone that never sent you a friend request")

    try {
      await userRejecting.updateOne({ $pull : { friendsPending : friendId } })      
      await userToReject.updateOne({ $pull : { friendsRequest : userId } })

      return reply.status(200).send("The user has been rejected succesfully")
    } catch (error) {
      fastify.log.error({ error })

      throw fastify.httpErrors.badRequest("Some error happened while the user being rejecting")
    }
  })  
}

export default rejectFriendRequest  