import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Episode } from '@/pages/Index';

interface ProgressDashboardProps {
  episodes: Episode[];
}

const ProgressDashboard = ({ episodes }: ProgressDashboardProps) => {
  if (episodes.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="TrendingUp" size={48} className="text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            Прогресс появится после первых записей
          </p>
          <p className="text-sm text-muted-foreground/70">
            Начни отслеживать эпизоды, чтобы видеть своё развитие
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalEpisodes = episodes.length;
  const consumedCount = episodes.filter((e) => e.consumed).length;
  const resistedCount = totalEpisodes - consumedCount;
  const resistanceRate = Math.round((resistedCount / totalEpisodes) * 100);

  const last7Days = episodes.filter((e) => {
    const episodeDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return episodeDate >= weekAgo;
  });

  const weeklyResisted = last7Days.filter((e) => !e.consumed).length;
  const weeklyRate = last7Days.length > 0 
    ? Math.round((weeklyResisted / last7Days.length) * 100) 
    : 0;

  const sortedByDate = [...episodes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getStreak = () => {
    let currentStreak = 0;
    for (let i = sortedByDate.length - 1; i >= 0; i--) {
      if (!sortedByDate[i].consumed) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  };

  const streak = getStreak();

  const emotionalTrend = episodes.slice(0, 5).map((episode) => ({
    date: new Date(episode.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    emotions: episode.emotions.length,
    consumed: episode.consumed,
  })).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Общий показатель</p>
                <p className="text-3xl font-bold font-heading">{resistanceRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {resistedCount} из {totalEpisodes} эпизодов
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Shield" size={28} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">За последние 7 дней</p>
                <p className="text-3xl font-bold font-heading">{weeklyRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {weeklyResisted} из {last7Days.length} эпизодов
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Icon name="Calendar" size={28} className="text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Текущая серия</p>
                <p className="text-3xl font-bold font-heading">{streak}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {streak === 1 ? 'эпизод' : 'эпизодов'} без употребления
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center">
                <Icon name="Flame" size={28} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Icon name="BarChart3" size={24} className="text-primary" />
            Динамика последних записей
          </CardTitle>
          <CardDescription>
            Как меняется твоё состояние и поведение
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emotionalTrend.map((point, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">{point.date}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden flex items-center">
                    <div
                      className={`h-full flex items-center justify-center text-xs font-medium transition-all ${
                        point.consumed
                          ? 'bg-destructive/70 text-destructive-foreground'
                          : 'bg-primary/70 text-primary-foreground'
                      }`}
                      style={{ width: `${Math.max((point.emotions / 8) * 100, 15)}%` }}
                    >
                      {point.emotions > 0 && `${point.emotions}`}
                    </div>
                  </div>
                  <Icon
                    name={point.consumed ? 'X' : 'Check'}
                    size={20}
                    className={point.consumed ? 'text-destructive' : 'text-primary'}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Длина полоски = количество эмоций в эпизоде. Зелёный цвет = устоял, красный = выпил.
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Icon name="Star" size={24} className="text-primary" />
            Твои достижения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {totalEpisodes >= 1 && (
            <div className="flex items-center gap-3 p-3 rounded-lg glass-effect">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="BookOpen" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Первый шаг</p>
                <p className="text-xs text-muted-foreground">Начал вести дневник осознанности</p>
              </div>
            </div>
          )}

          {totalEpisodes >= 5 && (
            <div className="flex items-center gap-3 p-3 rounded-lg glass-effect">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Layers" size={20} className="text-secondary" />
              </div>
              <div>
                <p className="font-medium text-sm">Исследователь паттернов</p>
                <p className="text-xs text-muted-foreground">Зафиксировал 5+ эпизодов</p>
              </div>
            </div>
          )}

          {streak >= 3 && (
            <div className="flex items-center gap-3 p-3 rounded-lg glass-effect">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Серия силы</p>
                <p className="text-xs text-muted-foreground">Удержался {streak} раз подряд</p>
              </div>
            </div>
          )}

          {resistanceRate >= 70 && totalEpisodes >= 10 && (
            <div className="flex items-center gap-3 p-3 rounded-lg glass-effect">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Trophy" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Мастер трансформации</p>
                <p className="text-xs text-muted-foreground">Показатель выше 70%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
