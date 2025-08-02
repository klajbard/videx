import { useState } from "react";
import { BaseButton } from "./components";
import { CreateVideoPage, type Page, VideoListPage } from "./pages";

export const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>("list");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-700 shadow-sm border-b sticky top-0 z-10 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">
              <BaseButton onClick={() => setCurrentPage("list")} aria-label="Go to video list">
                Video Manager
              </BaseButton>
            </h1>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" tabIndex={-1}>
        {currentPage === "list" && <VideoListPage onAddVideo={() => setCurrentPage("create")} />}
        {currentPage === "create" && <CreateVideoPage onBack={() => setCurrentPage("list")} />}
      </main>
    </div>
  );
};
