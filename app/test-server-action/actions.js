"use server";

export async function getMessage() {
  const message = "Hello from the server!";
  return { message };
}
