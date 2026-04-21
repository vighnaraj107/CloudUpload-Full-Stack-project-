import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileCard from "./FileCard";

const API_BASE = "http://16.171.112.244:3000";

interface FileItem {
  name: string;
  url: string;
}

interface FileListProps {
  refreshKey: number;
}

const FileList = ({ refreshKey }: FileListProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ ADD THIS FUNCTION (IMPORTANT FIX)
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/files`, {
        method: "GET",
        mode: "cors",
      });
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ DELETE FUNCTION (FIXED API PATH)
  const deleteFile = async (fileName: string) => {
  try {
    const res = await fetch(
      `${API_BASE}/delete/${encodeURIComponent(fileName)}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Failed");

    fetchFiles();
  } catch (error) {
    setError("Could not delete file. Please try again.");
  }
};

  // ✅ FIXED useEffect
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Files</h2>
        <Button variant="ghost" size="sm" onClick={fetchFiles} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive text-center py-6">{error}</p>
      )}

      {!error && !loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {files.length === 0
              ? "No files uploaded yet"
              : "No files match your search"}
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((file) => (
          <FileCard
            key={file.name}
            name={file.name}
            url={file.url}
            onDelete={deleteFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;