'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, Tag, Clock } from 'lucide-react';

const Stats = ({ contacts }) => {
  const totalContacts = contacts.length;
  const uniqueCategories = new Set(
    contacts.flatMap((contact) => contact.categories || [])
  ).size;
  const newestContact = contacts.length > 0 
    ? [...contacts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="p-4 flex items-center gap-4 shadow-md rounded-lg dark:bg-gray-800">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-lg font-medium">{totalContacts}</p>
            <p className="text-sm text-gray-500">Total Contacts</p>
          </div>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="p-4 flex items-center gap-4 shadow-md rounded-lg dark:bg-gray-800">
          <Tag className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-lg font-medium">{uniqueCategories}</p>
            <p className="text-sm text-gray-500">Unique Categories</p>
          </div>
        </Card>
      </motion.div>

      {newestContact && (
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="p-4 flex items-center gap-4 shadow-md rounded-lg dark:bg-gray-800">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-lg font-medium">{newestContact.name}</p>
              <p className="text-sm text-gray-500">Newest Contact</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Stats;