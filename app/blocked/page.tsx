const blocked: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
      <p className="text-lg">No contacts found</p>
      <p className="text-sm">Try adding a new contact or adjusting filters.</p>
    </div>
  );
};

export default blocked;
