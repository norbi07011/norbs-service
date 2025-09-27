import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslations } from '../../hooks/useTranslations';

interface Idea {
  title: string;
  excerpt: string;
}

const AIBlogGenerator: React.FC = () => {
  const { t } = useTranslations();
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy blog post title" },
            excerpt: { type: Type.STRING, description: "A short, one-sentence summary of the blog post" }
          },
          required: ['title', 'excerpt']
        }
      };

      const prompt = `You are an expert in digital marketing. Generate 3 creative blog post ideas about the topic '${topic}'. For each idea, provide a catchy title and a short, one-sentence excerpt.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
      
      const jsonStr = response.text.trim();
      const generatedIdeas = JSON.parse(jsonStr);

      if (Array.isArray(generatedIdeas)) {
        setIdeas(generatedIdeas);
      } else {
        throw new Error("Invalid response format from AI.");
      }

    } catch (err) {
      console.error("Error generating blog ideas:", err);
      setError(t('faq_blog_page.ai_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
        {t('faq_blog_page.ai_title')}
      </h2>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('faq_blog_page.ai_input_placeholder')}
            disabled={isLoading}
            className="flex-grow px-4 py-3 bg-secondary border-2 border-border rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground placeholder-muted-foreground disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="px-8 py-3 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? t('faq_blog_page.ai_loading') : t('faq_blog_page.ai_button')}
          </button>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="grid grid-cols-1 gap-8">
            {ideas.map((idea, index) => (
                <div key={index} className="uiverse-card">
                    <div className="uiverse-card-circles">
                        <div></div><div></div><div></div>
                    </div>
                    <div className="uiverse-card-content relative z-10 text-left">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{idea.title}</h3>
                        <p className="text-muted-foreground">{idea.excerpt}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AIBlogGenerator;