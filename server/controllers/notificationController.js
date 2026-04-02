import Notification from '../models/Notification.js';


export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).populate('targetUser', 'name email');
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, recipientRole, targetUser } = req.body;
    
    const notification = await Notification.create({
      title,
      message,
      recipientRole,
      targetUser: targetUser || null
    });



    res.status(201).json({ success: true, data: notification, message: "Notification created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create notification", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error: error.message });
  }
};
