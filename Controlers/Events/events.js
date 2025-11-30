import Event from "../../Models/Events/events.js";


// Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      associatedPerson,
      description,
      startDate,
      endDate,
      status,
      minAmount,
    } = req.body;

    // Create a new event
    const event = await Event.create({
      name,
      associatedPerson,
      description,
      startDate,
      endDate,
      status,
      minAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error: error.message,
    });
  }
};

// Get all open events
export const getOpenEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "open" }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events (summary list)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Close an event
export const closeEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: "closed" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event closed successfully",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update event (only if open)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      associatedPerson,
      startDate,
      endDate,
      minAmount,
      status
    } = req.body;

    // Find the event
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    // Check if event is closed (if you want to prevent editing closed events)
    if (event.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed event cannot be edited",
      });
    }

    // Update event fields
    event.name = name || event.name;
    event.description = description || event.description;
    event.associatedPerson = associatedPerson || event.associatedPerson;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.minAmount = minAmount || event.minAmount;
    event.status = status || event.status;

    // Save the updated event
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while updating event",
      error: error.message 
    });
  }
};
