import { Schema , Document } from "mongoose"


export interface IUser extends Document
{
  email : string,
  password : string,
  username : string,
  tag : number,
  friends : Schema.Types.ObjectId[] & IUser
  friendsPending : Schema.Types.ObjectId[] & IUser,
  friendsRequest : Schema.Types.ObjectId[] & IUser,
  avatar : string,
  cover : string,
  aboutMe : string,
}


const UserSchema = new Schema<IUser>(
  {
    email : {
      type : String,
      unique : true,
      required :true
    },
    password : {
      type : String,
      required : true,
    },
    username : {
      type : String,
      required : true, 
    },
    tag : {
      type : Number,
      default : Math.floor(Math.random() * 9999)
    },
    aboutMe : {
      type : String,
      max : 250
    },
    cover : {
      type : String,      
    },
    avatar : {
      type : String,
    },
    friends : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
    friendsPending : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
    friendsRequest : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
  },
  {
    timestamps : true
  }
)

export default UserSchema