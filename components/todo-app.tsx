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

  const remaining = initialTodos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          To Do List
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {remaining === 0 && initialTodos.length > 0
            ? "All done — nice work!"
            : `${remaining} item${remaining === 1 ? "" : "s"} left`}
        </p>
      </header>

      <form
        ref={formRef}
        action={handleCreate}
        className="flex gap-2"
      >
        <input
          name="title"
          type="text"
          placeholder="What needs to be done?"
          autoComplete="off"
          disabled={isPending}
          className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-violet-500/0 transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-violet-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {initialTodos.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No todos yet. Add one above.
          </li>
        ) : (
          initialTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                disabled={isPending}
                onChange={(e) => handleToggle(todo.id, e.target.checked)}
                className="size-4 shrink-0 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600"
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
                disabled={isPending}
                onClick={() => handleDelete(todo.id)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
