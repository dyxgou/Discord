import { IUser } from "../schemas/UserSchema";

type User = (IUser & {
  _id: any;
})

export const isFriendsPending = (userSending : User , userToSend : User) => 
{
  const { friendsRequest } = userSending
  const { friendsPending } = userToSend 

  const isPending = friendsRequest.includes(userToSend._id) && friendsPending.includes(userSending._id)
  
  return isPending
}

export const isFriendsAccepted = (userSending : User , userToSend : User) => 
{
  
  const { friends : sendingFriends} = userSending
  const { friends : toSendFriends} = userToSend
  

  const isAccepted =  sendingFriends.includes(userToSend.id) && toSendFriends.includes(userSending.id)

  return isAccepted
}
