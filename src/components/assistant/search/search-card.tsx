import { type BaseProps } from "~/constants/interfaces";

const SearchCard: React.FC<BaseProps> = ({ className }) => {
  return (
    <div className={`flex flex-col w-[280px] h-[180px] bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 className="font-medium text-lg">Search Result</h3>
      <p className="text-sm text-gray-600 mt-2">This is a placeholder card for search results. It will contain actual content later.</p>
    </div>
  );
};

export default SearchCard; 