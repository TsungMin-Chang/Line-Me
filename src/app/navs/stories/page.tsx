"use client";

import StoryBolck from "./_components/StoryBlock";

function StoriesPage() {
  return (
    <>
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <StoryBolck key={i} />
        ))}
    </>
  );
}
export default StoriesPage;
