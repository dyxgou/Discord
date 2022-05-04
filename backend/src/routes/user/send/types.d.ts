import { Type , Static } from '@sinclair/typebox'

const sendRequestBody = Type.Object(
  {
    userIdToAccept : Type.String()
  }
)

export type SendRequest = Static<typeof sendRequestBody>