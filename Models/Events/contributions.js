import mongoose from "mongoose";

const contributionSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    promisedAmount: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventContribution", contributionSchema);
