import { NextResponse } from 'next/server';

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  calories: number;
  requiredIngredients: string[];
}

interface Question {
  ingredient: string;
  question: string;
  options: string[];
}

interface RecipeResponse {
  recipe?: string;
  calories?: number;
  missingIngredients?: string[];
  question?: Question;
  needsClarification?: boolean;
}

// 模糊食材检测配置
const ambiguousIngredients: Record<string, { question: string; options: string[] }> = {
  '牛肉': {
    question: '为了更好地为您设计菜谱，请问您的牛肉是：',
    options: ['生牛肉', '熟牛肉片', '牛肉丝', '牛肉块']
  },
  '鸡肉': {
    question: '请选择您的鸡肉类型：',
    options: ['生鸡胸肉', '生鸡腿肉', '熟鸡肉丝', '鸡肉块']
  },
  '蔬菜': {
    question: '请选择具体的蔬菜：',
    options: ['青菜', '白菜', '菠菜', '生菜']
  },
  '肉': {
    question: '请选择具体的肉类：',
    options: ['猪肉', '牛肉', '鸡肉', '鱼肉']
  },
  '鱼': {
    question: '请选择鱼的类型：',
    options: ['鲜鱼', '鱼片', '鱼块', '鱼丸']
  }
};

const recipes: Recipe[] = [
  {
    name: "番茄炒蛋",
    ingredients: ["番茄", "鸡蛋", "葱", "盐", "糖", "油"],
    requiredIngredients: ["番茄", "鸡蛋"],
    steps: [
      "番茄洗净切块，鸡蛋打散，葱切花。",
      "热锅冷油，倒入蛋液炒熟盛出。",
      "锅中留底油，放入番茄块翻炒至软烂出汁。",
      "加入炒好的鸡蛋，放入盐和糖调味，翻炒均匀。",
      "出锅前撒上葱花即可。"
    ],
    calories: 320
  },
  {
    name: "蛋炒饭",
    ingredients: ["米饭", "鸡蛋", "胡萝卜", "豌豆", "火腿", "盐", "生抽", "油"],
    requiredIngredients: ["米饭", "鸡蛋"],
    steps: [
      "米饭打散，鸡蛋打散备用。",
      "胡萝卜、火腿切小丁。",
      "热锅下油，倒入蛋液炒散盛起。",
      "锅中放油，下胡萝卜丁和火腿丁炒香。",
      "倒入米饭翻炒，加入豌豆和炒蛋。",
      "用盐和生抽调味，炒匀即可。"
    ],
    calories: 450
  },
  {
    name: "青菜豆腐汤",
    ingredients: ["豆腐", "青菜", "香菇", "高汤", "盐", "香油"],
    requiredIngredients: ["豆腐", "青菜"],
    steps: [
      "豆腐切块，青菜洗净切段，香菇切片。",
      "锅中倒入高汤或清水烧开。",
      "下入豆腐块和香菇片，煮5分钟。",
      "加入青菜段，煮2分钟。",
      "用盐调味，出锅前淋香油即可。"
    ],
    calories: 180
  },
  {
    name: "土豆牛肉丝",
    ingredients: ["生牛肉", "土豆", "青椒", "洋葱", "生抽", "老抽", "盐", "糖", "油", "蒜", "姜"],
    requiredIngredients: ["生牛肉", "土豆"],
    steps: [
      "牛肉切丝用生抽、盐腌制15分钟，土豆切丝过水备用。",
      "青椒、洋葱切丝，蒜姜切末。",
      "热锅下油，先炒牛肉丝至变色盛起。",
      "锅中留底油，下蒜姜爆香，放入土豆丝翻炒3分钟。",
      "加入青椒、洋葱丝继续炒制2分钟。",
      "倒入牛肉丝，用生抽、老抽、盐、糖调味炒匀即可。"
    ],
    calories: 380
  },
  {
    name: "红烧土豆牛肉",
    ingredients: ["熟牛肉片", "土豆", "胡萝卜", "洋葱", "生抽", "老抽", "料酒", "冰糖", "盐", "八角", "桂皮"],
    requiredIngredients: ["熟牛肉片", "土豆"],
    steps: [
      "土豆、胡萝卜切滚刀块，洋葱切块。",
      "热锅下油，放入冰糖炒糖色至焦糖色。",
      "下入牛肉块翻炒上色，倒入料酒去腥。",
      "加入足量热水，放入八角、桂皮，大火煮开转小火炖30分钟。",
      "加入土豆块和胡萝卜块，继续炖20分钟。",
      "最后10分钟加入洋葱块，用盐调味，大火收汁即可。"
    ],
    calories: 420
  },
  {
    name: "生牛肉炒河粉",
    ingredients: ["生牛肉", "河粉", "豆芽", "韭菜", "生抽", "老抽", "蚝油", "盐", "糖", "油"],
    requiredIngredients: ["生牛肉", "河粉"],
    steps: [
      "牛肉切片用生抽、盐腌制，河粉用热水烫软。",
      "豆芽洗净，韭菜切段。",
      "热锅下油，爆炒牛肉片至七成熟盛起。",
      "锅中下河粉，用老抽调色，炒至微焦。",
      "加入豆芽炒软，倒入牛肉片。",
      "最后加入韭菜段，用生抽、蚝油、盐、糖调味炒匀即可。"
    ],
    calories: 510
  },
  {
    name: "鲜鱼豆腐汤",
    ingredients: ["鲜鱼", "豆腐", "香菜", "姜丝", "盐", "胡椒粉", "料酒", "油"],
    requiredIngredients: ["鲜鱼", "豆腐"],
    steps: [
      "鱼清洗干净切块，豆腐切块，香菜切段。",
      "热锅下油，放入鱼块煎至两面金黄。",
      "加入姜丝爆香，倒入料酒去腥。",
      "加入足量开水，大火煮10分钟至汤色奶白。",
      "放入豆腐块继续煮5分钟。",
      "最后用盐、胡椒粉调味，撒上香菜段即可。"
    ],
    calories: 280
  },
  {
    name: "生鸡胸肉时蔬",
    ingredients: ["生鸡胸肉", "西兰花", "胡萝卜", "彩椒", "蒜", "生抽", "盐", "黑胡椒", "油"],
    requiredIngredients: ["生鸡胸肉", "西兰花"],
    steps: [
      "鸡胸肉切条用盐、黑胡椒腌制，西兰花掰小朵。",
      "胡萝卜、彩椒切条，蒜切末。",
      "热锅下油，炒制鸡胸肉条至变色盛起。",
      "锅中下蒜末爆香，放入胡萝卜条炒软。",
      "加入西兰花和彩椒继续炒制3分钟。",
      "倒入鸡肉条，用生抽、盐调味炒匀即可。"
    ],
    calories: 320
  }
];

function normalizeIngredient(ingredient: string): string {
  return ingredient.trim().toLowerCase().replace(/[，,]/g, '');
}

function detectAmbiguousIngredients(userIngredients: string[]): Question | null {
  for (const ingredient of userIngredients) {
    const normalized = normalizeIngredient(ingredient);

    // 检查是否是模糊食材，要求精确匹配
    for (const [key, config] of Object.entries(ambiguousIngredients)) {
      // 只有当食材完全匹配模糊关键词时才触发澄清
      if (normalized === key) {
        return {
          ingredient: ingredient,
          question: config.question,
          options: config.options
        };
      }
    }
  }
  return null;
}

function findBestRecipe(userIngredients: string[]): Recipe {
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);

  let bestRecipe = recipes[0];
  let maxMatch = 0;

  for (const recipe of recipes) {
    const matches = recipe.requiredIngredients.filter(required =>
      normalizedUserIngredients.some(user =>
        normalizeIngredient(user).includes(normalizeIngredient(required)) ||
        normalizeIngredient(required).includes(normalizeIngredient(user))
      )
    ).length;

    if (matches > maxMatch) {
      maxMatch = matches;
      bestRecipe = recipe;
    }
  }

  return bestRecipe;
}

function calculateMissingIngredients(recipe: Recipe, userIngredients: string[]): string[] {
  const normalizedUserIngredients = userIngredients.map(normalizeIngredient);

  return recipe.ingredients.filter(required =>
    !normalizedUserIngredients.some(user =>
      normalizeIngredient(user).includes(normalizeIngredient(required)) ||
      normalizeIngredient(required).includes(normalizeIngredient(user))
    )
  );
}

function adjustRecipeForFlavor(recipe: Recipe, flavor?: string): Recipe {
  if (!flavor) return recipe;

  const adjustedRecipe = { ...recipe };

  switch (flavor) {
    case '加辣':
      adjustedRecipe.name += '（加辣版）';
      adjustedRecipe.ingredients.push('辣椒', '花椒');
      adjustedRecipe.steps.push('出锅前加入辣椒和花椒炒香。');
      adjustedRecipe.calories += 20;
      break;
    case '清淡':
      adjustedRecipe.name += '（清淡版）';
      adjustedRecipe.ingredients = adjustedRecipe.ingredients.filter(ing => ing !== '糖' && ing !== '生抽');
      adjustedRecipe.steps = adjustedRecipe.steps.map(step =>
        step.includes('糖') ? step.replace('和糖', '') : step
      );
      adjustedRecipe.calories -= 30;
      break;
    case '做成汤':
      adjustedRecipe.name += '汤';
      adjustedRecipe.ingredients.push('高汤', '胡椒粉');
      adjustedRecipe.steps.push('最后加入高汤煮3分钟，撒胡椒粉即可。');
      adjustedRecipe.calories += 50;
      break;
  }

  return adjustedRecipe;
}

function formatRecipe(recipe: Recipe): string {
  return `菜名：${recipe.name}

所需食材：
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

烹饪步骤：
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
}

export async function POST(request: Request) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const body = await request.json();
    const { ingredients, flavor } = body;


    if (!ingredients || typeof ingredients !== 'string') {
      return NextResponse.json({
        error: '请提供食材信息'
      }, { status: 400 });
    }

    const userIngredients = ingredients.split(/[,，]/).map(ing => ing.trim()).filter(ing => ing);

    if (userIngredients.length === 0) {
      return NextResponse.json({
        error: '请至少输入一种食材'
      }, { status: 400 });
    }

    // 检测模糊食材，需要澄清
    const ambiguousQuestion = detectAmbiguousIngredients(userIngredients);
    if (ambiguousQuestion) {
      return NextResponse.json({
        needsClarification: true,
        question: ambiguousQuestion
      });
    }

    let bestRecipe = findBestRecipe(userIngredients);
    bestRecipe = adjustRecipeForFlavor(bestRecipe, flavor);

    const missingIngredients = calculateMissingIngredients(bestRecipe, userIngredients);
    const formattedRecipe = formatRecipe(bestRecipe);

    const response: RecipeResponse = {
      recipe: formattedRecipe,
      calories: bestRecipe.calories,
      missingIngredients
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: '生成菜谱失败，请稍后重试'
    }, { status: 500 });
  }
}
