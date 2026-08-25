const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey
});

const MODEL = "gemini-3.6-flash";


// Test Gemini connection
const testAI = async () => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: "Reply with exactly: AI connection successful"
    });

    return response.text.trim();

  } catch (error) {
    console.error("GEMINI CONNECTION ERROR:", error);
    throw new Error("Gemini connection failed");
  }
};


// AI matching
const findAIMatches = async (searchQuery, users) => {
  try {
    if (!searchQuery || !searchQuery.trim()) {
      throw new Error("Search query is required");
    }

    if (!Array.isArray(users)) {
      throw new Error("Users must be an array");
    }

    const profiles = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || "",
      skills: Array.isArray(user.skills)
        ? user.skills
        : [],
      expertise: Array.isArray(user.expertise)
        ? user.expertise
        : [],
      education: user.education || "",
      experience: user.experience || "",
      location: user.location || ""
    }));

    const prompt = `
You are the AI matching engine for Human API.

Your job is to match a user's natural-language search query
against the available human profiles.

USER SEARCH:
${searchQuery}

AVAILABLE PROFILES:
${JSON.stringify(profiles)}

SCORING RULES:

90-100 = Excellent match
80-89  = Strong match
70-79  = Good match
50-69  = Weak match
0-49   = Poor match

Consider these factors:

1. Skills
2. Expertise
3. Experience
4. Education
5. Location when relevant
6. Overall relevance to the search query

Important rules:

- Only use profiles provided above.
- Never invent a user.
- Use the exact profile ID provided.
- matchScore must be an integer from 0 to 100.
- Give a short, specific reason for the score.
- Return results from highest score to lowest score.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add explanations outside the JSON.

Required JSON format:

{
  "matches": [
    {
      "id": "USER_ID",
      "matchScore": 95,
      "reason": "Short explanation of why this person matches."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
    });

    let text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    text = text.trim();

    console.log("GEMINI RAW RESPONSE:", text);

    // Remove markdown code fences if Gemini adds them
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "GEMINI JSON PARSE ERROR:",
        parseError
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    if (
      !result ||
      !Array.isArray(result.matches)
    ) {
      throw new Error(
        "Gemini returned an invalid matches format"
      );
    }

    // Validate every AI result
    const validUserIds = new Set(
      profiles.map((profile) => profile.id)
    );

    result.matches = result.matches
      .filter((match) => {
        return (
          match &&
          validUserIds.has(String(match.id))
        );
      })
      .map((match) => {
        let score = Number(match.matchScore);

        if (!Number.isFinite(score)) {
          score = 0;
        }

        score = Math.round(
          Math.max(0, Math.min(100, score))
        );

        return {
          id: String(match.id),
          matchScore: score,
          reason:
            typeof match.reason === "string"
              ? match.reason
              : "Profile matches the search query."
        };
      });

    // Sort highest score first
    result.matches.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    return result;

  } catch (error) {
    console.error(
      "GEMINI MATCHING ERROR:",
      error
    );

    throw error;
  }
};


module.exports = {
  testAI,
  findAIMatches
};