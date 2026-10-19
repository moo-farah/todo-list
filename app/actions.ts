"use server";

import { db } from "@/db";
import { todos, type Todo } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos(): Promise<Todo[]> {
  return db.select().from(todos).orderBy(desc(todos.createdAt));
}

export async function createTodo(formData: FormData): Promise<void> {
  const title = formData.get("title")?.toString().trim();
  if (!title) return;

  await db.insert(todos).values({ title });
  revalidatePath("/");
}

export async function deleteTodo(id: number): Promise<void> {
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath("/");
}

export async function toggleTodo(
  id: number,
  completed: boolean,
): Promise<boolean> {
  const [updated] = await db
    .update(todos)
    .set({ completed })
    .where(eq(todos.id, id))
    .returning({ completed: todos.completed });

  revalidatePath("/");
  return updated?.completed ?? false;
}
