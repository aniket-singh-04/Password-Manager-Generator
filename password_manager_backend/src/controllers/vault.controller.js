import { VaultEntry } from '../models/VaultEntry.js';
import { decryptSecret, encryptSecret } from '../services/crypto.service.js';

function serializeEntry(entry, includePassword = true) {
  return {
    id: entry._id.toString(),
    websiteName: entry.websiteName,
    websiteUrl: entry.websiteUrl,
    username: entry.username,
    password: includePassword ? decryptSecret(entry.password) : undefined,
    notes: entry.notes,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  };
}

export async function createEntry(req, res, next) {
  try {
    const entry = await VaultEntry.create({
      user: req.user._id,
      websiteName: req.body.websiteName,
      websiteUrl: req.body.websiteUrl,
      username: req.body.username,
      password: encryptSecret(req.body.password),
      notes: req.body.notes || ''
    });

    res.status(201).json({ entry: serializeEntry(entry) });
  } catch (error) {
    next(error);
  }
}

export async function listEntries(req, res, next) {
  try {
    const search = String(req.query.search || '').trim();
    const filter = search
      ? {
          user: req.user._id,
          $or: [
            { websiteName: new RegExp(search, 'i') },
            { websiteUrl: new RegExp(search, 'i') },
            { username: new RegExp(search, 'i') },
            { notes: new RegExp(search, 'i') }
          ]
        }
      : { user: req.user._id };

    const entries = await VaultEntry.find(filter).sort({ updatedAt: -1 });
    res.json({ entries: entries.map((entry) => serializeEntry(entry)) });
  } catch (error) {
    next(error);
  }
}

export async function updateEntry(req, res, next) {
  try {
    const updates = {
      websiteName: req.body.websiteName,
      websiteUrl: req.body.websiteUrl,
      username: req.body.username,
      notes: req.body.notes || ''
    };

    if (req.body.password) {
      updates.password = encryptSecret(req.body.password);
    }

    const entry = await VaultEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Password entry not found.' });
    }

    res.json({ entry: serializeEntry(entry) });
  } catch (error) {
    next(error);
  }
}

export async function deleteEntry(req, res, next) {
  try {
    const entry = await VaultEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) {
      return res.status(404).json({ message: 'Password entry not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const [totalPasswords, recentEntries] = await Promise.all([
      VaultEntry.countDocuments({ user: req.user._id }),
      VaultEntry.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      totalPasswords,
      recentlyAdded: recentEntries.map((entry) => serializeEntry(entry, false))
    });
  } catch (error) {
    next(error);
  }
}

