import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 

// После проверки учетных данных создайте новую getUserфункцию, которая запрашивает пользователя из базы данных.
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
// Поставщик учетных данных позволяет пользователям входить в систему с использованием имени пользователя и пароля.

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
    providers: [
    //   Добавление функции входа в систему
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
//  запрашивает пользователя из базы данных.
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
            if (!user) return null;
//  bcrypt.compareчтобы проверить, совпадают ли пароли:
            const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});