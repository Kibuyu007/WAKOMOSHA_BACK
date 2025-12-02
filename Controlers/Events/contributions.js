import Contribution from "../../Models/Events/contributions.js";
import User from "../../Models/Users/users.js"; 
import Event from "../../Models/Events/events.js"; 

// Save or update contribution for a user
export const saveContribution = async (req, res) => {
  try {
    const { eventId, userId, amount } = req.body;

    // Check if contribution already exists
    let contribution = await Contribution.findOne({ event: eventId, user: userId });

    if (contribution) {
      // Update existing contribution (add amount)
      contribution.amount += amount; // add to existing
      await contribution.save();
    } else {
      // Create new contribution
      contribution = await Contribution.create({
        event: eventId,
        user: userId,
        amount,
      });
    }

    res.status(200).json({
      message: "Contribution saved successfully",
      contribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contributions for a specific event
export const getEventContributions = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch all users
    const users = await User.find().select("firstName secondName lastName email contacts");

    // Fetch contributions for this event
    const contributions = await Contribution.find({ event: eventId });

    // Map contributions for easy lookup
    const contribMap = {};
    contributions.forEach((c) => {
      contribMap[c.user.toString()] = c.amount;
    });

    // Merge contributions with users
    const merged = users.map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      secondName: u.secondName,
      lastName: u.lastName,
      email: u.email,
      contacts: u.contacts,
      paidAmount: contribMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      eventId,
      users: merged,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/contributions/eventSummary
export const eventsSummary = async (req, res) => {
  try {
    // 1. Get all open events
    const events = await Event.find({ status: "open" });

    if (!events || events.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Get all users once (we use this to compute totals)
    const users = await User.find().select("_id");
    const totalUsers = users.length;

    const summaries = [];

    for (const event of events) {
      // Fetch all contributions for this event
      const contributions = await Contribution.find({ event: event._id });

      // totalPaid = sum of contribution.amount
      const totalPaid = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);

      // totalPromised — if you don't have promised field in Contribution, keep 0
      // (If you add promisedAmount later, change this to sum promisedAmount)
      const totalPromised = contributions.reduce((sum, c) => sum + (c.promisedAmount || 0), 0);

      // number of unique users who paid > 0
      const paidUserIds = new Set(
        contributions.filter((c) => (c.amount || 0) > 0).map((c) => c.user.toString())
      );
      const usersPaidCount = paidUserIds.size;

      const usersNotPaidCount = totalUsers - usersPaidCount;

      const remaining = Math.max(0, (event.minAmount || 0) - totalPaid);

      summaries.push({
        eventId: event._id,
        eventName: event.name,
        minAmount: event.minAmount || 0,
        startDate: event.startDate,
        endDate: event.endDate,
        totalPromised,       // 0 unless you add promisedAmount to contributions
        totalPaid,
        remaining,
        usersPaidCount,
        usersNotPaidCount,
        totalUsers,
        status: event.status,
      });
    }

    return res.status(200).json(summaries);
  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

