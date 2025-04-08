import { type BaseProps } from "~/constants/interfaces";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { FileIcon } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  _source: {
    content: string;
    key: string;
  };
  highlight?: {
    content: string[];
  };
}

interface FileMetadata {
  workspaceName: string;
  folderName?: string;
  type: string;
  name: string;
  id: string;
}

interface SearchCardProps extends BaseProps {
  result: SearchResult;
}

const SearchCard: React.FC<SearchCardProps> = ({ className, result }) => {
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const highlights = result.highlight?.content ?? [result._source.content];
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  const { data: fileData } = api.file.getFileByFileId.useQuery(
    { fileId: result._source.key },
    { enabled: !!result._source.key }
  );

  useEffect(() => {
    if (fileData?.workspaceName) {
      setMetadata({
        workspaceName: fileData.workspaceName,
        folderName: fileData.folderName ?? undefined,
        type: fileData.type,
        name: fileData.name,
        id: fileData.id
      });
    }
  }, [fileData]);

  const handlePrevious = () => {
    setCurrentHighlightIndex((prev) =>
      prev > 0 ? prev - 1 : highlights.length - 1
    );
  };

  const handleNext = () => {
    setCurrentHighlightIndex((prev) =>
      prev < highlights.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className={`flex flex-col w-[320px] min-h-[200px] bg-white rounded-lg shadow-sm border ${className}`}>
      <Link href={`/file/${metadata?.id}`}>
        {metadata && (
          <div className="p-3 border-b bg-gray-50 rounded-t-lg flex items-start gap-2">
            <div className="p-1.5 bg-white rounded border">
              <FileIcon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" title={metadata.name}>
                {metadata.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{metadata.type === "pdf" ? "PDF" : "DOCX"}</span>
                {metadata.folderName && (
                  <>
                    <span>•</span>
                    <span className="truncate">{metadata.folderName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="flex-grow p-3">
        <div className="prose prose-sm max-w-none">
          <p
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: highlights[currentHighlightIndex]?.replace(
                /<strong>/g,
                '<strong class="bg-yellow-100 text-gray-900 font-semibold px-1 rounded">'
              ) ?? ""
            }}
          />
        </div>
      </div>

      {highlights.length > 1 && (
        <div className="px-3 py-2 border-t bg-gray-50 rounded-b-lg flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium text-gray-600">
            {currentHighlightIndex + 1} of {highlights.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchCard; 