import { generateCombinations, variantToFilename } from './variant-combinations';

// Output all variants as JSON array for GitHub matrix
const combinations = generateCombinations();
const variants = combinations.map(variant => ({
  roles: variant.join(','),
  filename: variantToFilename(variant)
}));

console.log(JSON.stringify(variants));
