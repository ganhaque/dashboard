
export const handleTagClick = (tag: string, setFocusedTag: (tag: string) => void, setFocusedProjectName: (name: string) => void) => {
  setFocusedTag(tag);
  setFocusedProjectName('');
}
