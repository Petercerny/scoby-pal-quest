import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { BatchesPage } from "@/components/BatchesPage";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'batches':
        return <BatchesPage />;
      case 'quests':
        return (
          <div className="min-h-screen bg-background p-4 pb-24">
            <div className="text-center pt-20">
              <h1 className="text-2xl font-bold mb-4">All Quests</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="min-h-screen bg-background p-4 pb-24">
            <div className="text-center pt-20">
              <h1 className="text-2xl font-bold mb-4">Troubleshooting Library</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-background p-4 pb-24">
            <div className="text-center pt-20">
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
};

export default Index;
