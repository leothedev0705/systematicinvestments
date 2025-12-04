import { riskQuestions, riskProfiles, RiskProfileType } from '@/constants/riskQuestions';

export interface RiskResult {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  riskProfile: RiskProfileType;
  profileName: string;
  profileDescription: string;
  profileColor: string;
  assetAllocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  recommendations: string[];
  products: string[];
  categoryScores: {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
}

// Get age-based score
function getAgeScore(age: number): number {
  if (age <= 25) return 10;
  if (age <= 35) return 8;
  if (age <= 45) return 6;
  if (age <= 55) return 4;
  if (age <= 65) return 2;
  return 1;
}

export function calculateRiskProfile(answers: Record<number, any>): RiskResult {
  let totalScore = 0;
  let maxScore = 0;
  const categoryScoresMap: Record<string, { score: number; maxScore: number }> = {};

  riskQuestions.forEach(question => {
    const answer = answers[question.id];
    
    // Initialize category if not exists
    if (!categoryScoresMap[question.category]) {
      categoryScoresMap[question.category] = { score: 0, maxScore: 0 };
    }

    if (answer !== undefined && answer !== null) {
      let questionScore = 0;

      if (question.type === 'checkbox' && Array.isArray(answer)) {
        // Sum selected scores, cap at 10
        const sum = answer.reduce((acc: number, val: string) => {
          const opt = question.options?.find(o => o.value === val);
          return acc + (opt?.score || 0);
        }, 0);
        questionScore = Math.min(sum, 10);
      } else if (question.type === 'slider') {
        // Age-based scoring
        questionScore = getAgeScore(answer);
      } else if (question.type === 'radio') {
        const option = question.options?.find(o => o.value === answer);
        questionScore = option?.score || 0;
      }

      const weightedScore = questionScore * question.weight;
      totalScore += weightedScore;
      categoryScoresMap[question.category].score += weightedScore;
    }

    // Max possible score for this question
    const maxQuestionScore = 10 * question.weight;
    maxScore += maxQuestionScore;
    categoryScoresMap[question.category].maxScore += maxQuestionScore;
  });

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  // Determine risk profile based on percentage
  let profileKey: RiskProfileType;
  if (percentage <= 20) {
    profileKey = 'veryConservative';
  } else if (percentage <= 35) {
    profileKey = 'conservative';
  } else if (percentage <= 50) {
    profileKey = 'moderate';
  } else if (percentage <= 65) {
    profileKey = 'moderatelyAggressive';
  } else if (percentage <= 80) {
    profileKey = 'aggressive';
  } else {
    profileKey = 'veryAggressive';
  }

  const profile = riskProfiles[profileKey];

  // Convert category scores to array
  const categoryScores = Object.entries(categoryScoresMap).map(([category, data]) => ({
    category,
    score: data.score,
    maxScore: data.maxScore,
    percentage: data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0,
  }));

  return {
    totalScore,
    maxPossibleScore: maxScore,
    percentageScore: percentage,
    riskProfile: profileKey,
    profileName: profile.name,
    profileDescription: profile.description,
    profileColor: profile.color,
    assetAllocation: profile.allocation,
    recommendations: profile.recommendations,
    products: profile.products,
    categoryScores,
  };
}

// Get number of answered questions
export function getAnsweredCount(answers: Record<number, any>): number {
  return Object.keys(answers).filter(key => {
    const value = answers[parseInt(key)];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;
}

// Check if all questions are answered
export function isComplete(answers: Record<number, any>): boolean {
  return getAnsweredCount(answers) === riskQuestions.length;
}

