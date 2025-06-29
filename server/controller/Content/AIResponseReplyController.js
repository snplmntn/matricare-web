const AIResponseReply = require("../../models/Content/AIResponseReply");
const AIResponse = require("../../models/Content/AIResponse");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Create a reply to an AI response
const ai_response_reply_post = catchAsync(async (req, res, next) => {
  const { aiResponseId, userId, fullName, content } = req.body;

  // Validate required fields
  if (!aiResponseId || !userId || !fullName || !content) {
    return next(
      new AppError(
        "AI Response ID, User ID, Full Name, and Content are required",
        400
      )
    );
  }

  // Check if the AI response exists
  const aiResponse = await AIResponse.findById(aiResponseId);
  if (!aiResponse || !aiResponse.isActive) {
    return next(new AppError("AI Response not found", 404));
  }

  // Validate content length
  if (content.trim().length === 0) {
    return next(new AppError("Reply content cannot be empty", 400));
  }

  if (content.length > 1000) {
    return next(
      new AppError("Reply content cannot exceed 1000 characters", 400)
    );
  }

  // Create the reply
  const reply = new AIResponseReply({
    aiResponseId,
    userId,
    fullName,
    content: content.trim(),
  });

  await reply.save();

  // Populate user data for response
  const populatedReply = await AIResponseReply.findById(reply._id)
    .populate("userId", "name profilePicture verified")
    .exec();

  return res.status(201).json({
    message: "Reply created successfully",
    reply: populatedReply,
  });
});

// Get all replies for an AI response
const ai_response_reply_get = catchAsync(async (req, res, next) => {
  const { aiResponseId } = req.query;

  if (!aiResponseId) {
    return next(new AppError("AI Response ID is required", 400));
  }

  // Check if the AI response exists
  const aiResponse = await AIResponse.findById(aiResponseId);
  if (!aiResponse || !aiResponse.isActive) {
    return next(new AppError("AI Response not found", 404));
  }

  // Get all active replies for this AI response
  const replies = await AIResponseReply.find({
    aiResponseId: aiResponseId,
    isActive: true,
  })
    .populate("userId", "name profilePicture verified")
    .sort({ createdAt: -1 }) // Most recent first
    .exec();

  return res.status(200).json({
    message: "Replies retrieved successfully",
    replies: replies,
    count: replies.length,
  });
});

module.exports = {
  ai_response_reply_post,
  ai_response_reply_get,
};
