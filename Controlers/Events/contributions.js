
import Contribution from "../../Models/Events/contributions.js";
import User from "../../Models/Users/users.js";

export const getOpenEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getEventContributions = async (req, res) => {
  try {
    const { eventId } = req.params;

    // fetch all users
    const users = await User.find().select("name email");

    // fetch all contributions for this event
    const contributions = await Contribution.find({ event: eventId });

    // merge users with contributions
    const response = users.map((u) => {
      const match = contributions.find((c) => c.user.toString() === u._id.toString());

      return {
        userId: u._id,
        name: u.name,
        email: u.email,
        promisedAmount: match ? match.promisedAmount : 0,
        paidAmount: match ? match.paidAmount : 0,
        remainingAmount: match ? match.promisedAmount - match.paidAmount : 0,
        finished: match ? match.paidAmount >= match.promisedAmount : false,
      };
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const setPromisedAmount = async (req, res) => {
  try {
    const { userId, eventId, promisedAmount } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ success: false, message: "userId and eventId are required" });
    }

    let record = await Contribution.findOne({ userId, eventId });

    if (!record) {
      record = await Contribution.create({
        userId,
        eventId,
        promisedAmount,
        paidAmount: 0
      });
    } else {
      // promisedAmount should ONLY be set once
      if (record.promisedAmount > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Promised amount already set" });
      }

      record.promisedAmount = promisedAmount;
      await record.save();
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const addPaidAmount = async (req, res) => {
  try {
    const { userId, eventId, paidAmount } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ success: false, message: "userId and eventId are required" });
    }

    const record = await Contribution.findOne({ userId, eventId });

    if (!record) {
      return res.status(404).json({ success: false, message: "Contribution record not found" });
    }

    record.paidAmount += paidAmount;

    await record.save();

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


