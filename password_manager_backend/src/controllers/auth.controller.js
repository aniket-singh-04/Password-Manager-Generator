import argon2 from 'argon2';
import { User } from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });

    const user = await User.create({ name, email, passwordHash });
    const token = signAccessToken(user);

    res.status(201).json({ user: user.toSafeJSON(), token });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ user: user.toSafeJSON(), token: signAccessToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

