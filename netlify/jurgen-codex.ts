const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" + event.httpMethod };
  }

  const prompt = JSON.parse(event.body).prompt;
  if (!prompt) {
    return { statusCode: 400, body: "Prompt is required" };
  }

  try {
    const response = await openai.Completion.create({
      engine: "davinci-codex",
      prompt: `${prompt}\n\nPython code:`,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const code = response.choices[0].text.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ code }),
    };
  } catch (error) {
    console.error("Error generating code:", error);
    return { statusCode: 500, body: "Error generating code" };
  }
};
