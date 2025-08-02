import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TagInput } from "../TagInput";

describe("TagInput", () => {
  const defaultProps = {
    tags: [],
    setTags: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders tag input", () => {
    // Prepare
    const props = { ...defaultProps };

    // Act
    render(<TagInput {...props} />);

    // Assert
    expect(screen.getByLabelText("Tags (optional)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter a tag and press Enter")).toBeInTheDocument();
    expect(screen.getByText("Press Enter to add a tag")).toBeInTheDocument();
  });

  it("renders existing tags", () => {
    // Prepare
    const tags = ["react", "typescript"];
    const props = { tags, setTags: defaultProps.setTags };

    // Act
    render(<TagInput {...props} />);

    // Assert
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("adds a new tag when pressing Enter", () => {
    // Prepare
    const setTags = vi.fn();
    const props = { tags: [], setTags };

    // Act
    render(<TagInput {...props} />);
    const input = screen.getByLabelText("Tags (optional)");
    fireEvent.change(input, { target: { value: "new-tag" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Assert
    expect(setTags).toHaveBeenCalledWith(["new-tag"]);
  });

  it("adds tag to existing tags", () => {
    // Prepare
    const setTags = vi.fn();
    const props = { tags: ["existing"], setTags };

    // Act
    render(<TagInput {...props} />);
    const input = screen.getByLabelText("Tags (optional)");
    fireEvent.change(input, { target: { value: "new-tag" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Assert
    expect(setTags).toHaveBeenCalledWith(["existing", "new-tag"]);
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("trims whitespace from tag input", () => {
    // Prepare
    const setTags = vi.fn();
    const props = { tags: [], setTags };

    // Act
    render(<TagInput {...props} />);
    const input = screen.getByLabelText("Tags (optional)");
    fireEvent.change(input, { target: { value: "  trimmed-tag  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Assert
    expect(setTags).toHaveBeenCalledWith(["trimmed-tag"]);
  });

  it("does not add empty or duplicate tags", () => {
    // Prepare
    const setTags = vi.fn();
    const props = { tags: ["existing-tag"], setTags };

    // Act
    render(<TagInput {...props} />);
    const input = screen.getByLabelText("Tags (optional)");

    // Attempt to add empty tag
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Attempt to add duplicate tag
    fireEvent.change(input, { target: { value: "existing-tag" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Assert
    expect(setTags).not.toHaveBeenCalled();
  });

  it("removes tag when remove button is clicked", () => {
    // Prepare
    const setTags = vi.fn();
    const tags = ["react", "typescript", "testing"];
    const props = { tags, setTags };

    // Act
    render(<TagInput {...props} />);
    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    // Assert
    expect(setTags).toHaveBeenCalledWith(["typescript", "testing"]);
  });

  it("has proper accessibility attributes", () => {
    // Prepare
    const tags = ["test-tag"];
    const props = { tags, setTags: defaultProps.setTags };

    // Act
    render(<TagInput {...props} />);

    // Assert
    const input = screen.getByLabelText("Tags (optional)");
    const removeButton = screen.getByRole("button");

    expect(input).toHaveAttribute("aria-describedby");
    expect(removeButton).toHaveAttribute("aria-label", "Remove tag test-tag");
    expect(removeButton).toHaveAttribute("title", "Remove tag test-tag");
  });
});
