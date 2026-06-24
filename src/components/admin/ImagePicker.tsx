import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/storage";
import { resolveImage } from "@/lib/site-images";

export function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-start gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          {value ? (
            <>
              <img src={resolveImage(value)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-1.5 h-4 w-4" />
              {busy ? "Uploading…" : "Upload from device"}
            </Button>
          </div>
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Paste image URL"
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value || null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
