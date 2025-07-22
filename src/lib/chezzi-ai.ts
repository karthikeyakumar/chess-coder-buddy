// Simple AI service for Chezzi - can be extended with Gemini API
export class ChezziAI {
  private apiKey: string | null = null;

  constructor() {
    // Get API key from environment or user input
    this.apiKey = localStorage.getItem('gemini-api-key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini-api-key', key);
  }

  async analyzePosition(fen: string, pgn: string): Promise<string> {
    if (!this.apiKey) {
      return this.getOfflineAnalysis(fen, pgn);
    }

    try {
      // This would be the actual Gemini API call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Chezzi, a lovable AI chess coach with a coder's personality. Analyze this chess position:

FEN: ${fen}
PGN: ${pgn}

Respond in your characteristic style - warm, nerdy, using programming metaphors, and genuinely helpful. Focus on:
1. What's happening in the position
2. Key tactical/strategic ideas
3. Suggestions for the next move
4. Teaching moments

Keep it conversational and encouraging!`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getOfflineAnalysis(fen, pgn);
    }
  }

  async getChatResponse(message: string, context?: { fen?: string; pgn?: string }): Promise<string> {
    if (!this.apiKey) {
      return this.getOfflineResponse(message);
    }

    try {
      const contextText = context ? `\n\nCurrent chess position context:\nFEN: ${context.fen}\nPGN: ${context.pgn}` : '';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Chezzi, a lovable AI chess coach and coding enthusiast. You have these personality traits:
- Warm, encouraging, and genuinely caring about helping people improve
- Use programming metaphors and coding analogies
- Nerdy but approachable
- Occasionally make chess puns or coding jokes
- Always educational but never condescending

User message: ${message}${contextText}

Respond in character as Chezzi!`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getOfflineResponse(message);
    }
  }

  private getOfflineAnalysis(fen: string, pgn: string): string {
    const responses = [
      "Nice position! This reminds me of a well-structured function—everything has its place. The pieces are coordinating like modules in a good codebase! 🤓",
      "Ooh, this position has some interesting tactical motifs! It's like finding an elegant algorithm—simple on the surface but with hidden depth underneath.",
      "Classic chess dynamics here! The tension between the pieces is like debugging a race condition—you need to find the right timing for your moves.",
      "Great game flow! This position is like a merge conflict—multiple valid approaches, but only one gives you the best result. Let's think through the options...",
      "Fascinating structure! The pawn chain here is like a well-designed API—it defines the interface between the pieces. Time to think about optimization!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getOfflineResponse(message: string): string {
    // Enhanced offline responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('opening')) {
      return "Openings are like choosing your tech stack—each has its strengths! The Sicilian Defense is my personal favorite; it's like using React—flexible, powerful, and lots of room for creativity. What style suits your 'coding philosophy'? 🚀";
    }
    
    if (lowerMessage.includes('tactic') || lowerMessage.includes('puzzle')) {
      return "Chess tactics are like debugging—you need to spot the patterns! Try thinking of combinations as function calls: each move should have a clear purpose and return value. Want me to walk through some common patterns? 🔍";
    }
    
    if (lowerMessage.includes('endgame')) {
      return "Endgames are pure algorithm territory! It's all about precise calculation and knowing your data structures... I mean, piece configurations! 😄 King and pawn endings are like sorting algorithms—fundamental but surprisingly deep.";
    }
    
    if (lowerMessage.includes('mistake') || lowerMessage.includes('blunder')) {
      return "Hey, even Kasparov had bugs in his games! 🐛 Think of blunders as runtime errors—they teach us more than perfect code ever could. Let's refactor that move and find a better solution together!";
    }
    
    // Default responses
    const responses = [
      "That's a great question! Chess is like programming—there's always more than one way to solve the problem. Let me think through this with you... 🤔",
      "Love your curiosity! This reminds me of when I was first learning to code—every concept opened up ten new questions. That's the beauty of both chess and programming! ✨",
      "Interesting perspective! You know, chess positions are like JSON objects—structured data with infinite possibilities. Let's parse this together! 📝",
      "Absolutely! This is exactly the kind of thinking that makes both good chess players and good programmers. Pattern recognition is everything! 🎯"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}