import User from "../models/user.model"

export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections")

        //  memilih user yang tidak ada di daftar connections
        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3)

        res.json(suggestedUser)
    } catch (error) {
        console.error("Get suggested connections error: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (error) {
        console.error("Get public profile error: ", error)
        res.status(500).json({ message: "Internal server error" })
    }

}
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ]
        const updatedData = {}

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field]
            }
        }
    } catch (error) {

    }
}