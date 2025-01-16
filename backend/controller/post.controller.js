import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js';

export const getFeedposts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: req.user.connections } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        console.error("Get feed posts error: ", error)
        res.status(500).json({ message: "server error" })
    }
}

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body

        let newPost

        if (image) {
            const imgResult = await cloudinary.uploader.upload(image)
            newPost = new Post({
                author: req.user._id,
                content,
                image: imgResult.secure_url
            })
        } else {
            newPost = new Post({
                author: req.user._id,
                content
            })
        }

        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        console.error("Create post error: ", error)
        res.status(500).json({ message: "server error" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" })
        }

        if (post.image) {
            const imageId = post.image.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imageId)
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({ message: "Post deleted successfully" })

    } catch (error) {
        console.error("Delete post error: ", error)
        res.status(500).json({ message: "server error" })
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name username profilePicture headline")

        res.status(200).json(post)
    } catch (error) {
        console.error("Get post by id error: ", error)
        res.status(500).json({ message: "server error" })
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id
        const { content } = req.body

        const post = await Post.findById(postId, {
            $push: { comments: { user: req.user._id, content } },
        }, { new: true }
        ).populate("author", "name email username headline profilePicture")

        // create notification

    } catch (error) {
        console.error("Create comment error: ", error)
        res.status(500).json({ message: "server error" })
    }
}