import { useEffect, useMemo, useState } from "react";
import { differenceInDays, isPast, isToday, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useTasks, Task } from "@/hooks/useTasks";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TaskCard } from "@/components/TaskCard";
import { MotivationalBanner } from "@/components/MotivationalBanner";
import { StatsBar } from "@/components/StatsBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";

type Priority = "HIGH" | "MEDIUM" | "LOW";

function getTaskPriority(deadline: string): Priority {
  const date = parseISO(deadline);
  if (isToday(date) || (isPast(date) && !isToday(date))) return "HIGH";
  
  const diff = differenceInDays(date, new Date());
  if (diff <= 7) return "MEDIUM";
  
  return "LOW";
}

function getPriorityScore(p: Priority) {
  if (p === "HIGH") return 3;
  if (p === "MEDIUM") return 2;
  return 1;
}

type FilterType = "ALL" | "HIGH" | "MEDIUM" | "LOW" | "COMPLETED";

export default function App() {
  const { tasks, addTask, toggleTaskComplete, deleteTask } = useTasks();
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const tasksWithPriority = useMemo(() => {
    return tasks.map(t => ({
      ...t,
      priority: getTaskPriority(t.deadline)
    }));
  }, [tasks]);

  const stats = useMemo(() => {
    let high = 0;
    let dueToday = 0;
    let completed = 0;

    tasksWithPriority.forEach(t => {
      if (t.completed) completed++;
      else {
        if (t.priority === "HIGH") high++;
        if (isToday(parseISO(t.deadline))) dueToday++;
      }
    });

    return {
      total: tasks.length,
      highPriority: high,
      dueToday,
      completed
    };
  }, [tasksWithPriority, tasks.length]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasksWithPriority;

    if (filter === "COMPLETED") {
      filtered = filtered.filter(t => t.completed);
    } else if (filter !== "ALL") {
      filtered = filtered.filter(t => !t.completed && t.priority === filter);
    } else {
      // In "ALL" view, don't filter out completed, but they will be sorted to bottom
    }

    return filtered.sort((a, b) => {
      // Completed always at bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      if (a.completed && b.completed) {
        return parseISO(b.deadline).getTime() - parseISO(a.deadline).getTime();
      }

      // Sort by priority first
      const pScoreA = getPriorityScore(a.priority);
      const pScoreB = getPriorityScore(b.priority);
      
      if (pScoreA !== pScoreB) {
        return pScoreB - pScoreA; // Higher score first
      }

      // Then by deadline date
      return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime();
    });
  }, [tasksWithPriority, filter]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <CheckCircle2 className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              TaskSaver AI
            </h1>
          </div>
          <p className="text-muted-foreground pl-13 text-lg">Your intelligent focus companion.</p>
        </header>

        <div className="mb-8">
          <MotivationalBanner />
        </div>

        <StatsBar {...stats} />

        <AddTaskForm onAdd={addTask} />

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="w-full md:w-auto">
            <TabsList className="bg-card border border-border/50 h-auto p-1 w-full md:w-auto flex-wrap justify-start">
              <TabsTrigger value="ALL" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-1.5 px-3">All</TabsTrigger>
              <TabsTrigger value="HIGH" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground py-1.5 px-3">High</TabsTrigger>
              <TabsTrigger value="MEDIUM" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white py-1.5 px-3">Medium</TabsTrigger>
              <TabsTrigger value="LOW" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white py-1.5 px-3">Low</TabsTrigger>
              <TabsTrigger value="COMPLETED" className="data-[state=active]:bg-muted data-[state=active]:text-foreground py-1.5 px-3">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-16 px-4 bg-card/30 border border-border/40 rounded-xl border-dashed">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  {filter === "ALL" 
                    ? "You have a clear slate. Add a task above to get started." 
                    : `No tasks matching the '${filter}' filter.`}
                </p>
              </div>
            ) : (
              filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  priority={task.priority}
                  onToggle={toggleTaskComplete}
                  onDelete={deleteTask}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
