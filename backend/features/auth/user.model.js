const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // By default, don't include password in query results
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // New users are not admins by default
    },
  },
  {
    // 2. Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// 3. Mongoose "Hook": Code that runs BEFORE a document is 'saved'
// We use a regular function() here, not an arrow function,
// so that 'this' refers to the user document.
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next(); // Go to the next middleware (do nothing)
  }

  // Generate a 'salt' - a random string to make the hash unique
  const salt = await bcrypt.genSalt(10); // 10 is the "cost" or strength
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  
  // Continue with the save operation
  next();
});



// 4. Add a custom 'method' to the User model
// This will let us call `user.matchPassword(password)`
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// 5. Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;