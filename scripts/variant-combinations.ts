export const roles = ['frontend', 'backend', 'techlead', 'management'] as const;

export function generateCombinations(): string[][] {
  const combinations: string[][] = [[]]; // Empty = all roles

  for (let i = 1; i < (1 << roles.length); i++) {
    const combination: string[] = [];
    for (let j = 0; j < roles.length; j++) {
      if (i & (1 << j)) combination.push(roles[j]);
    }
    combinations.push(combination.sort()); // Alphabetical order
  }

  return combinations;
}

export function variantToFilename(variant: string[]): string {
  return variant.length === 0 ? 'all' : variant.join('-');
}
