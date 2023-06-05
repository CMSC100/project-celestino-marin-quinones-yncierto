import mongoose from "mongoose";
import bcrypt from "bcrypt";
import csvParser from "csv-parser";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  initials: { type: String },
  studentNumber: { type: String },
  userType: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  adviser: { type: mongoose.Schema.Types.ObjectId },
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }
      console.log(user.password);
      user.password = hash;
      console.log(user.password);
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

const User = mongoose.model("User", UserSchema);

export default User;
