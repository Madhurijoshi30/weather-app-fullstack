const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String,  required: true,  trim: true },
  email:      { type: String,  required: true,  unique: true, lowercase: true, trim: true },
  password:   { type: String,  required: true,  minlength: 6 },
  favourites: [{ type: String }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password changed
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password on login
userSchema.methods.comparePassword = async function(plainPassword) {
  try {
    return await bcrypt.compare(plainPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('User', userSchema);