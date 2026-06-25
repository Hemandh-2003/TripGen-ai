import OpenAI from "openai";

const client = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY,
});

export const generateWithOpenAI =
  async (prompt) => {

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0,
      });

    const text =
      response.choices[0]
        .message.content;

    console.log(
      "RAW OPENAI:"
    );

    console.log(text);

    return JSON.parse(text);
};