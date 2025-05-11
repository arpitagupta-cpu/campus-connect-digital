import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Todo, insertTodoSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TodoList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newTask, setNewTask] = useState("");

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
    enabled: !!user,
  });

  // Create new todo
  const createTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const todoData = {
        userId: user!.id,
        text,
        completed: false,
        createdAt: new Date(),
      };

      const res = await apiRequest("POST", "/api/todos", todoData);
      return res.json();
    },
    onSuccess: () => {
      setNewTask("");
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Task added",
        description: "Your new task has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PUT", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete todo
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    createTodoMutation.mutate(newTask);
  };

  const handleToggleTask = (id: number, completed: boolean) => {
    toggleTodoMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTask = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  const handleClearCompleted = () => {
    todos?.forEach((todo) => {
      if (todo.completed) {
        deleteTodoMutation.mutate(todo.id);
      }
    });
  };

  const remainingTasks = todos?.filter((todo) => !todo.completed).length || 0;
  const hasCompletedTasks = todos?.some((todo) => todo.completed) || false;

  return (
    <Card>
      <CardHeader className="border-b p-6">
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="rounded-r-none"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              disabled={createTodoMutation.isPending}
            />
            <Button
              type="submit"
              className="rounded-l-none"
              onClick={handleAddTask}
              disabled={!newTask.trim() || createTodoMutation.isPending}
            >
              {createTodoMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-64">
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-center py-6 text-muted-foreground">Loading tasks...</p>
            ) : todos && todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center p-2 rounded-lg hover:bg-muted group transition-colors"
                >
                  <Checkbox
                    id={`task-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTask(todo.id, todo.completed)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`task-${todo.id}`}
                    className={`flex-1 text-sm ${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground">No tasks yet. Add one above!</p>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>{remainingTasks} tasks remaining</span>
          {hasCompletedTasks && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={handleClearCompleted}
            >
              Clear completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
