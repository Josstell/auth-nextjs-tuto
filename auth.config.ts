//import GitHub from 'next-auth/providers/github'

import bcrypt from 'bcryptjs'

import type { NextAuthConfig } from 'next-auth'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { getUserByEmail } from '@/data/user'
import Credentials from 'next-auth/providers/credentials'
import { LoginSchema } from '@/schemas'

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        console.log('Data valid', validatedFields)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          console.log('user', user, passwordsMatch)

          if (passwordsMatch) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
