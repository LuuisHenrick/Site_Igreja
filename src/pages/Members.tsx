import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { MemberList } from '../components/members/MemberList';
import { MemberCard } from '../components/members/MemberCard';
import { BirthdayList } from '../components/members/BirthdayList';
import { MemberReports } from '../components/members/MemberReports';

export const Members: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const store = useStore();
  const members = store.members || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Members List</TabsTrigger>
          <TabsTrigger value="card">Member Card</TabsTrigger>
          <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <MemberList
            members={members}
            onSelectMember={setSelectedMember}
          />
        </TabsContent>

        <TabsContent value="card">
          {selectedMember ? (
            <MemberCard
              member={members.find(m => m.id === selectedMember)!}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Select a member to view their card</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="birthdays">
          <BirthdayList members={members} />
        </TabsContent>

        <TabsContent value="reports">
          <MemberReports members={members} />
        </TabsContent>
      </Tabs>
    </div>
  );
};