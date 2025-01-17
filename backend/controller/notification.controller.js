import Notification from "../models/notification.model.js"

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")

        res.status(200).json(notifications)
    } catch (error) {
        console.error("Get user notifications error: ", error)
        res.status(500).json({ message: "Internal server error" })

    }
}

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndUpdate(
            { _id: notificationId, recipient: req.user._id },
            { read: true },
            { new: true }
        )
        res.status(200).json(notification)
    } catch (error) {
        console.error("Mark notification as read error: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id
    try {
        await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id,
        })
        res.status(200).json({ message: "Notification deleted successfully" })
    } catch (error) {
        console.error("Delete notification error: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}