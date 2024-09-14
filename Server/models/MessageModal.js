import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"]
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: [true, "Message type is required"]
    },
    content: {
        type: String,
        required: function () {
            if (this.messageType === "text") {
                return true
            }
            return false
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            if (this.messageType === "file") {
                return true
            }
            return false
        }
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;