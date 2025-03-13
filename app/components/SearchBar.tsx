'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { XCircle, Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <motion.div 
      className="relative w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search contacts by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 py-2 text-gray-900 dark:text-white dark:bg-gray-800 rounded-lg"
        />
        {searchTerm && (
          <XCircle 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 cursor-pointer"
            size={18} 
            onClick={() => setSearchTerm('')} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;