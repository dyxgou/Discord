import { FastifyPluginAsync } from 'fastify'
import {isFriendsAccepted, isFriendsPending} from '../../../../utils/friendsMethods'
import { FriendBody } from '../types'

const acceptFriend : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Body : FriendBody 
  }>("/",  { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId } = request.user
    const { friendId } = request.body

    if(!friendId || !userId)
    {
      throw fastify.httpErrors.badRequest("We doesn't have the need userId")
    }

    const [ userAccepting , userToAccept ] = await fastify.store.User.find({
      _id : [ userId , friendId ] , 
    } , { friends : true , friendsPending : true , friendsRequest : true })

    if(!userAccepting || !userToAccept)    
      throw fastify.httpErrors.notFound("Some of the two users hadn't been found")

    if(userAccepting.id === userToAccept.id)
      throw fastify.httpErrors.badRequest("You can't accept your self")

    const isPending = isFriendsPending(userToAccept , userAccepting)
    
    if(!isPending)
      throw fastify.httpErrors.notAcceptable("The users hasn't sent friends request before")
    
    const isAcceptedBefore = isFriendsAccepted(userAccepting , userToAccept)

    if(isAcceptedBefore)
      throw fastify.httpErrors.notAcceptable("The users are friends right now")

    try {
      await userAccepting.updateOne({ $push : {
        friends : friendId
      } ,  $pull : {
        friendsPending : friendId
      } })

      await userToAccept.updateOne({ $push : {
        friends : userId
      } ,  $pull : {
        friendsRequest : userId
      } })

      return reply.status(200).send("The friend request has been accepted")
    } catch (error) {
      console.error({ error });
      
      throw fastify.httpErrors.badRequest("Cannot accept this user")
    }
  }) 
}

export default acceptFriend