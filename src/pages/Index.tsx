import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import EpisodeForm from '@/components/EpisodeForm';
import PatternAnalysis from '@/components/PatternAnalysis';
import ProgressDashboard from '@/components/ProgressDashboard';

export interface Episode {
  id: string;
  date: string;
  situation: string;
  emotions: string[];
  thoughts: string;
  trigger: string;
  consumed: boolean;
}

const STORAGE_KEY = 'transformation_episodes';

const Index = () => {
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState('diary');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
  }, [episodes]);

  const addEpisode = (episode: Omit<Episode, 'id'>) => {
    const newEpisode = {
      ...episode,
      id: Date.now().toString(),
    };
    setEpisodes([newEpisode, ...episodes]);
  };

  return (
    <div className="min-h-screen meditation-gradient">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Icon name="Brain" size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
            Пространство трансформации
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Анализируй паттерны. Понимай триггеры. Создавай новые алгоритмы поведения.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto h-auto p-1 glass-effect">
            <TabsTrigger 
              value="diary" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Дневник</span>
            </TabsTrigger>
            <TabsTrigger 
              value="patterns" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon name="Network" size={18} />
              <span className="hidden sm:inline">Паттерны</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon name="TrendingUp" size={18} />
              <span className="hidden sm:inline">Прогресс</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diary" className="animate-fade-in space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Icon name="PenLine" size={24} className="text-primary" />
                  Записать эпизод
                </CardTitle>
                <CardDescription>
                  Опиши ситуацию без оценок. Просто факты и ощущения.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EpisodeForm onSubmit={addEpisode} />
              </CardContent>
            </Card>

            {episodes.length > 0 && (
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading">Последние записи</CardTitle>
                  <CardDescription>
                    {episodes.length} {episodes.length === 1 ? 'эпизод' : 'эпизодов'} зафиксировано
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {episodes.slice(0, 5).map((episode) => (
                    <div
                      key={episode.id}
                      className="p-4 rounded-lg bg-muted/50 border border-border hover-scale"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={episode.consumed ? "AlertCircle" : "CheckCircle"} 
                            size={20} 
                            className={episode.consumed ? "text-destructive" : "text-primary"}
                          />
                          <span className="text-sm text-muted-foreground">
                            {new Date(episode.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mb-2">{episode.situation}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {episode.emotions.map((emotion, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        Триггер: {episode.trigger}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {episodes.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="Sparkles" size={48} className="text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Начни с первой записи. Каждый эпизод — это шаг к пониманию.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="animate-fade-in">
            <PatternAnalysis episodes={episodes} />
          </TabsContent>

          <TabsContent value="progress" className="animate-fade-in">
            <ProgressDashboard episodes={episodes} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;