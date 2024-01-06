const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const urlSchema = new mongoose.Schema(
{
    urlCode: String,
    originalUrl: String,
    shortUrl: String,
    createdAt: {
        type: String,
        default: Date.now,
    },
    expiresAt: { type: Date, default: () => Date.now() + 48 * 60 * 60 * 1000 },
    user: {
        type: ObjectId,
        ref: "User",
    },
    clicks: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: null },
});

module.exports = mongoose.model("URL", urlSchema);
