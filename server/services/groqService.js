import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateWithGroq =
  async (prompt) => {

    const completion =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0,
      });

    const text =
      completion.choices[0]
        .message.content;

    console.log(
      "RAW GROQ:"
    );

    console.log(text);

    return JSON.parse(text);
};