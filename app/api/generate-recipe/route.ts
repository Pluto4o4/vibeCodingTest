import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // For now, we'll just simulate a delay and return a mock recipe.
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockRecipe = `菜名：番茄炒蛋

所需食材：
- 番茄: 2个
- 鸡蛋: 3个
- 葱: 1根
- 盐: 适量
- 糖: 少许

烹饪步骤：
1. 番茄洗净切块，鸡蛋打散，葱切花。
2. 热锅冷油，倒入蛋液炒熟盛出。
3. 锅中留底油，放入番茄块翻炒至软烂出汁。
4. 加入炒好的鸡蛋，放入盐和糖调味，翻炒均匀。
5. 出锅前撒上葱花即可。`;

  return NextResponse.json({ recipe: mockRecipe });
}
