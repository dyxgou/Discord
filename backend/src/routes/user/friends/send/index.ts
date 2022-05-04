import { FastifyPluginAsync } from 'fastify'
import { isFriendsPending } from '../../../../utils/friendsMethods'
import { SendBody } from './types'

const sendFriendRequest : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Body : SendBody
  }>("/" , { onRequest : fastify.auth } ,  async(request , reply) => 
  {
    const { userId } = request.user
    const { friendEmail } = request.body

    if(!friendEmail || !userId)
      throw fastify.httpErrors.badRequest("We doesn't have the needed information")

    const [ userSending , userToSend ] = await Promise.all([
      fastify.store.User.findById(userId , { friendsRequest : true }),
      fastify.store.User.findOne({ email : friendEmail } , { friendsPending : true })
    ])
    
    
    if(!userSending || !userToSend)    
      throw fastify.httpErrors.notFound("Some of the two users hadn't been found")
    
    if(userSending.id === userToSend?.id) 
      throw fastify.httpErrors.badRequest("You can't send a friend request to your self")

    const isPending = isFriendsPending(userSending , userToSend)

    if(isPending)
      throw fastify.httpErrors.notAcceptable("You can't send a friend request to someone that you've sent it before")

    try {
      await userSending.updateOne({ $push : { friendsRequest : userToSend._id } })
      await userToSend.updateOne({ $push : { friendsPending : userId } })

      return reply.status(200).send("The friend request has been sent")
    } catch (error) {
      fastify.log.error({ error });
      
      throw fastify.httpErrors.badRequest("Some error happened while the friend request is sending")
    }
  })
}

export default sendFriendRequest