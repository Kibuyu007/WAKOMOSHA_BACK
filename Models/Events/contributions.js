import mongoose from "mongoose";

const contributionSchema = mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Contribution", contributionSchema);
