import { PathwayId } from '../types';

interface Quote {
  text: string;
  author?: string;
  pathways?: PathwayId[];
}

export const QUOTES: Quote[] = [
  // General motivation
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your future self will thank you for the work you put in today." },
  { text: "Consistency beats intensity. Show up every day." },
  { text: "Progress, not perfection." },
  { text: "The compound effect is real. Trust the process." },
  { text: "1% better every day = 37x better in a year." },

  // Looksmaxx specific
  { text: "Taking care of yourself is a form of self-respect.", pathways: ['looksmaxx'] },
  { text: "Your skin is an investment, not an expense.", pathways: ['looksmaxx'] },
  { text: "Grooming is the foundation of first impressions.", pathways: ['looksmaxx'] },

  // Healthmaxx specific
  { text: "Sleep is the foundation everything else is built on.", pathways: ['healthmaxx'] },
  { text: "You can't out-train a bad diet or out-supplement bad sleep.", pathways: ['healthmaxx'] },
  { text: "Health is wealth. Literally.", pathways: ['healthmaxx'] },

  // Fitmaxx specific
  { text: "The iron never lies. You get out what you put in.", pathways: ['fitmaxx'] },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", pathways: ['fitmaxx'] },
  { text: "Strength is built one rep at a time.", pathways: ['fitmaxx'] },

  // Socialmaxx specific
  { text: "Social skills are just skills. They can be learned.", pathways: ['socialmaxx'] },
  { text: "Confidence comes from competence. Practice builds both.", pathways: ['socialmaxx'] },
  { text: "Every interaction is practice. There are no failures, only feedback.", pathways: ['socialmaxx'] },

  // Stylemaxx specific
  { text: "Style is a way to say who you are without speaking.", author: "Rachel Zoe", pathways: ['stylemaxx'] },
  { text: "Dress for the version of yourself you're becoming.", pathways: ['stylemaxx'] },
  { text: "Quality over quantity. Build a wardrobe, not a closet of clutter.", pathways: ['stylemaxx'] },

  // Mindsetmaxx specific
  { text: "Discipline is choosing what you want most over what you want now.", pathways: ['mindsetmaxx'] },
  { text: "Your habits shape your identity. Choose them wisely.", pathways: ['mindsetmaxx'] },
  { text: "The mind is a muscle. Train it like one.", pathways: ['mindsetmaxx'] },

  // Moneymaxx specific
  { text: "Wealth is built in silence, shown in noise.", pathways: ['moneymaxx'] },
  { text: "Your income follows your skills. Invest in yourself.", pathways: ['moneymaxx'] },
  { text: "Financial freedom is freedom of time.", pathways: ['moneymaxx'] },
];

export const getRandomQuote = (pathwayId?: PathwayId): Quote => {
  let availableQuotes = QUOTES;

  if (pathwayId) {
    // Include general quotes (no specific pathway) and pathway-specific quotes
    availableQuotes = QUOTES.filter(
      (q) => !q.pathways || q.pathways.includes(pathwayId)
    );
  } else {
    // General quotes only
    availableQuotes = QUOTES.filter((q) => !q.pathways);
  }

  return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
};

export const getDailyQuote = (pathwayId?: PathwayId): Quote => {
  // Use date as seed for consistent daily quote
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);

  let availableQuotes = QUOTES;
  if (pathwayId) {
    availableQuotes = QUOTES.filter(
      (q) => !q.pathways || q.pathways.includes(pathwayId)
    );
  }

  return availableQuotes[seed % availableQuotes.length];
};
