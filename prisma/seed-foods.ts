// Curated common Indian foods with approximate nutrition per typical serving.
// Values are researched approximations (USDA/IFCT-style), not lab-measured —
// good enough to log against, but if you want precision for something you eat
// often, add/replace it as a custom food with values from the product label
// or your own research.

export type SeedFood = {
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  category: string;
};

export const indianFoods: SeedFood[] = [
  // Breads
  { name: "Roti / Chapati (whole wheat)", servingSize: 1, servingUnit: "piece (~40g)", calories: 104, proteinG: 3, carbsG: 18, fatG: 2.5, fiberG: 2.7, category: "Breads" },
  { name: "Naan (plain)", servingSize: 1, servingUnit: "piece (~90g)", calories: 262, proteinG: 8.7, carbsG: 45, fatG: 5.1, fiberG: 2, category: "Breads" },
  { name: "Paratha (plain)", servingSize: 1, servingUnit: "piece (~60g)", calories: 210, proteinG: 4.2, carbsG: 27, fatG: 9.5, fiberG: 2.5, category: "Breads" },
  { name: "Aloo Paratha", servingSize: 1, servingUnit: "piece (~100g)", calories: 260, proteinG: 5.5, carbsG: 35, fatG: 11, fiberG: 3, category: "Breads" },
  { name: "Puri", servingSize: 1, servingUnit: "piece (~30g)", calories: 101, proteinG: 1.9, carbsG: 11, fatG: 5.7, fiberG: 0.8, category: "Breads" },
  { name: "Bhatura", servingSize: 1, servingUnit: "piece (~80g)", calories: 250, proteinG: 5.8, carbsG: 32, fatG: 11, fiberG: 1.2, category: "Breads" },

  // Rice dishes
  { name: "Steamed White Rice", servingSize: 150, servingUnit: "g cooked", calories: 195, proteinG: 4, carbsG: 43, fatG: 0.4, fiberG: 0.6, category: "Rice" },
  { name: "Steamed Brown Rice", servingSize: 150, servingUnit: "g cooked", calories: 170, proteinG: 4, carbsG: 36, fatG: 1.3, fiberG: 2.5, category: "Rice" },
  { name: "Jeera Rice", servingSize: 200, servingUnit: "g", calories: 280, proteinG: 5, carbsG: 48, fatG: 7, fiberG: 1, category: "Rice" },
  { name: "Vegetable Pulao", servingSize: 250, servingUnit: "g", calories: 360, proteinG: 7, carbsG: 55, fatG: 11, fiberG: 3, category: "Rice" },
  { name: "Chicken Biryani", servingSize: 300, servingUnit: "g", calories: 520, proteinG: 25, carbsG: 55, fatG: 21, fiberG: 2, category: "Rice" },
  { name: "Veg Biryani", servingSize: 300, servingUnit: "g", calories: 420, proteinG: 8, carbsG: 60, fatG: 15, fiberG: 3, category: "Rice" },
  { name: "Curd Rice", servingSize: 200, servingUnit: "g", calories: 240, proteinG: 6, carbsG: 38, fatG: 6, fiberG: 1, category: "Rice" },
  { name: "Lemon Rice", servingSize: 200, servingUnit: "g", calories: 300, proteinG: 5, carbsG: 45, fatG: 10, fiberG: 1.5, category: "Rice" },

  // Dals & curries
  { name: "Toor Dal (cooked)", servingSize: 150, servingUnit: "g", calories: 145, proteinG: 8, carbsG: 22, fatG: 2.5, fiberG: 5, category: "Dal & Curry" },
  { name: "Moong Dal (cooked)", servingSize: 150, servingUnit: "g", calories: 140, proteinG: 9, carbsG: 20, fatG: 2, fiberG: 5.5, category: "Dal & Curry" },
  { name: "Chana Dal (cooked)", servingSize: 150, servingUnit: "g", calories: 170, proteinG: 9.5, carbsG: 25, fatG: 3, fiberG: 6, category: "Dal & Curry" },
  { name: "Dal Makhani", servingSize: 200, servingUnit: "g", calories: 310, proteinG: 11, carbsG: 28, fatG: 17, fiberG: 6, category: "Dal & Curry" },
  { name: "Rajma (kidney bean curry)", servingSize: 200, servingUnit: "g", calories: 260, proteinG: 12, carbsG: 33, fatG: 8, fiberG: 9, category: "Dal & Curry" },
  { name: "Chole (chickpea curry)", servingSize: 200, servingUnit: "g", calories: 280, proteinG: 11, carbsG: 35, fatG: 10, fiberG: 8, category: "Dal & Curry" },
  { name: "Sambar", servingSize: 200, servingUnit: "g", calories: 130, proteinG: 6, carbsG: 18, fatG: 4, fiberG: 4, category: "Dal & Curry" },
  { name: "Butter Chicken", servingSize: 250, servingUnit: "g", calories: 490, proteinG: 27, carbsG: 12, fatG: 36, fiberG: 1.5, category: "Non-veg curry" },
  { name: "Chicken Curry", servingSize: 250, servingUnit: "g", calories: 340, proteinG: 28, carbsG: 8, fatG: 21, fiberG: 1.5, category: "Non-veg curry" },
  { name: "Egg Curry", servingSize: 200, servingUnit: "g (2 eggs)", calories: 300, proteinG: 15, carbsG: 8, fatG: 23, fiberG: 1.5, category: "Non-veg curry" },
  { name: "Fish Curry", servingSize: 250, servingUnit: "g", calories: 290, proteinG: 26, carbsG: 6, fatG: 18, fiberG: 1, category: "Non-veg curry" },
  { name: "Mutton Curry", servingSize: 250, servingUnit: "g", calories: 420, proteinG: 30, carbsG: 6, fatG: 30, fiberG: 1, category: "Non-veg curry" },

  // Paneer & vegetable sabzis
  { name: "Paneer Butter Masala", servingSize: 200, servingUnit: "g", calories: 430, proteinG: 15, carbsG: 14, fatG: 35, fiberG: 2, category: "Paneer" },
  { name: "Palak Paneer", servingSize: 200, servingUnit: "g", calories: 320, proteinG: 14, carbsG: 10, fatG: 25, fiberG: 3, category: "Paneer" },
  { name: "Shahi Paneer", servingSize: 200, servingUnit: "g", calories: 400, proteinG: 14, carbsG: 13, fatG: 32, fiberG: 2, category: "Paneer" },
  { name: "Kadai Paneer", servingSize: 200, servingUnit: "g", calories: 350, proteinG: 14, carbsG: 12, fatG: 27, fiberG: 3, category: "Paneer" },
  { name: "Raw Paneer", servingSize: 100, servingUnit: "g", calories: 265, proteinG: 18, carbsG: 3.5, fatG: 20, fiberG: 0, category: "Paneer" },
  { name: "Aloo Gobi", servingSize: 200, servingUnit: "g", calories: 210, proteinG: 5, carbsG: 26, fatG: 10, fiberG: 5, category: "Vegetables" },
  { name: "Aloo Jeera", servingSize: 200, servingUnit: "g", calories: 240, proteinG: 4, carbsG: 30, fatG: 12, fiberG: 4, category: "Vegetables" },
  { name: "Bhindi Masala (okra)", servingSize: 200, servingUnit: "g", calories: 180, proteinG: 4, carbsG: 16, fatG: 11, fiberG: 6, category: "Vegetables" },
  { name: "Baingan Bharta", servingSize: 200, servingUnit: "g", calories: 190, proteinG: 3.5, carbsG: 16, fatG: 12, fiberG: 6, category: "Vegetables" },
  { name: "Mixed Vegetable Curry", servingSize: 200, servingUnit: "g", calories: 200, proteinG: 5, carbsG: 20, fatG: 11, fiberG: 5, category: "Vegetables" },
  { name: "Palak (spinach, cooked)", servingSize: 150, servingUnit: "g", calories: 90, proteinG: 4, carbsG: 8, fatG: 5, fiberG: 4, category: "Vegetables" },
  { name: "Cabbage Sabzi", servingSize: 150, servingUnit: "g", calories: 110, proteinG: 2.5, carbsG: 12, fatG: 6, fiberG: 4, category: "Vegetables" },

  // South Indian breakfast
  { name: "Idli", servingSize: 2, servingUnit: "pieces (~80g)", calories: 120, proteinG: 4, carbsG: 24, fatG: 0.6, fiberG: 1.5, category: "South Indian" },
  { name: "Plain Dosa", servingSize: 1, servingUnit: "piece (~90g)", calories: 168, proteinG: 3.9, carbsG: 29, fatG: 3.7, fiberG: 1.2, category: "South Indian" },
  { name: "Masala Dosa", servingSize: 1, servingUnit: "piece (~150g)", calories: 280, proteinG: 5.5, carbsG: 40, fatG: 10, fiberG: 2.5, category: "South Indian" },
  { name: "Uttapam", servingSize: 1, servingUnit: "piece (~120g)", calories: 220, proteinG: 5, carbsG: 32, fatG: 7, fiberG: 2, category: "South Indian" },
  { name: "Medu Vada", servingSize: 2, servingUnit: "pieces (~80g)", calories: 220, proteinG: 6, carbsG: 22, fatG: 12, fiberG: 2.5, category: "South Indian" },
  { name: "Upma", servingSize: 200, servingUnit: "g", calories: 250, proteinG: 6, carbsG: 38, fatG: 8, fiberG: 3, category: "South Indian" },
  { name: "Pongal", servingSize: 200, servingUnit: "g", calories: 300, proteinG: 8, carbsG: 45, fatG: 9, fiberG: 2, category: "South Indian" },

  // North Indian breakfast / snacks
  { name: "Poha", servingSize: 200, servingUnit: "g", calories: 270, proteinG: 5, carbsG: 45, fatG: 8, fiberG: 3, category: "Breakfast" },
  { name: "Besan Chilla", servingSize: 1, servingUnit: "piece (~80g)", calories: 150, proteinG: 7, carbsG: 15, fatG: 7, fiberG: 3, category: "Breakfast" },
  { name: "Samosa", servingSize: 1, servingUnit: "piece (~60g)", calories: 260, proteinG: 4, carbsG: 24, fatG: 17, fiberG: 2, category: "Snacks" },
  { name: "Kachori", servingSize: 1, servingUnit: "piece (~60g)", calories: 240, proteinG: 5, carbsG: 26, fatG: 13, fiberG: 2, category: "Snacks" },
  { name: "Pakora / Bhajiya (mixed veg)", servingSize: 100, servingUnit: "g", calories: 280, proteinG: 6, carbsG: 24, fatG: 18, fiberG: 3, category: "Snacks" },
  { name: "Dhokla", servingSize: 100, servingUnit: "g", calories: 160, proteinG: 6, carbsG: 24, fatG: 4, fiberG: 2, category: "Snacks" },
  { name: "Pav Bhaji", servingSize: 300, servingUnit: "g (with pav)", calories: 450, proteinG: 10, carbsG: 60, fatG: 18, fiberG: 6, category: "Snacks" },
  { name: "Vada Pav", servingSize: 1, servingUnit: "piece (~120g)", calories: 290, proteinG: 6, carbsG: 40, fatG: 12, fiberG: 3, category: "Snacks" },
  { name: "Chana Chaat", servingSize: 150, servingUnit: "g", calories: 200, proteinG: 9, carbsG: 30, fatG: 5, fiberG: 8, category: "Snacks" },
  { name: "Bhel Puri", servingSize: 150, servingUnit: "g", calories: 220, proteinG: 5, carbsG: 38, fatG: 6, fiberG: 3, category: "Snacks" },
  { name: "Sev Puri", servingSize: 150, servingUnit: "g", calories: 260, proteinG: 5, carbsG: 36, fatG: 11, fiberG: 3, category: "Snacks" },
  { name: "Pani Puri", servingSize: 6, servingUnit: "pieces (~90g)", calories: 180, proteinG: 3, carbsG: 30, fatG: 5, fiberG: 2, category: "Snacks" },

  // Eggs, tandoor & grills
  { name: "Boiled Egg", servingSize: 1, servingUnit: "large egg (~50g)", calories: 78, proteinG: 6.3, carbsG: 0.6, fatG: 5.3, fiberG: 0, category: "Eggs" },
  { name: "Omelette (2 eggs)", servingSize: 1, servingUnit: "serving (~120g)", calories: 200, proteinG: 13, carbsG: 2, fatG: 16, fiberG: 0, category: "Eggs" },
  { name: "Egg Bhurji", servingSize: 1, servingUnit: "serving (2 eggs, ~150g)", calories: 240, proteinG: 14, carbsG: 5, fatG: 18, fiberG: 1, category: "Eggs" },
  { name: "Tandoori Chicken", servingSize: 150, servingUnit: "g (leg piece)", calories: 260, proteinG: 32, carbsG: 3, fatG: 13, fiberG: 0.5, category: "Non-veg curry" },
  { name: "Chicken Tikka", servingSize: 150, servingUnit: "g", calories: 230, proteinG: 30, carbsG: 4, fatG: 10, fiberG: 0.5, category: "Non-veg curry" },
  { name: "Chicken 65", servingSize: 150, servingUnit: "g", calories: 320, proteinG: 25, carbsG: 12, fatG: 20, fiberG: 1, category: "Non-veg curry" },

  // Dairy & sides
  { name: "Plain Curd / Yogurt", servingSize: 100, servingUnit: "g", calories: 60, proteinG: 3.5, carbsG: 4.7, fatG: 3.3, fiberG: 0, category: "Dairy" },
  { name: "Buttermilk (Chaas)", servingSize: 250, servingUnit: "ml", calories: 45, proteinG: 2, carbsG: 4, fatG: 1.5, fiberG: 0, category: "Beverages" },
  { name: "Raita", servingSize: 100, servingUnit: "g", calories: 70, proteinG: 3, carbsG: 6, fatG: 3.5, fiberG: 0.5, category: "Dairy" },
  { name: "Ghee", servingSize: 1, servingUnit: "tsp (5g)", calories: 45, proteinG: 0, carbsG: 0, fatG: 5, fiberG: 0, category: "Dairy" },
  { name: "Milk (whole)", servingSize: 250, servingUnit: "ml", calories: 150, proteinG: 8, carbsG: 12, fatG: 8, fiberG: 0, category: "Dairy" },
  { name: "Chai (with milk & sugar)", servingSize: 150, servingUnit: "ml", calories: 60, proteinG: 1.5, carbsG: 9, fatG: 2, fiberG: 0, category: "Beverages" },
  { name: "Filter Coffee (with milk & sugar)", servingSize: 150, servingUnit: "ml", calories: 70, proteinG: 2, carbsG: 10, fatG: 2.5, fiberG: 0, category: "Beverages" },

  // Sweets
  { name: "Gulab Jamun", servingSize: 1, servingUnit: "piece (~40g)", calories: 150, proteinG: 2, carbsG: 20, fatG: 7, fiberG: 0.3, sugarG: 18, category: "Sweets" },
  { name: "Rasgulla", servingSize: 1, servingUnit: "piece (~40g)", calories: 106, proteinG: 2, carbsG: 22, fatG: 1, fiberG: 0, sugarG: 20, category: "Sweets" },
  { name: "Jalebi", servingSize: 1, servingUnit: "piece (~15g)", calories: 60, proteinG: 0.4, carbsG: 10, fatG: 2, fiberG: 0, sugarG: 8, category: "Sweets" },
  { name: "Kheer", servingSize: 150, servingUnit: "g", calories: 220, proteinG: 5, carbsG: 32, fatG: 8, fiberG: 0.5, sugarG: 25, category: "Sweets" },
  { name: "Barfi", servingSize: 1, servingUnit: "piece (~30g)", calories: 130, proteinG: 2.5, carbsG: 15, fatG: 7, fiberG: 0.3, sugarG: 13, category: "Sweets" },

  // Legumes / staples as raw reference (useful for logging home-cooked meals precisely)
  { name: "Cooked Chickpeas (plain)", servingSize: 100, servingUnit: "g", calories: 164, proteinG: 8.9, carbsG: 27, fatG: 2.6, fiberG: 7.6, category: "Legumes" },
  { name: "Cooked Kidney Beans (plain)", servingSize: 100, servingUnit: "g", calories: 127, proteinG: 8.7, carbsG: 22.8, fatG: 0.5, fiberG: 6.4, category: "Legumes" },
  { name: "Sprouted Moong (raw)", servingSize: 100, servingUnit: "g", calories: 105, proteinG: 9, carbsG: 19, fatG: 0.4, fiberG: 4, category: "Legumes" },
  { name: "Peanuts (roasted)", servingSize: 30, servingUnit: "g", calories: 170, proteinG: 7.7, carbsG: 5, fatG: 14, fiberG: 2.5, category: "Snacks" },
  { name: "Almonds", servingSize: 10, servingUnit: "g (~8 nuts)", calories: 58, proteinG: 2.1, carbsG: 2.2, fatG: 5, fiberG: 1.3, category: "Snacks" },
];
