import argon2 from 'argon2';
import { User } from '../models/User.js';

export async function updateProfile(req, res, next) {
  try {
    const emailOwner = await User.findOne({ email: req.body.email, _id: { $ne: req.user._id } });
    if (emailOwner) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    req.user.name = req.body.name;
    req.user.email = req.body.email;
    await req.user.save();

    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const isValid = await argon2.verify(req.user.passwordHash, currentPassword);

    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    req.user.passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });
    await req.user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
}

