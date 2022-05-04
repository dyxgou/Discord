import { Type , Static } from '@sinclair/typebox'

const sendRequestBody = Type.Object(
  {
    friendEmail : Type.String()
  }
)

export type SendBody = Static<typeof sendRequestBody>