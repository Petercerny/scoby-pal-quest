import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { BatchesPage } from "@/components/BatchesPage";
import { QuestsPage } from "@/components/QuestsPage";
import { Settings } from "@/components/Settings";
import { LibraryPage } from "@/components/LibraryPage";
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
        return <QuestsPage />;
      case 'library':
        return <LibraryPage />;
      case 'settings':
        return <Settings />;
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
