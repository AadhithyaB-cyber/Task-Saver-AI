import { Task } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { differenceInDays, isPast, isToday, parseISO } from "date-fns";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export function TaskCard({ task, onToggle, onDelete, priority }: TaskCardProps) {
  const deadlineDate = parseISO(task.deadline);
  
  let daysLabel = "";
  if (isToday(deadlineDate)) {
    daysLabel = "Due today";
  } else if (isPast(deadlineDate)) {
    const diff = differenceInDays(new Date(), deadlineDate);
    daysLabel = `Overdue by ${diff} day${diff !== 1 ? 's' : ''}`;
  } else {
    const diff = differenceInDays(deadlineDate, new Date());
    daysLabel = `${diff} day${diff !== 1 ? 's' : ''} left`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className={`relative overflow-hidden transition-all duration-200 border-l-4 ${
        task.completed 
          ? "opacity-60 border-l-muted bg-card/30" 
          : priority === "HIGH" 
            ? "border-l-destructive bg-card/80 shadow-md shadow-destructive/5" 
            : priority === "MEDIUM"
              ? "border-l-amber-500 bg-card/80"
              : "border-l-teal-500 bg-card/80"
      }`}>
        <CardContent className="p-5 flex gap-4 items-start">
          <div className="pt-1">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => onToggle(task.id)}
              className="h-5 w-5 rounded-full border-primary/50 data-[state=checked]:bg-primary"
              data-testid={`checkbox-task-${task.id}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`font-semibold text-lg truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </h3>
              
              {!task.completed && (
                <Badge variant="outline" className={`shrink-0 ${
                  priority === "HIGH" ? "text-destructive border-destructive/30 bg-destructive/10" :
                  priority === "MEDIUM" ? "text-amber-500 border-amber-500/30 bg-amber-500/10" :
                  "text-teal-500 border-teal-500/30 bg-teal-500/10"
                }`}>
                  {priority}
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${task.completed ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs mt-3">
              <div className={`flex items-center gap-1.5 ${
                task.completed ? "text-muted-foreground" :
                isPast(deadlineDate) && !isToday(deadlineDate) ? "text-destructive font-medium" : 
                isToday(deadlineDate) ? "text-amber-500 font-medium" : 
                "text-muted-foreground"
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{daysLabel}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
              onClick={() => onDelete(task.id)}
              data-testid={`btn-delete-task-${task.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
