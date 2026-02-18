import { useState } from "react";
import { useRef } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
// import type { DocumentCategory } from "@/lib/mock-data";
import { uploadDocument } from "@/lib/api";
// const categories: DocumentCategory[] = ["Policy", "Report", "Contract", "Invoice", "Memo", "Circular", "Technical", "HR"];

export function DocumentUploadDialog({
    onUploadSuccess,
  }: {
    onUploadSuccess?: () => void;
  }) {

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Upload Document</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4 mt-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!file) {
              alert("No file selected");
              return;
            }
            try {
              setLoading(true);
              // const formData = new FormData();
              // formData.append("file", file);
              // formData.append("name", name);
              // formData.append("category", category);
              // formData.append("tags", tags);
              // formData.append("description", description);
              await uploadDocument(file, name, category, tags, description);

              onUploadSuccess?.();

              alert("Upload success");
              setOpen(false);

            } catch (err) {
              console.error(err);
              alert("Upload failed");
            } finally {
              setLoading(false);
            }
          }}
        >
         <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            {/* Upload Icon */}
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />

            {/* File Display */}
            {file ? (
              <p className="text-sm font-medium text-primary">
                Selected: {file.name}
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or{" "}
                  <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, XLSX up to 25MB
                </p>
              </>
            )}

            {/* Hidden Input */}
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
{/* 
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input
                placeholder="Enter document name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Add tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of the document"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Uploading..." : "Upload"}
          </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
