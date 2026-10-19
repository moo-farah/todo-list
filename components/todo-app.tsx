"use client";

import { createTodo, deleteTodo, toggleTodo } from "@/app/actions";
import type { Todo } from "@/db/schema";
import confetti from "canvas-confetti";
import { useRef, useTransition } from "react";

function celebrate() {
  void confetti({
    particleCount: 70,
    spread: 55,
    origin: { y: 0.65 },
    ticks: 100,
    scalar: 0.9,
  });
}

type TodoAppProps = {
  initialTodos: Todo[];
};

function TodoItem({
  todo,
  disabled,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  disabled: boolean;
  onToggle: (id: number, nextCompleted: boolean) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={todo.completed}
        disabled={disabled}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
        className="size-4 shrink-0 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
      />
      <span
        className={`min-w-0 flex-1 text-sm ${
          todo.completed
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-800 dark:text-zinc-100"
        }`}
      >
        {todo.title}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(todo.id)}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        Delete
      </button>
    </li>
  );
}

export function TodoApp({ initialTodos }: TodoAppProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createTodo(formData);
      formRef.current?.reset();
    });
  }

  function handleToggle(id: number, nextCompleted: boolean) {
    startTransition(async () => {
      const completed = await toggleTodo(id, nextCompleted);
      if (completed) celebrate();
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteTodo(id);
    });
  }


  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-950">
    <main className="flex w-full max-w-lg flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Todos
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          A simple todo list powered by Neon &amp; Drizzle
        </p>
      </div>

      <form ref={formRef} action={handleCreate} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="What needs to be done?"
          required
          autoComplete="off"
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
        >
          Add
        </button>
      </form>

      {initialTodos.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No todos yet. Add one above to get started.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {initialTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              disabled={isPending}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  </div>
  );
}
