import { FastifyPluginAsync } from 'fastify'
import isFriendsPending from '../../../../utils/isFriendsPending'
import { SendRequest } from '../types'

const acceptFriend : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Body : SendRequest
  }>("/",  { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId } = request.user
    const { userIdToAccept } = request.body

    if(!userIdToAccept)
    {
      throw fastify.httpErrors.badRequest("We don't have the need userId")
    }

    const users = await fastify.store.User.find({
      _id : [ userId , userIdToAccept ] , 
    })

    const [ userAccepting , userToAccept ] = users

    const isPending = isFriendsPending(userAccepting , userToAccept)
    
    if(!isPending)
      throw fastify.httpErrors.notAcceptable("The users hasn't sent friends request before")

    try {
      await userAccepting.updateOne({ $push : {
        friends : userIdToAccept
      } ,  $pull : {
        friendsPending : userIdToAccept
      } })

      await userToAccept.updateOne({ $push : {
        friends : userId
      } ,  $pull : {
        friendsRequest : userId
      } })

      return reply.status(200).send("Friend request accepted")
    } catch (error) {
      console.error({ error });
      
      throw fastify.httpErrors.badRequest("Cannot accept this user")
    }
  }) 
}

export default acceptFriend