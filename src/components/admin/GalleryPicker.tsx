import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/storage";
import { resolveImage } from "@/lib/site-images";

export function GalleryPicker({
  value,
  onChange,
  label = "Additional images",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const f of files) {
        uploaded.push(await uploadMedia(f));
      }
      onChange([...(value ?? []), ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const v = url.trim();
    if (!v) return;
    onChange([...(value ?? []), v]);
    setUrl("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onFiles}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-1.5 h-4 w-4" />
          {busy ? "Uploading…" : "Upload images"}
        </Button>
        <div className="relative flex-1 min-w-[200px]">
          <LinkIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Or paste image URL and press Add"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
        </div>
        <Button type="button" size="sm" onClick={addUrl}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
      {value?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {value.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
            >
              <img src={resolveImage(src)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
