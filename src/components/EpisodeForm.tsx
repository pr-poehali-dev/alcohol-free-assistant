import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Episode } from '@/pages/Index';

interface EpisodeFormProps {
  onSubmit: (episode: Omit<Episode, 'id'>) => void;
}

const commonEmotions = [
  'Стресс',
  'Тревога',
  'Усталость',
  'Одиночество',
  'Скука',
  'Радость',
  'Грусть',
  'Гнев',
];

const EpisodeForm = ({ onSubmit }: EpisodeFormProps) => {
  const [situation, setSituation] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [thoughts, setThoughts] = useState('');
  const [trigger, setTrigger] = useState('');
  const [consumed, setConsumed] = useState(false);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!situation.trim() || selectedEmotions.length === 0 || !trigger.trim()) {
      return;
    }

    onSubmit({
      date: new Date().toISOString(),
      situation: situation.trim(),
      emotions: selectedEmotions,
      thoughts: thoughts.trim(),
      trigger: trigger.trim(),
      consumed,
    });

    setSituation('');
    setSelectedEmotions([]);
    setThoughts('');
    setTrigger('');
    setConsumed(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="situation">Что произошло?</Label>
        <Textarea
          id="situation"
          placeholder="Опиши ситуацию: где ты был, что делал, кто был рядом..."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className="min-h-[100px] resize-none"
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Какие эмоции ты ощущал?</Label>
        <div className="flex flex-wrap gap-2">
          {commonEmotions.map((emotion) => (
            <button
              key={emotion}
              type="button"
              onClick={() => toggleEmotion(emotion)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedEmotions.includes(emotion)
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thoughts">Какие мысли были в голове?</Label>
        <Textarea
          id="thoughts"
          placeholder="Что ты думал в этот момент? Какой внутренний диалог шёл?"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trigger">Что стало финальным толчком?</Label>
        <Input
          id="trigger"
          placeholder="Конкретное событие или мысль, которая запустила желание..."
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <Icon name="Wine" size={20} className="text-muted-foreground" />
          <Label htmlFor="consumed" className="cursor-pointer">
            Я выпил в этот раз
          </Label>
        </div>
        <Switch
          id="consumed"
          checked={consumed}
          onCheckedChange={setConsumed}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
        <Icon name="Save" size={20} className="mr-2" />
        Сохранить эпизод
      </Button>
    </form>
  );
};

export default EpisodeForm;
