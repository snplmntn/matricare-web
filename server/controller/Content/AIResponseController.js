const AIResponse = require("../../models/Content/AIResponse");
const Post = require("../../models/Content/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");
const axios = require("axios");

// Generate AI Response for a post
const ai_response_generate = catchAsync(async (req, res, next) => {
  const { postId } = req.body;

  if (!postId) {
    return next(new AppError("Post ID is required", 400));
  }

  // Find the post
  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if AI response already exists for this post
  const existingResponse = await AIResponse.findOne({
    postId: postId,
    isActive: true,
  });

  if (existingResponse) {
    return res.status(200).json({
      message: "AI response already exists",
      aiResponse: existingResponse,
    });
  }

  try {
    // Call AI API to generate response
    const aiRequest = {
      question: post.content,
    };

    const response = await axios.post(
      `${process.env.OPEN_API_LINK}/ask`,
      aiRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Create new AI response record
    const aiResponse = new AIResponse({
      postId: postId,
      question: post.content,
      response:
        response.data.answer ||
        response.data.response ||
        "I'm here to help! Could you provide more details about your question?",
    });

    await aiResponse.save();

    return res.status(200).json({
      message: "AI response generated successfully",
      aiResponse: aiResponse,
    });
  } catch (error) {
    console.error("AI API Error:", error);

    // Create a fallback response if AI API fails
    const fallbackResponse = new AIResponse({
      postId: postId,
      question: post.content,
      response:
        "Thank you for your question! Our AI assistant is currently experiencing high demand. Please consult with a healthcare professional for medical advice.",
    });

    await fallbackResponse.save();

    return res.status(200).json({
      message: "AI response generated with fallback",
      aiResponse: fallbackResponse,
    });
  }
});

// Get AI Response for a post
const ai_response_get = catchAsync(async (req, res, next) => {
  const { postId } = req.query;

  if (!postId) {
    return next(new AppError("Post ID is required", 400));
  }

  const aiResponse = await AIResponse.findOne({
    postId: postId,
    isActive: true,
  });

  if (!aiResponse) {
    return res.status(404).json({
      message: "No AI response found for this post",
    });
  }

  return res.status(200).json({
    aiResponse: aiResponse,
  });
});

// Delete/Deactivate AI Response
const ai_response_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new AppError("AI Response ID is required", 400));
  }

  const aiResponse = await AIResponse.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!aiResponse) {
    return next(new AppError("AI Response not found", 404));
  }

  return res.status(200).json({
    message: "AI response deactivated successfully",
    aiResponse: aiResponse,
  });
});

module.exports = {
  ai_response_generate,
  ai_response_get,
  ai_response_delete,
};
