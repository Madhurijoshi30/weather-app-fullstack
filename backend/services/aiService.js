const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 20) return "evening";
    return "night";
}

function buildPrompt(weather) {
    return `You are a helpful weather assistant.

Current weather in ${weather.city}:
- Temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h
- Condition: ${weather.description}
- Time of day: ${getTimeOfDay()}

Give practical clothing and activity advice for someone going out 
in this weather. Be specific, friendly, and under 3 sentences.`;
}

async function getWeatherRecommendation(weatherData) {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",   // free, fast, good quality
        max_tokens: 150,
        messages: [
            {
                role: "user",
                content: buildPrompt(weatherData)
            }
        ]
    });

    return completion.choices[0].message.content;
}

module.exports = { getWeatherRecommendation };