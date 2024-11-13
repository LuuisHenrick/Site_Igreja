import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { GroupList } from '../components/groups/GroupList';
import { GroupDetails } from '../components/groups/GroupDetails';
import { GroupReports } from '../components/groups/GroupReports';
import { useStore } from '../lib/store';

export const Groups: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const store = useStore();
  const groups = store.groups || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Groups List</TabsTrigger>
          <TabsTrigger value="details">Group Details</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <GroupList
            groups={groups}
            onSelectGroup={setSelectedGroup}
          />
        </TabsContent>

        <TabsContent value="details">
          {selectedGroup ? (
            <GroupDetails
              group={groups.find(g => g.id === selectedGroup)!}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a group to view details</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <GroupReports groups={groups} />
        </TabsContent>
      </Tabs>
    </div>
  );
};