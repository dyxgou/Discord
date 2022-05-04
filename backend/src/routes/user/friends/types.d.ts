import { Type , Static } from '@sinclair/typebox'

const friendsBodyRequest = Type.Object(
  {
    friendId : Type.String()
  }
)

export type FriendBody = Static<typeof friendsBodyRequest>