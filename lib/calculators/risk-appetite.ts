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
  products: string[];
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

  riskQuestions.forEach(question => {
    const answer = answers[question.id];

    if (answer !== undefined && answer !== null) {
      let questionScore = 0;

      if (question.type === 'slider') {
        // Age-based scoring
        questionScore = getAgeScore(answer);
      } else if (question.type === 'radio') {
        const option = question.options?.find(o => o.value === answer);
        questionScore = option?.score || 0;
      }

      const weightedScore = questionScore * question.weight;
      totalScore += weightedScore;
    }

    // Max possible score for this question
    const maxQuestionScore = 10 * question.weight;
    maxScore += maxQuestionScore;
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

  return {
    totalScore,
    maxPossibleScore: maxScore,
    percentageScore: percentage,
    riskProfile: profileKey,
    profileName: profile.name,
    profileDescription: profile.description,
    profileColor: profile.color,
    assetAllocation: profile.allocation,
    products: profile.products,
  };
}

// Get number of answered questions
export function getAnsweredCount(answers: Record<number, any>): number {
  return Object.keys(answers).filter(key => {
    const value = answers[parseInt(key)];
    return value !== undefined && value !== null && value !== '';
  }).length;
}

// Check if all questions are answered
export function isComplete(answers: Record<number, any>): boolean {
  return getAnsweredCount(answers) === riskQuestions.length;
}
