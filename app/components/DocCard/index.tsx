import { formatDistanceToNow } from "date-fns";
import Button from "../ui/Button";

interface DocCardProps {
  title: string;
  googleDocsUrl: string;
  folder: string;
  tags: string[];
  createdAt: Date;
}

export default function DocCard({
  title,
  googleDocsUrl,
  folder,
  tags,
  createdAt,
}: DocCardProps) {

  return (
    <div className="border flex flex-col justify-between max-w-[447px] max-h-[360px] p-5 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt space-y-4 text-matchita-text-alt">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-xl font-semibold text-matchita-text-alt">
          {title}
        </h3>
        <span className="text-sm text-matchita-500">
          🗂️ Folder: <span className="font-medium">{folder || "Unsorted"}</span>
        </span>
        <span className="text-sm text-matchita-500">
          🕒 Created {formatDistanceToNow(new Date(createdAt))} ago
        </span>
      </div>

      {/* Tags */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}

        </div>
      ) : (
        <div className="text-xs text-matchita-400">No tags</div>
      )}

      {/* Action Button */}
      <Button size="lg" onClick={() => window.open(googleDocsUrl, "_blank")}>
        Open Document
      </Button>
    </div>
  );
}
