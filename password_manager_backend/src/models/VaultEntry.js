import mongoose from 'mongoose';

const encryptedFieldSchema = new mongoose.Schema(
  {
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const vaultEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    websiteName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    password: {
      type: encryptedFieldSchema,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    }
  },
  { timestamps: true }
);

vaultEntrySchema.index({ user: 1, websiteName: 'text', websiteUrl: 'text', username: 'text', notes: 'text' });

export const VaultEntry = mongoose.model('VaultEntry', vaultEntrySchema);

