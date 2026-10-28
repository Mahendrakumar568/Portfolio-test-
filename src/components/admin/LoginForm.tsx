"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";

export const LoginForm = () => {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-10 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-md border border-ink/20 bg-white/60 px-4 py-3 outline-none focus:border-ink"
        />
      </label>
      {state.message && (
        <p role="alert" className="text-sm text-rising">
          {state.message}
        </p>
      )}
      <button disabled={pending} className="w-full rounded-full bg-ink py-3 text-paper transition-colors hover:bg-rising disabled:opacity-60">
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
};
