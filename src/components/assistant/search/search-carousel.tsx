"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type BaseProps } from "~/constants/interfaces";
import { Button } from "../../ui/button";
import SearchCard from "./search-card";
import { useRef, useState } from "react";

interface SearchCarouselProps extends BaseProps {
  title: string;
}

const SearchCarousel: React.FC<SearchCarouselProps> = ({ className, title }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  // Placeholder cards
  const cards = Array(5).fill(null);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="relative">
        {showLeftButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-1"
          onScroll={handleScroll}
        >
          {cards.map((_, index) => (
            <SearchCard key={index} className="flex-shrink-0" />
          ))}
        </div>

        {showRightButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchCarousel; 