module.exports = function (mongoose: any) {
  const { Schema } = mongoose;

  // define User Schema
  const UserSchema = new Schema({
    userParmId: {
      type: String,
      required: "userParmId is required",
    },
    googleId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, "Please type a valid email address"],
      required: "email is required",
      index: {
        unique: true,
      },
    },
    password: {
      type: String,
      default: "",
    },
    salt: {
      type: String,
      default: "",
    },
    activated: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  });

  // index with userParmId
  UserSchema.index({ userParmId: 1 });

  // define User model using UserSchema
  mongoose.model("User", UserSchema);
};
