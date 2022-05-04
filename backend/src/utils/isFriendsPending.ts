import { IUser } from "../schemas/UserSchema";

type User = IUser & {
  _id: any;
}

const isFriendsPending = (userSending : User , userToSend :  User) => 
{
  const friendsPending = new Set(userSending.friendsPending)
  const friendsRequest = new Set(userToSend.friendsRequest)

  const isPending = friendsPending.has(userSending._id) && friendsRequest.has(userToSend._id)
  
  return isPending
}

export default isFriendsPending