import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { signToken } from '../utils/jwt.js';
import { decrypt, encrypt } from '../utils/encryption.js';
import { validateOnlyFansCredentialsMock } from './onlyFansService.js';

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
};

export const loginWithOnlyFans = async (username: string, apiToken: string, password?: string) => {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedToken = apiToken.trim();

  const validation = await validateOnlyFansCredentialsMock({
    username: normalizedUsername,
    token: normalizedToken,
    password,
  });

  if (!validation.valid) {
    throw new Error('Invalid OnlyFans credentials');
  }

  const existingAccount = await prisma.connectedAccount.findFirst({
    where: {
      platform: 'onlyfans',
      username: normalizedUsername,
    },
  });

  if (existingAccount) {
    const storedToken = decrypt(existingAccount.encryptedToken);
    if (storedToken !== normalizedToken) {
      throw new Error('Invalid OnlyFans credentials');
    }

    if (existingAccount.encryptedPassword) {
      const storedPassword = decrypt(existingAccount.encryptedPassword);
      if (!password || storedPassword !== password) {
        throw new Error('Invalid OnlyFans credentials');
      }
    }

    if (!existingAccount.encryptedPassword && password) {
      await prisma.connectedAccount.update({
        where: { id: existingAccount.id },
        data: { encryptedPassword: encrypt(password) },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: existingAccount.userId } });
    if (!user) {
      throw new Error('Account owner not found');
    }

    return {
      token: signToken({ userId: user.id, email: user.email }),
      user: { id: user.id, email: user.email },
    };
  }

  const baseEmail = `${normalizedUsername}@onlyfans.local`;
  const emailSuffix = crypto.randomBytes(3).toString('hex');
  const generatedEmail = `${normalizedUsername}+${emailSuffix}@onlyfans.local`;

  const existingUser = await prisma.user.findUnique({ where: { email: baseEmail } });
  const email = existingUser ? generatedEmail : baseEmail;
  const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      accounts: {
        create: {
          platform: 'onlyfans',
          username: normalizedUsername,
          encryptedToken: encrypt(normalizedToken),
          encryptedPassword: password ? encrypt(password) : null,
        },
      },
    },
  });

  return {
    token: signToken({ userId: user.id, email: user.email }),
    user: { id: user.id, email: user.email },
  };
};
