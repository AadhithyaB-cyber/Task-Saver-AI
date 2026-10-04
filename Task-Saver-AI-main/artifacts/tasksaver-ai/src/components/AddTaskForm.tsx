import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional().default(""),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormValues = z.infer<typeof schema>;

interface AddTaskFormProps {
  onAdd: (data: { title: string; description: string; deadline: string }) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      deadline: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (data: FormValues) => {
    onAdd({
      title: data.title,
      description: data.description || "",
      deadline: data.deadline,
    });
    form.reset({
      title: "",
      description: "",
      deadline: format(new Date(), "yyyy-MM-dd"),
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Task</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What needs to be done?" {...field} data-testid="input-task-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-task-deadline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add details..." 
                    className="resize-none h-20" 
                    {...field} 
                    data-testid="input-task-desc"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="w-full md:w-auto gap-2" data-testid="btn-add-task">
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
