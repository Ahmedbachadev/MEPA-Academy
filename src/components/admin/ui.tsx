import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AdminHeading({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function useSaver() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  async function save(fn: () => Promise<{ error: unknown } | { error: null } | { error?: unknown }>, queryKey: readonly unknown[], msg = "Saved") {
    setSaving(true);
    try {
      const res = await fn();
      if (res && "error" in res && res.error) throw res.error;
      await qc.invalidateQueries({ queryKey });
      toast.success(msg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  return { saving, save };
}

export function SaveButton({ saving }: { saving: boolean }) {
  return <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>;
}
