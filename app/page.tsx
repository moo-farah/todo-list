import { TodoApp } from "@/components/todo-app";
import { getTodos } from "./actions";
import { Suspense } from "react";

async function TodoList() {
  const todos = await getTodos();
  return <TodoApp initialTodos={todos} />;
}

function TodoListFallback() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 animate-pulse">
      <div className="mx-auto h-8 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 items-start justify-center bg-gradient-to-b from-violet-50/80 to-zinc-50 px-4 py-16 dark:from-violet-950/20 dark:to-black">
      <Suspense fallback={<TodoListFallback />}>
        <TodoList />
      </Suspense>
    </div>
  );
}
