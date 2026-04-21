import { useState } from "react";
import { ExternalLink, Copy, Check, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  name: string;
  url: string;
  onDelete: (fileName: string) => void;
}

const FileCard = ({ name, url, onDelete }: FileCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" title={name}>{name}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open
              </a>
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={copyLink}>
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Link
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => onDelete(name)}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
