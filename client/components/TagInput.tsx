import { useState } from "react";
import { BaseButton } from "./BaseButton";
import { InputField } from "./InputField";

export const TagInput = ({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <InputField
        label="Tags (optional)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Enter a tag and press Enter"
        onKeyDown={handleTagInputKeyPress}
        aria-describedby="tag-instructions"
      />
      <p id="tag-instructions" className="text-sm text-gray-500">
        Press Enter to add a tag
      </p>

      {tags && tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-3" aria-label="Video tags">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              <span>{tag}</span>
              <BaseButton
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={`Remove tag ${tag}`}
                title={`Remove tag ${tag}`}
              >
                <span aria-hidden="true">×</span>
              </BaseButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
