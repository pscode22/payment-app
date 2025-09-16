import { ZodError } from "zod";

export const zodErr = (
  err: ZodError<unknown>
): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.length ? issue.path.map(String).join(".") : "_error";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
};
