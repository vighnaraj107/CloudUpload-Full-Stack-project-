import { Cloud } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Cloud className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CloudDrop</h1>
        <span className="text-sm text-muted-foreground hidden sm:inline">File Upload & Sharing</span>
      </div>
    </nav>
  );
};

export default Navbar;
