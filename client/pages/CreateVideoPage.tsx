import { useState } from "react";
import type { CreateVideoSchema } from "@/shared";
import { createVideoSchema } from "@/shared";
import { Button, InputField, TagInput } from "../components";
import { useCreateVideo } from "../hooks";

interface CreateVideoPageProps {
  onBack: () => void;
}
type FormErrors = Partial<Record<keyof CreateVideoSchema, string>>;

const validateForm = (formData: CreateVideoSchema): FormErrors => {
  const parser = createVideoSchema.safeParse(formData);
  const errors: FormErrors = {};

  if (parser.error) {
    parser.error.issues.forEach((err) => {
      const path = err.path[0] as keyof CreateVideoSchema;
      errors[path] = err.message;
    });
  }

  return errors;
};

export const CreateVideoPage = ({ onBack }: CreateVideoPageProps) => {
  const createVideo = useCreateVideo();
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateVideoSchema>({
    title: "",
    duration: 1200, // 20 minutes default
    thumbnail_url: "https://placehold.co/300x200?text=Placeholder",
    tags: [],
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrors(null);
    e.preventDefault();

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const videoData: CreateVideoSchema = {
      title: formData.title.trim(),
      duration: Number(formData.duration),
      thumbnail_url: formData.thumbnail_url,
      tags: formData.tags,
    };

    createVideo.mutate(videoData, {
      onSuccess: () => {
        setFormData({
          title: "",
          duration: 1200,
          thumbnail_url: "https://via.placeholder.com/300x200?text=Placeholder",
          tags: [],
        });
        setTags([]);
        setErrors({});
        onBack();
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start">
        <Button onClick={onBack} variant="ghost" aria-label="Go back to video list">
          ← Back to Videos
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 self-center">Create New Video</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6" noValidate>
        <fieldset className="space-y-6">
          <legend className="sr-only">Video information</legend>

          <InputField
            label="Title *"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            errors={errors?.title}
            placeholder="Enter video title"
            required
            aria-required="true"
          />

          <InputField
            label="Duration (seconds) *"
            value={formData.duration.toString()}
            onChange={(e) => handleInputChange("duration", Number(e.target.value))}
            errors={errors?.duration}
            placeholder="Enter duration in seconds"
            type="number"
            min="1"
            required
            aria-required="true"
          />

          <InputField
            label="Thumbnail URL *"
            value={formData.thumbnail_url}
            onChange={(e) => handleInputChange("thumbnail_url", e.target.value)}
            errors={errors?.thumbnail_url}
            placeholder="Enter thumbnail URL"
            type="url"
            required
            aria-required="true"
          />

          <TagInput tags={tags} setTags={setTags} />
        </fieldset>

        <Button
          type="submit"
          disabled={createVideo.isPending}
          aria-describedby={createVideo.error ? "submit-error" : undefined}
        >
          {createVideo.isPending ? "Creating..." : "Create Video"}
        </Button>

        {createVideo.error && (
          <div
            id="submit-error"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
            role="alert"
            aria-live="polite"
          >
            {createVideo.error.message}
          </div>
        )}

        {errors && Object.keys(errors).length > 0 && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
            role="alert"
            aria-live="polite"
          >
            <h3 className="font-medium mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <span className="capitalize">{field}</span>: {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};
