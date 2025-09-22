'use client';

import { useState } from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setRecipe('');
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      setRecipe('生成菜谱失败，请稍后重试。');
    }
    setIsLoading(false);
  };

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '24px', textAlign: 'center' }}>AI 净食厨房</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="ingredients-input">输入你拥有的食材（用逗号分隔）：</label>
        <textarea
          id="ingredients-input"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="例如：鸡蛋, 番茄, 剩米饭"
          rows={4}
          style={{ padding: '8px', fontSize: '16px', border: '1px solid black', borderRadius: '4px' }}
        />
      </div>

      <button
        onClick={handleGenerateRecipe}
        disabled={isLoading || !ingredients}
        style={{
          padding: '12px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: isLoading || !ingredients ? '#ccc' : 'black',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {isLoading ? '正在生成中...' : '开始烹饪'}
      </button>

      <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '4px', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
        {recipe || '这里将显示 AI 生成的菜谱...'}
      </div>
    </main>
  );
}
