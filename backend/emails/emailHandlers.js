import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate, createCommentNotificationEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to UnLinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome"
        })

        console.log("Email sent successfully: ", response)
    } catch (error) {
        throw error
    }
}

export const sendCommentNotificationEmail = async (
    recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent
) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${commenterName} commented on your post`,
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "comment_notification"
        })
        console.log("Email sent successfully: ", response)
    } catch (error) {
        throw error
    }
}