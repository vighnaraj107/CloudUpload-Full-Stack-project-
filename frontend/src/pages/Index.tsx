import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import Footer from "@/components/Footer";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        <FileUpload onUploadComplete={() => setRefreshKey((k) => k + 1)} />
        <FileList refreshKey={refreshKey} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
