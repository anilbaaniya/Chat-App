import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have name."],
    },

    email: {
      type: String,
      required: [true, "A user must have email."],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "A user must have password"],
      minLength: [8, "The length of password should be at least 8 characters."],
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, "A user must have password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password must be same",
      },
    },

    profilePicture: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
      default: false,
    },

    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword,
) {
  return bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = parseInt(
      this.passwordChangedAt.getTIme() / 1000,
      10,
    );
    return tokenIssuedAt < passwordChangedTime;
  }
  return false;
};

export const User = mongoose.model("User", userSchema);
