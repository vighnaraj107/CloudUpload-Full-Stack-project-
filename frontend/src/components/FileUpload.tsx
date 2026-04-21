import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const API_BASE = "https://cloudupload-full-stack-project.onrender.com";

interface FileUploadProps {
  onUploadComplete: () => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setStatus("idle");
    setMessage("");
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("error");
      setMessage("You must be logged in to upload files.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatus("idle");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const xhr = new XMLHttpRequest();
      
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", `${API_BASE}/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });

      setStatus("success");
      setMessage("File uploaded successfully!");
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploadComplete();
    } catch {
      setStatus("error");
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setStatus("idle");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Upload a File</h2>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${dragActive ? "dropzone-active border-primary" : "border-border hover:border-primary/40 hover:bg-muted/50"}
        `}
      >
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop a file here, or <span className="text-primary font-medium">browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          aria-label="Select file to upload"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between bg-muted rounded-lg px-4 py-3">
          <span className="text-sm font-medium truncate mr-2">{selectedFile.name}</span>
          <button onClick={clearFile} className="text-muted-foreground hover:text-foreground transition-colors" title="Remove file">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading... {progress}%</span>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="mt-4 w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </>
        )}
      </Button>
    </div>
  );
};

export default FileUpload;
