import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Episode } from '@/pages/Index';

interface PatternAnalysisProps {
  episodes: Episode[];
}

const PatternAnalysis = ({ episodes }: PatternAnalysisProps) => {
  if (episodes.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="Brain" size={48} className="text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            Недостаточно данных для анализа
          </p>
          <p className="text-sm text-muted-foreground/70">
            Сделай минимум 3-5 записей, чтобы увидеть первые паттерны
          </p>
        </CardContent>
      </Card>
    );
  }

  const emotionCounts = episodes.reduce((acc, episode) => {
    episode.emotions.forEach((emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const triggerWords = episodes
    .map((e) => e.trigger.toLowerCase())
    .join(' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const triggerCounts = triggerWords.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 1)
    .slice(0, 5);

  const consumedCount = episodes.filter((e) => e.consumed).length;
  const resistedCount = episodes.length - consumedCount;
  const resistanceRate = episodes.length > 0 ? Math.round((resistedCount / episodes.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Icon name="Activity" size={24} className="text-primary" />
            Эмоциональные паттерны
          </CardTitle>
          <CardDescription>
            Какие эмоции чаще всего предшествуют эпизодам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEmotions.map(([emotion, count]) => {
              const percentage = Math.round((count / episodes.length) * 100);
              return (
                <div key={emotion} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{emotion}</span>
                    <span className="text-muted-foreground">
                      {count} раз ({percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {commonTriggers.length > 0 && (
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Icon name="Target" size={24} className="text-primary" />
              Повторяющиеся триггеры
            </CardTitle>
            <CardDescription>
              Слова и темы, которые часто появляются в описании толчков
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {commonTriggers.map(([word, count]) => (
                <div
                  key={word}
                  className="px-4 py-2 rounded-lg bg-secondary/30 border border-secondary text-secondary-foreground"
                >
                  <span className="font-medium">{word}</span>
                  <span className="ml-2 text-xs text-muted-foreground">×{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Icon name="Lightbulb" size={24} className="text-primary" />
            Инсайты и рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg glass-effect">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-1">Уровень сопротивления</h4>
                <p className="text-sm text-muted-foreground">
                  В {resistanceRate}% случаев ({resistedCount} из {episodes.length}) ты смог удержаться от употребления. 
                  {resistanceRate > 50 
                    ? ' Это сильный результат — твоя осознанность растёт.' 
                    : ' Продолжай анализировать триггеры, чтобы усилить контроль.'}
                </p>
              </div>
            </div>
          </div>

          {topEmotions.length > 0 && (
            <div className="p-4 rounded-lg glass-effect">
              <div className="flex items-start gap-3">
                <Icon name="Heart" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium mb-1">Ключевая эмоция</h4>
                  <p className="text-sm text-muted-foreground">
                    Чаще всего ты испытываешь <strong>{topEmotions[0][0].toLowerCase()}</strong>. 
                    Это твой главный эмоциональный триггер. Подумай, какие здоровые способы помогут тебе 
                    справляться с этим чувством — дыхание, движение, разговор с близким человеком.
                  </p>
                </div>
              </div>
            </div>
          )}

          {episodes.length >= 5 && (
            <div className="p-4 rounded-lg glass-effect">
              <div className="flex items-start gap-3">
                <Icon name="Sparkles" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium mb-1">Новый паттерн формируется</h4>
                  <p className="text-sm text-muted-foreground">
                    Ты записал {episodes.length} эпизодов. Твоё сознание уже начинает замечать закономерности. 
                    Продолжай наблюдать — и скоро сможешь предсказывать триггеры до их активации.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternAnalysis;
