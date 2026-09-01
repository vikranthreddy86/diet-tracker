// Generic (non-Indian-specific) foods: fruits, vegetables, nuts, dairy, meat/fish,
// grains, legumes, oils, and common snacks/beverages. Same caveat as the Indian
// list — researched approximations, good enough to log against; replace with a
// custom entry (label/your own research) if you want precision for something
// you eat often.

import type { SeedFood } from "./seed-foods";

export const genericFoods: SeedFood[] = [
  // Fruits
  { name: "Apple", servingSize: 1, servingUnit: "medium (~180g)", calories: 95, proteinG: 0.5, carbsG: 25, fatG: 0.3, fiberG: 4.4, sugarG: 19, category: "Fruits" },
  { name: "Banana", servingSize: 1, servingUnit: "medium (~120g)", calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4, fiberG: 3.1, sugarG: 14, category: "Fruits" },
  { name: "Orange", servingSize: 1, servingUnit: "medium (~130g)", calories: 62, proteinG: 1.2, carbsG: 15.4, fatG: 0.2, fiberG: 3.1, sugarG: 12, category: "Fruits" },
  { name: "Mango", servingSize: 1, servingUnit: "cup sliced (~165g)", calories: 99, proteinG: 1.4, carbsG: 25, fatG: 0.6, fiberG: 2.6, sugarG: 23, category: "Fruits" },
  { name: "Grapes", servingSize: 100, servingUnit: "g", calories: 69, proteinG: 0.7, carbsG: 18, fatG: 0.2, fiberG: 0.9, sugarG: 15, category: "Fruits" },
  { name: "Watermelon", servingSize: 150, servingUnit: "g", calories: 45, proteinG: 0.9, carbsG: 11, fatG: 0.2, fiberG: 0.6, sugarG: 9, category: "Fruits" },
  { name: "Papaya", servingSize: 150, servingUnit: "g", calories: 65, proteinG: 1, carbsG: 17, fatG: 0.3, fiberG: 2.6, sugarG: 12, category: "Fruits" },
  { name: "Pineapple", servingSize: 100, servingUnit: "g", calories: 50, proteinG: 0.5, carbsG: 13, fatG: 0.1, fiberG: 1.4, sugarG: 10, category: "Fruits" },
  { name: "Pomegranate", servingSize: 100, servingUnit: "g seeds", calories: 83, proteinG: 1.7, carbsG: 19, fatG: 1.2, fiberG: 4, sugarG: 14, category: "Fruits" },
  { name: "Guava", servingSize: 1, servingUnit: "medium (~55g)", calories: 37, proteinG: 1.4, carbsG: 8, fatG: 0.5, fiberG: 3, sugarG: 5, category: "Fruits" },
  { name: "Pear", servingSize: 1, servingUnit: "medium (~180g)", calories: 100, proteinG: 0.6, carbsG: 27, fatG: 0.2, fiberG: 5.5, sugarG: 17, category: "Fruits" },
  { name: "Strawberries", servingSize: 100, servingUnit: "g", calories: 32, proteinG: 0.7, carbsG: 7.7, fatG: 0.3, fiberG: 2, sugarG: 4.9, category: "Fruits" },
  { name: "Blueberries", servingSize: 100, servingUnit: "g", calories: 57, proteinG: 0.7, carbsG: 14.5, fatG: 0.3, fiberG: 2.4, sugarG: 10, category: "Fruits" },
  { name: "Kiwi", servingSize: 1, servingUnit: "medium (~75g)", calories: 42, proteinG: 0.8, carbsG: 10, fatG: 0.4, fiberG: 2.1, sugarG: 6, category: "Fruits" },
  { name: "Peach", servingSize: 1, servingUnit: "medium (~150g)", calories: 58, proteinG: 1.4, carbsG: 14, fatG: 0.4, fiberG: 2.3, sugarG: 13, category: "Fruits" },
  { name: "Plum", servingSize: 1, servingUnit: "medium (~65g)", calories: 30, proteinG: 0.5, carbsG: 7.5, fatG: 0.2, fiberG: 0.9, sugarG: 7, category: "Fruits" },
  { name: "Cherries", servingSize: 100, servingUnit: "g", calories: 63, proteinG: 1.1, carbsG: 16, fatG: 0.2, fiberG: 2.1, sugarG: 13, category: "Fruits" },
  { name: "Dates (dried)", servingSize: 3, servingUnit: "pieces (~25g)", calories: 68, proteinG: 0.6, carbsG: 18, fatG: 0.1, fiberG: 1.9, sugarG: 16, category: "Fruits" },
  { name: "Raisins", servingSize: 30, servingUnit: "g", calories: 90, proteinG: 0.9, carbsG: 24, fatG: 0.1, fiberG: 1.1, sugarG: 18, category: "Fruits" },
  { name: "Fig (dried)", servingSize: 2, servingUnit: "pieces (~40g)", calories: 94, proteinG: 1.2, carbsG: 24, fatG: 0.4, fiberG: 3.7, sugarG: 18, category: "Fruits" },
  { name: "Avocado", servingSize: 0.5, servingUnit: "medium (~100g)", calories: 160, proteinG: 2, carbsG: 8.5, fatG: 14.7, fiberG: 6.7, sugarG: 0.7, category: "Fruits" },
  { name: "Coconut (fresh)", servingSize: 30, servingUnit: "g", calories: 106, proteinG: 1, carbsG: 4.5, fatG: 10, fiberG: 2.7, sugarG: 1.8, category: "Fruits" },
  { name: "Muskmelon / Cantaloupe", servingSize: 150, servingUnit: "g", calories: 51, proteinG: 1.3, carbsG: 12, fatG: 0.3, fiberG: 1.4, sugarG: 12, category: "Fruits" },

  // Vegetables
  { name: "Tomato", servingSize: 100, servingUnit: "g", calories: 18, proteinG: 0.9, carbsG: 3.9, fatG: 0.2, fiberG: 1.2, sugarG: 2.6, category: "Vegetables" },
  { name: "Onion", servingSize: 100, servingUnit: "g", calories: 40, proteinG: 1.1, carbsG: 9.3, fatG: 0.1, fiberG: 1.7, sugarG: 4.2, category: "Vegetables" },
  { name: "Potato (boiled)", servingSize: 150, servingUnit: "g", calories: 130, proteinG: 2.7, carbsG: 30, fatG: 0.2, fiberG: 2.7, category: "Vegetables" },
  { name: "Sweet Potato (boiled)", servingSize: 150, servingUnit: "g", calories: 129, proteinG: 2.4, carbsG: 30, fatG: 0.2, fiberG: 4.7, sugarG: 9, category: "Vegetables" },
  { name: "Carrot", servingSize: 100, servingUnit: "g", calories: 41, proteinG: 0.9, carbsG: 9.6, fatG: 0.2, fiberG: 2.8, sugarG: 4.7, category: "Vegetables" },
  { name: "Cucumber", servingSize: 100, servingUnit: "g", calories: 15, proteinG: 0.7, carbsG: 3.6, fatG: 0.1, fiberG: 0.5, sugarG: 1.7, category: "Vegetables" },
  { name: "Broccoli", servingSize: 100, servingUnit: "g cooked", calories: 35, proteinG: 2.4, carbsG: 7, fatG: 0.4, fiberG: 3.3, category: "Vegetables" },
  { name: "Cauliflower", servingSize: 100, servingUnit: "g cooked", calories: 25, proteinG: 1.9, carbsG: 5, fatG: 0.3, fiberG: 2, category: "Vegetables" },
  { name: "Spinach (raw)", servingSize: 100, servingUnit: "g", calories: 23, proteinG: 2.9, carbsG: 3.6, fatG: 0.4, fiberG: 2.2, category: "Vegetables" },
  { name: "Bell Pepper / Capsicum", servingSize: 100, servingUnit: "g", calories: 31, proteinG: 1, carbsG: 6, fatG: 0.3, fiberG: 2.1, sugarG: 4.2, category: "Vegetables" },
  { name: "Green Peas", servingSize: 100, servingUnit: "g cooked", calories: 84, proteinG: 5.4, carbsG: 15, fatG: 0.4, fiberG: 5.5, sugarG: 5.7, category: "Vegetables" },
  { name: "Cabbage (raw)", servingSize: 100, servingUnit: "g", calories: 25, proteinG: 1.3, carbsG: 5.8, fatG: 0.1, fiberG: 2.5, category: "Vegetables" },
  { name: "Lettuce", servingSize: 50, servingUnit: "g", calories: 7, proteinG: 0.7, carbsG: 1.5, fatG: 0.1, fiberG: 0.6, category: "Vegetables" },
  { name: "Mushroom", servingSize: 100, servingUnit: "g cooked", calories: 28, proteinG: 3.1, carbsG: 5.3, fatG: 0.5, fiberG: 2, category: "Vegetables" },
  { name: "Beetroot", servingSize: 100, servingUnit: "g cooked", calories: 44, proteinG: 1.7, carbsG: 10, fatG: 0.2, fiberG: 2, sugarG: 7, category: "Vegetables" },
  { name: "Radish", servingSize: 100, servingUnit: "g", calories: 16, proteinG: 0.7, carbsG: 3.4, fatG: 0.1, fiberG: 1.6, category: "Vegetables" },
  { name: "Garlic", servingSize: 3, servingUnit: "cloves (~9g)", calories: 13, proteinG: 0.6, carbsG: 3, fatG: 0, fiberG: 0.2, category: "Vegetables" },
  { name: "Ginger", servingSize: 10, servingUnit: "g", category: "Vegetables", calories: 8, proteinG: 0.2, carbsG: 1.8, fatG: 0.1, fiberG: 0.2 },
  { name: "Corn (boiled)", servingSize: 100, servingUnit: "g", calories: 96, proteinG: 3.4, carbsG: 21, fatG: 1.5, fiberG: 2.4, sugarG: 4.5, category: "Vegetables" },
  { name: "Zucchini", servingSize: 100, servingUnit: "g cooked", calories: 17, proteinG: 1.2, carbsG: 3.1, fatG: 0.3, fiberG: 1, category: "Vegetables" },
  { name: "Green Beans", servingSize: 100, servingUnit: "g cooked", calories: 35, proteinG: 1.8, carbsG: 8, fatG: 0.2, fiberG: 3.4, category: "Vegetables" },
  { name: "Bottle Gourd (Lauki)", servingSize: 100, servingUnit: "g cooked", calories: 15, proteinG: 0.6, carbsG: 3.4, fatG: 0.1, fiberG: 1.2, category: "Vegetables" },
  { name: "Bitter Gourd (Karela)", servingSize: 100, servingUnit: "g cooked", calories: 21, proteinG: 1.4, carbsG: 4.3, fatG: 0.2, fiberG: 2.6, category: "Vegetables" },
  { name: "Drumstick (Moringa)", servingSize: 100, servingUnit: "g cooked", calories: 37, proteinG: 2.5, carbsG: 8.5, fatG: 0.2, fiberG: 3.2, category: "Vegetables" },

  // Nuts & seeds
  { name: "Walnuts", servingSize: 10, servingUnit: "g (~2-3 halves)", calories: 65, proteinG: 1.5, carbsG: 1.4, fatG: 6.5, fiberG: 0.7, category: "Nuts & Seeds" },
  { name: "Cashews", servingSize: 10, servingUnit: "g (~7 nuts)", calories: 55, proteinG: 1.8, carbsG: 3, fatG: 4.4, fiberG: 0.3, category: "Nuts & Seeds" },
  { name: "Pistachios", servingSize: 10, servingUnit: "g (~20 nuts)", calories: 56, proteinG: 2, carbsG: 2.8, fatG: 4.5, fiberG: 1, category: "Nuts & Seeds" },
  { name: "Peanut Butter", servingSize: 1, servingUnit: "tbsp (~16g)", calories: 94, proteinG: 3.6, carbsG: 3.1, fatG: 8, fiberG: 1, sugarG: 1.5, category: "Nuts & Seeds" },
  { name: "Sunflower Seeds", servingSize: 15, servingUnit: "g", calories: 87, proteinG: 3.1, carbsG: 3, fatG: 7.5, fiberG: 1.4, category: "Nuts & Seeds" },
  { name: "Pumpkin Seeds", servingSize: 15, servingUnit: "g", calories: 84, proteinG: 4.5, carbsG: 2.1, fatG: 7, fiberG: 1, category: "Nuts & Seeds" },
  { name: "Chia Seeds", servingSize: 15, servingUnit: "g (1 tbsp)", calories: 73, proteinG: 2.5, carbsG: 6.3, fatG: 4.6, fiberG: 5.2, category: "Nuts & Seeds" },
  { name: "Flax Seeds", servingSize: 15, servingUnit: "g (1 tbsp)", calories: 80, proteinG: 2.7, carbsG: 4.3, fatG: 6.3, fiberG: 4, category: "Nuts & Seeds" },
  { name: "Sesame Seeds", servingSize: 15, servingUnit: "g (1 tbsp)", calories: 88, proteinG: 2.7, carbsG: 3.4, fatG: 7.6, fiberG: 1.8, category: "Nuts & Seeds" },
  { name: "Dried Coconut (desiccated)", servingSize: 15, servingUnit: "g", calories: 100, proteinG: 1, carbsG: 3.6, fatG: 9.7, fiberG: 2.4, category: "Nuts & Seeds" },

  // Dairy & eggs
  { name: "Cheddar Cheese", servingSize: 30, servingUnit: "g slice", calories: 120, proteinG: 7, carbsG: 0.4, fatG: 10, fiberG: 0, category: "Dairy" },
  { name: "Mozzarella Cheese", servingSize: 30, servingUnit: "g", calories: 85, proteinG: 6.3, carbsG: 0.6, fatG: 6.3, fiberG: 0, category: "Dairy" },
  { name: "Greek Yogurt (plain)", servingSize: 150, servingUnit: "g", calories: 100, proteinG: 17, carbsG: 6, fatG: 0.7, fiberG: 0, sugarG: 6, category: "Dairy" },
  { name: "Butter", servingSize: 1, servingUnit: "tsp (5g)", calories: 36, proteinG: 0, carbsG: 0, fatG: 4, fiberG: 0, category: "Dairy" },
  { name: "Skimmed Milk", servingSize: 250, servingUnit: "ml", calories: 88, proteinG: 8.5, carbsG: 12.5, fatG: 0.5, fiberG: 0, category: "Dairy" },
  { name: "Egg White", servingSize: 1, servingUnit: "large egg white", calories: 17, proteinG: 3.6, carbsG: 0.2, fatG: 0.1, fiberG: 0, category: "Eggs" },

  // Meat, poultry, fish, seafood (plain cooked, no sauce)
  { name: "Chicken Breast (grilled, skinless)", servingSize: 100, servingUnit: "g", calories: 165, proteinG: 31, carbsG: 0, fatG: 3.6, fiberG: 0, category: "Meat & Fish" },
  { name: "Chicken Thigh (cooked, skinless)", servingSize: 100, servingUnit: "g", calories: 209, proteinG: 26, carbsG: 0, fatG: 11, fiberG: 0, category: "Meat & Fish" },
  { name: "Turkey Breast (cooked)", servingSize: 100, servingUnit: "g", calories: 135, proteinG: 30, carbsG: 0, fatG: 1, fiberG: 0, category: "Meat & Fish" },
  { name: "Beef (lean, cooked)", servingSize: 100, servingUnit: "g", calories: 217, proteinG: 26, carbsG: 0, fatG: 12, fiberG: 0, category: "Meat & Fish" },
  { name: "Pork Chop (cooked)", servingSize: 100, servingUnit: "g", calories: 231, proteinG: 27, carbsG: 0, fatG: 13, fiberG: 0, category: "Meat & Fish" },
  { name: "Salmon (cooked)", servingSize: 100, servingUnit: "g", calories: 208, proteinG: 22, carbsG: 0, fatG: 13, fiberG: 0, category: "Meat & Fish" },
  { name: "Tuna (canned in water)", servingSize: 100, servingUnit: "g drained", calories: 116, proteinG: 26, carbsG: 0, fatG: 0.8, fiberG: 0, category: "Meat & Fish" },
  { name: "Shrimp / Prawns (cooked)", servingSize: 100, servingUnit: "g", calories: 99, proteinG: 24, carbsG: 0.2, fatG: 0.3, fiberG: 0, category: "Meat & Fish" },
  { name: "Tilapia (cooked)", servingSize: 100, servingUnit: "g", calories: 128, proteinG: 26, carbsG: 0, fatG: 2.7, fiberG: 0, category: "Meat & Fish" },
  { name: "Mutton / Lamb (cooked, plain)", servingSize: 100, servingUnit: "g", calories: 258, proteinG: 25, carbsG: 0, fatG: 17, fiberG: 0, category: "Meat & Fish" },

  // Grains & cereals
  { name: "Oats (cooked)", servingSize: 200, servingUnit: "g (1 bowl)", calories: 150, proteinG: 5.3, carbsG: 27, fatG: 2.6, fiberG: 4, category: "Grains" },
  { name: "Quinoa (cooked)", servingSize: 150, servingUnit: "g", calories: 180, proteinG: 6.6, carbsG: 32, fatG: 2.8, fiberG: 3.8, category: "Grains" },
  { name: "White Bread", servingSize: 1, servingUnit: "slice (~28g)", calories: 75, proteinG: 2.6, carbsG: 14, fatG: 1, fiberG: 0.8, sugarG: 1.5, category: "Grains" },
  { name: "Whole Wheat Bread", servingSize: 1, servingUnit: "slice (~28g)", calories: 69, proteinG: 3.6, carbsG: 12, fatG: 1, fiberG: 1.9, sugarG: 1.4, category: "Grains" },
  { name: "Cornflakes", servingSize: 30, servingUnit: "g", calories: 113, proteinG: 2, carbsG: 25, fatG: 0.3, fiberG: 0.8, sugarG: 3, category: "Grains" },
  { name: "Muesli", servingSize: 50, servingUnit: "g", calories: 190, proteinG: 5, carbsG: 34, fatG: 3.5, fiberG: 4, sugarG: 10, category: "Grains" },
  { name: "Pasta (cooked, plain)", servingSize: 150, servingUnit: "g", calories: 220, proteinG: 8, carbsG: 43, fatG: 1.3, fiberG: 2.5, category: "Grains" },
  { name: "Vermicelli (cooked, plain)", servingSize: 150, servingUnit: "g", calories: 190, proteinG: 6, carbsG: 40, fatG: 0.5, fiberG: 1.5, category: "Grains" },

  // Legumes & soy
  { name: "Black Beans (cooked)", servingSize: 100, servingUnit: "g", calories: 132, proteinG: 8.9, carbsG: 24, fatG: 0.5, fiberG: 8.7, category: "Legumes" },
  { name: "Lentils (cooked, generic)", servingSize: 100, servingUnit: "g", calories: 116, proteinG: 9, carbsG: 20, fatG: 0.4, fiberG: 7.9, category: "Legumes" },
  { name: "Soybeans (cooked)", servingSize: 100, servingUnit: "g", calories: 173, proteinG: 16.6, carbsG: 9.9, fatG: 9, fiberG: 6, category: "Legumes" },
  { name: "Tofu (firm)", servingSize: 100, servingUnit: "g", calories: 144, proteinG: 15.5, carbsG: 3.9, fatG: 8.7, fiberG: 2.3, category: "Legumes" },
  { name: "Green Gram Whole (Moong, boiled)", servingSize: 100, servingUnit: "g", calories: 105, proteinG: 7.5, carbsG: 19, fatG: 0.4, fiberG: 7.6, category: "Legumes" },
  { name: "Black Chickpeas (Kala Chana, boiled)", servingSize: 100, servingUnit: "g", calories: 164, proteinG: 8.9, carbsG: 27, fatG: 2.6, fiberG: 8, category: "Legumes" },

  // Oils & fats
  { name: "Olive Oil", servingSize: 1, servingUnit: "tsp (5ml)", calories: 40, proteinG: 0, carbsG: 0, fatG: 4.5, fiberG: 0, category: "Oils" },
  { name: "Sunflower Oil", servingSize: 1, servingUnit: "tsp (5ml)", calories: 40, proteinG: 0, carbsG: 0, fatG: 4.5, fiberG: 0, category: "Oils" },
  { name: "Mustard Oil", servingSize: 1, servingUnit: "tsp (5ml)", calories: 40, proteinG: 0, carbsG: 0, fatG: 4.5, fiberG: 0, category: "Oils" },
  { name: "Coconut Oil", servingSize: 1, servingUnit: "tsp (5ml)", calories: 40, proteinG: 0, carbsG: 0, fatG: 4.5, fiberG: 0, category: "Oils" },

  // Snacks & sweets (generic/packaged)
  { name: "Potato Chips", servingSize: 30, servingUnit: "g", calories: 160, proteinG: 2, carbsG: 15, fatG: 10, fiberG: 1.3, sugarG: 0.2, category: "Snacks" },
  { name: "Digestive Biscuit", servingSize: 2, servingUnit: "pieces (~28g)", calories: 138, proteinG: 2, carbsG: 19, fatG: 6, fiberG: 0.8, sugarG: 4.5, category: "Snacks" },
  { name: "Cream Cracker", servingSize: 4, servingUnit: "pieces (~28g)", calories: 125, proteinG: 2.5, carbsG: 20, fatG: 4, fiberG: 0.8, category: "Snacks" },
  { name: "Dark Chocolate (70%+)", servingSize: 20, servingUnit: "g", calories: 118, proteinG: 1.5, carbsG: 9, fatG: 8.5, fiberG: 2.5, sugarG: 5, category: "Snacks" },
  { name: "Milk Chocolate", servingSize: 20, servingUnit: "g", calories: 107, proteinG: 1.5, carbsG: 11.5, fatG: 6.3, fiberG: 0.5, sugarG: 11, category: "Snacks" },
  { name: "Whey Protein Shake (1 scoop, water)", servingSize: 1, servingUnit: "scoop (~30g)", calories: 120, proteinG: 24, carbsG: 3, fatG: 1.5, fiberG: 0, sugarG: 1.5, category: "Snacks" },
  { name: "Granola Bar", servingSize: 1, servingUnit: "bar (~35g)", calories: 150, proteinG: 3, carbsG: 22, fatG: 6, fiberG: 2, sugarG: 10, category: "Snacks" },

  // Beverages
  { name: "Black Coffee (no sugar)", servingSize: 150, servingUnit: "ml", calories: 2, proteinG: 0.3, carbsG: 0, fatG: 0, fiberG: 0, category: "Beverages" },
  { name: "Green Tea", servingSize: 150, servingUnit: "ml", calories: 2, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, category: "Beverages" },
  { name: "Orange Juice", servingSize: 200, servingUnit: "ml", calories: 90, proteinG: 1.4, carbsG: 21, fatG: 0.4, fiberG: 0.4, sugarG: 17, category: "Beverages" },
  { name: "Coconut Water", servingSize: 250, servingUnit: "ml", calories: 46, proteinG: 1.7, carbsG: 9, fatG: 0.5, fiberG: 0, sugarG: 6, category: "Beverages" },
  { name: "Cola / Soda", servingSize: 250, servingUnit: "ml", calories: 105, proteinG: 0, carbsG: 27, fatG: 0, fiberG: 0, sugarG: 27, category: "Beverages" },
  { name: "Beer", servingSize: 330, servingUnit: "ml (1 bottle)", calories: 150, proteinG: 1.6, carbsG: 13, fatG: 0, fiberG: 0, category: "Beverages" },
  { name: "Red Wine", servingSize: 150, servingUnit: "ml (1 glass)", calories: 125, proteinG: 0.1, carbsG: 4, fatG: 0, fiberG: 0, category: "Beverages" },
  { name: "Whiskey (neat)", servingSize: 45, servingUnit: "ml (1 shot)", calories: 97, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, category: "Beverages" },
];
