import { type BaseProps } from "~/constants/interfaces";
import SearchCarousel from "./search/search-carousel";

const SearchViewer: React.FC<BaseProps> = ({ className }) => {
  return (
    <div className={`flex flex-col gap-8 overflow-y-auto pr-2 rounded-[8px] h-full ${className}`}>
      <div className="flex flex-col gap-2">
        <h2 className="text-[42px] font-bold">Search Results</h2>
        <p className="text-gray-600">Browse through relevant results below.</p>
      </div>

      <div className="flex flex-col gap-12">
        <SearchCarousel title="Recent Searches" />
        <SearchCarousel title="Popular Results" />
      </div>
    </div>
  );
};

export default SearchViewer; 