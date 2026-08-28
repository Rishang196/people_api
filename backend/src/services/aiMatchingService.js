const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.Gemini_API_KEY;

if (!apiKey) {
  throw new Error("Gemini_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey
});


// ==========================================
// TEST GEMINI CONNECTION
// ==========================================

const testAI = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Reply with exactly: AI connection successful"
  });

  return response.text;
};


// ==========================================
// AI HUMAN MATCHING
// ==========================================

const findAIMatches = async (searchQuery, users) => {
  try {

    if (!searchQuery || !searchQuery.trim()) {
      throw new Error("Search query is required");
    }

    if (!Array.isArray(users)) {
      throw new Error("Users must be an array");
    }

    // Prepare profiles for Gemini
    const profiles = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || "",
      skills: user.skills || [],
      expertise: user.expertise || [],
      education: user.education || "",
      experience: user.experience || "",
      location: user.location || ""
    }));


    // ==========================================
    // AI PROMPT
    // ==========================================

    const prompt = `
You are the AI matching engine for Human API.

Your job is to find the people who best match the user's search.

USER SEARCH:
${searchQuery}

AVAILABLE PEOPLE:
${JSON.stringify(profiles)}

MATCHING CRITERIA:

1. Skills relevance
2. Expertise relevance
3. Experience relevance
4. Education relevance
5. Location relevance
6. Overall usefulness to the user's request

SCORING:

90-100 = Excellent match
75-89  = Strong match
50-74  = Moderate match
25-49  = Weak match
0-24   = Poor match

IMPORTANT RULES:

- Only use people provided in AVAILABLE PEOPLE.
- Never invent a person.
- Never change a person's ID.
- matchScore must be between 0 and 100.
- Return every relevant person.
- Sort results from highest matchScore to lowest.
- Give a short reason for every match.
`;

    
    // ==========================================
    // GEMINI REQUEST
    // ==========================================

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "OBJECT",

          properties: {
            matches: {
              type: "ARRAY",

              items: {
                type: "OBJECT",

                properties: {
                  id: {
                    type: "STRING"
                  },

                  matchScore: {
                    type: "NUMBER"
                  },

                  reason: {
                    type: "STRING"
                  }
                },

                required: [
                  "id",
                  "matchScore",
                  "reason"
                ]
              }
            }
          },

          required: [
            "matches"
          ]
        }
      }
    });


    // ==========================================
    // PARSE RESPONSE
    // ==========================================

    const text = response.text.trim();

    console.log("GEMINI MATCH RESPONSE:", text);

    const result = JSON.parse(text);


    // ==========================================
    // VALIDATE RESULT
    // ==========================================

    if (
      !result ||
      !Array.isArray(result.matches)
    ) {
      throw new Error(
        "Gemini returned an invalid matches format"
      );
    }


    // ==========================================
    // SECURITY VALIDATION
    // ==========================================

    const validUserIds = new Set(
      profiles.map((profile) => profile.id)
    );

    result.matches = result.matches
      .filter((match) =>
        validUserIds.has(match.id)
      )
      .map((match) => ({
        id: match.id,

        matchScore: Math.max(
          0,
          Math.min(
            100,
            Number(match.matchScore)
          )
        ),

        reason: String(match.reason || "")
      }))
      .sort(
        (a, b) =>
          b.matchScore - a.matchScore
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