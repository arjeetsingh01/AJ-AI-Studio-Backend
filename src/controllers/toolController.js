const ToolHistory = require("../models/ToolHistory");
const {
  generateAIResponse,
  generateAIImage,
} = require("../services/aiService");


// =====================================================
// SAVE TOOL HISTORY
// =====================================================

const saveToolHistory = async (userId, tool, input, result) => {
  try {
    await ToolHistory.create({
      user: userId,
      tool,
      input,
      result,
    });
  } catch (error) {
    console.error("Save Tool History Error:", error.message);
  }
};

// =====================================================
// SUMMARIZER
// =====================================================

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const cleanText = text.trim();

    const prompt = `
You are the AI Summarizer of AJ AI Studio.

Summarize the following text clearly and accurately.

Rules:
- Keep the important information.
- Remove unnecessary repetition.
- Do not invent information.
- Make the summary easy to understand.
- Use short paragraphs or bullet points when useful.
- Return only the summary.
- Do not write "Summary:" before the answer.
- Do not mention that you are Gemini.

Text:
${cleanText}
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "summarizer",
      {
        text: cleanText,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Text summarized successfully",
      result,
    });
  } catch (error) {
    console.error("Summarizer Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Summarizer service error",
    });
  }
};

// =====================================================
// TRANSLATOR
// =====================================================

const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (!targetLanguage || !targetLanguage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target language is required",
      });
    }

    const cleanText = text.trim();
    const cleanTargetLanguage = targetLanguage.trim();

    const prompt = `
Translate the following text into ${cleanTargetLanguage}.

Rules:
- Translate only the provided text.
- Preserve the original meaning accurately.
- Do not add explanations.
- Do not add quotation marks.
- Do not add labels such as "Translation:".
- Return only the translated text.
- Keep names, numbers, URLs, and technical terms accurate when appropriate.
- Do not mention that you are Gemini.

Text:
${cleanText}
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "translator",
      {
        text: cleanText,
        targetLanguage: cleanTargetLanguage,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Text translated successfully",
      result,
    });
  } catch (error) {
    console.error("Translator Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Translator service error",
    });
  }
};

// =====================================================
// RESUME BUILDER
// =====================================================

const buildResume = async (req, res) => {
  try {
    const {
      name,
      email,
      skills,
      experience,
      education,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email?.trim() || "";
    const cleanSkills = skills?.trim() || "";
    const cleanExperience = experience?.trim() || "";
    const cleanEducation = education?.trim() || "";

    const prompt = `
You are the AI Resume Builder of AJ AI Studio.

Create professional resume content using the information provided below.

Rules:
- Do not invent qualifications, jobs, companies, dates, or achievements.
- Improve wording and grammar where appropriate.
- Keep the information truthful to the provided data.
- Organize the response into clear resume sections.
- Make it professional and easy to read.
- Return only the resume content.
- Do not mention Gemini.

Name:
${cleanName}

Email:
${cleanEmail}

Skills:
${cleanSkills}

Experience:
${cleanExperience}

Education:
${cleanEducation}
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "resume-builder",
      {
        name: cleanName,
        email: cleanEmail,
        skills: cleanSkills,
        experience: cleanExperience,
        education: cleanEducation,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Resume generated successfully",
      result,
    });
  } catch (error) {
    console.error("Resume Builder Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Resume builder service error",
    });
  }
};

// =====================================================
// EMAIL WRITER
// =====================================================

const writeEmail = async (req, res) => {
  try {
    const { purpose, tone } = req.body;

    if (!purpose || !purpose.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email purpose is required",
      });
    }

    const cleanPurpose = purpose.trim();
    const selectedTone = tone?.trim() || "professional";

    const prompt = `
You are the AI Email Writer of AJ AI Studio.

Write a clear and professional email based on the user's request.

Email purpose:
${cleanPurpose}

Tone:
${selectedTone}

Rules:
- Follow the requested tone.
- Make the email natural and well structured.
- Include a suitable subject line.
- Do not invent specific personal details.
- Return the complete email.
- Do not explain how you created it.
- Do not mention Gemini.
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "email-writer",
      {
        purpose: cleanPurpose,
        tone: selectedTone,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Email generated successfully",
      result,
    });
  } catch (error) {
    console.error("Email Writer Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Email writer service error",
    });
  }
};

// =====================================================
// CODE ASSISTANT
// =====================================================

const assistCode = async (req, res) => {
  try {
    const {
      code,
      language,
      request,
    } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    if (!request || !request.trim()) {
      return res.status(400).json({
        success: false,
        message: "Request is required",
      });
    }

    const cleanCode = code.trim();
    const cleanLanguage = language?.trim() || "unknown";
    const cleanRequest = request.trim();

    const prompt = `
You are the AI Code Assistant of AJ AI Studio.

Programming language:
${cleanLanguage}

User's request:
${cleanRequest}

Code:
${cleanCode}

Help the user with the requested programming task.

Rules:
- Analyze the provided code carefully.
- Give a clear solution.
- If code needs to be changed, provide the corrected code.
- Explain important changes briefly.
- Do not invent missing project details.
- Do not mention Gemini.
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "code-assistant",
      {
        code: cleanCode,
        language: cleanLanguage,
        request: cleanRequest,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Code assistant response generated successfully",
      result,
    });
  } catch (error) {
    console.error("Code Assistant Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Code assistant service error",
    });
  }
};

// =====================================================
// IMAGE GENERATOR
// =====================================================

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image prompt is required",
      });
    }

    const cleanPrompt = prompt.trim();

    const image = await generateAIImage(cleanPrompt);

    if (!image || !image.data) {
      throw new Error("No image data received from Gemini");
    }

    const result = {
      prompt: cleanPrompt,
      image: image.data,
      mimeType: image.mimeType || "image/png",
    };

    await saveToolHistory(
      req.user.userId,
      "image-generator",
      {
        prompt: cleanPrompt,
      },
      {
        prompt: cleanPrompt,
        mimeType: result.mimeType,
      }
    );

    res.status(200).json({
      success: true,
      message: "Image generated successfully",
      result,
    });
  } catch (error) {
    console.error("Image Generator Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Image generator service error",
    });
  }
};

// =====================================================
// DOCUMENT Q&A
// =====================================================

const documentQA = async (req, res) => {
  try {
    const { documentText, question } = req.body;

    if (!documentText || !documentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document text is required",
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const cleanDocumentText = documentText.trim();
    const cleanQuestion = question.trim();

    const prompt = `
You are the AI Document Q&A assistant of AJ AI Studio.

Answer the user's question using ONLY the information contained in the document.

Document:
${cleanDocumentText}

Question:
${cleanQuestion}

Rules:
- Answer based only on the document.
- Do not invent information.
- If the answer is not available in the document, clearly say that the information is not available in the provided document.
- Keep the answer clear and concise.
- Do not mention Gemini.
`;

    const result = await generateAIResponse(prompt);

    await saveToolHistory(
      req.user.userId,
      "document-qa",
      {
        documentText: cleanDocumentText,
        question: cleanQuestion,
      },
      result
    );

    res.status(200).json({
      success: true,
      message: "Document question answered successfully",
      result,
    });
  } catch (error) {
    console.error("Document Q&A Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Document Q&A service error",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  summarizeText,
  translateText,
  buildResume,
  writeEmail,
  assistCode,
  generateImage,
  documentQA,
};