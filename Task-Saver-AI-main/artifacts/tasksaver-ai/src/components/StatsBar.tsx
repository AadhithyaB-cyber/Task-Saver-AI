import { Card, CardContent } from "@/components/ui/card";

interface StatsBarProps {
  total: number;
  highPriority: number;
  dueToday: number;
  completed: number;
}

export function StatsBar({ total, highPriority, dueToday, completed }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-foreground" data-testid="stat-total">{total}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-2xl font-bold text-destructive" data-testid="stat-high-priority">{highPriority}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
          <p className="text-sm text-muted-foreground mb-1">Due Today</p>
          <p className="text-2xl font-bold text-amber-500" data-testid="stat-due-today">{dueToday}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-primary" data-testid="stat-completed">{completed}</p>
        </CardContent>
      </Card>
    </div>
  );
}
