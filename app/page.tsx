'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Restaurant,
  LocalFireDepartment,
  ShoppingCart,
  ContentCopy,
  QuestionMark,
  CheckCircle,
  MenuBook,
  List,
  CheckBox
} from '@mui/icons-material';

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
  error?: string;
}

// 菜谱显示组件
function RecipeDisplay({ recipe }: { recipe: string }) {
  const parseRecipe = (recipeText: string) => {
    const lines = recipeText.split('\n').filter(line => line.trim());
    let dishName = '';
    const ingredients: string[] = [];
    const steps: string[] = [];
    let currentSection = '';

    for (const line of lines) {
      if (line.startsWith('菜名：')) {
        dishName = line.replace('菜名：', '').trim();
      } else if (line.includes('所需食材：')) {
        currentSection = 'ingredients';
      } else if (line.includes('烹饪步骤：')) {
        currentSection = 'steps';
      } else if (line.startsWith('- ') && currentSection === 'ingredients') {
        ingredients.push(line.replace('- ', '').trim());
      } else if (line.match(/^\d+\. /) && currentSection === 'steps') {
        steps.push(line.replace(/^\d+\. /, '').trim());
      }
    }

    return { dishName, ingredients, steps };
  };

  const { dishName, ingredients, steps } = parseRecipe(recipe);

  return (
    <Box>
      {/* 菜名 */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h2"
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <MenuBook sx={{ fontSize: 35 }} />
          {dishName}
        </Typography>
      </Box>

      {/* 所需食材 */}
      <Card sx={{ mb: 3, backgroundColor: '#FFF8E1' }}>
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
          >
            <List color="secondary" />
            所需食材
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ingredients.map((ingredient, index) => (
              <Chip
                key={index}
                label={ingredient}
                variant="filled"
                sx={{
                  backgroundColor: 'secondary.light',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* 烹饪步骤 */}
      <Card sx={{ backgroundColor: '#F3E5F5' }}>
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}
          >
            <CheckBox color="primary" />
            烹饪步骤
          </Typography>
          <Box sx={{ pl: 2 }}>
            {steps.map((step, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {index + 1}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.primary',
                    flex: 1
                  }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [calories, setCalories] = useState<number | null>(null);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [originalIngredients, setOriginalIngredients] = useState('');

  const flavorOptions = [
    { value: '', label: '原味' },
    { value: '加辣', label: '加辣' },
    { value: '清淡', label: '清淡' },
    { value: '做成汤', label: '做成汤' }
  ];

  const handleGenerateRecipe = async (ingredientsToUse = ingredients) => {
    setIsLoading(true);
    setRecipe('');
    setCalories(null);
    setMissingIngredients([]);
    setCurrentQuestion(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientsToUse,
          flavor: selectedFlavor || undefined
        }),
      });

      const data: RecipeResponse = await response.json();

      if (data.error) {
        setRecipe(data.error);
      } else if (data.needsClarification && data.question) {
        setCurrentQuestion(data.question);
        setOriginalIngredients(ingredientsToUse);
      } else {
        setRecipe(data.recipe || '');
        setCalories(data.calories || null);
        setMissingIngredients(data.missingIngredients || []);
      }
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      setRecipe('生成菜谱失败，请稍后重试。');
    }
    setIsLoading(false);
  };

  const handleQuestionAnswer = (selectedOption: string) => {
    if (currentQuestion) {
      // 替换模糊食材为精确食材
      const updatedIngredients = originalIngredients.replace(
        currentQuestion.ingredient,
        selectedOption
      );

      setIngredients(updatedIngredients); // 更新显示的输入框内容
      handleGenerateRecipe(updatedIngredients);
    }
  };

  const copyMissingIngredients = async () => {
    if (missingIngredients.length > 0) {
      try {
        await navigator.clipboard.writeText(missingIngredients.join(', '));
        setCopySuccess(true);
      } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = missingIngredients.join(', ');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 主标题 - 手绘风格 */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
        <Typography
          variant="h1"
          component="h1"
          className="handwritten"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative'
          }}
        >
          <Restaurant sx={{ fontSize: 50, mr: 2, color: 'primary.main', verticalAlign: 'middle' }} />
          AI 净食厨房
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          让 AI 为你的食材创造无限可能 ✨
        </Typography>
      </Box>

      {/* 食材输入卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <List sx={{ color: 'secondary.main' }} />
            <span className="handwritten">输入你拥有的食材</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="例如：鸡蛋, 番茄, 剩米饭"
            variant="outlined"
            label="食材清单（用逗号分隔）"
          />
        </CardContent>
      </Card>

      {/* 风味选择卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant sx={{ color: 'primary.main' }} />
            <span className="handwritten">风味魔法棒</span>
          </Typography>
          <ToggleButtonGroup
            value={selectedFlavor}
            exclusive
            onChange={(event, newFlavor) => setSelectedFlavor(newFlavor || '')}
            sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
          >
            {flavorOptions.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                sx={{ px: 2, py: 1 }}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleGenerateRecipe()}
          disabled={isLoading || !ingredients}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Restaurant />}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          {isLoading ? '正在生成中...' : '开始烹饪'}
        </Button>
      </Box>

      {currentQuestion && (
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <QuestionMark />
              智能填空
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              {currentQuestion.question}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => handleQuestionAnswer(option)}
                  disabled={isLoading}
                  startIcon={<CheckCircle />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white'
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              💡 选择一个选项来获得更精准的菜谱推荐
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* 热量仪表盘 - 手绘风格 */}
      {calories !== null && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            textAlign: 'center',
            mb: 3,
            background: 'linear-gradient(135deg, #38A169 0%, #2F855A 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <LocalFireDepartment sx={{ fontSize: 35 }} />
            <span className="handwritten">热量仪表盘</span>
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'white', fontFamily: 'Caveat, cursive' }}>
            {calories} kcal
          </Typography>
        </Paper>
      )}

      {/* 美食创意卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook sx={{ color: 'primary.main' }} />
            <span className="handwritten">美食创意</span>
          </Typography>
          {recipe ? (
            <RecipeDisplay recipe={recipe} />
          ) : (
            <Box sx={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                🍽️ 这里将显示 AI 生成的菜谱...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 购物清单卡片 */}
      {missingIngredients.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCart sx={{ color: 'primary.main' }} />
              <span className="handwritten">您可能还需要：</span>
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {missingIngredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ContentCopy />}
              onClick={copyMissingIngredients}
              sx={{
                mt: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              📋 一键复制购物清单
            </Button>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          ✅ 购物清单已复制到剪贴板！
        </Alert>
      </Snackbar>
    </Container>
  );
}
