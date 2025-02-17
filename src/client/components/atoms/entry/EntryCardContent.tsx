import markdownit from "markdown-it";

import { getTagColor } from "../../../../common/constants/tag.cons";
import { extractTagsFromBody } from "../../../../common/modules/tag/extractTagsFromBody";
import { TagType } from "../../../../common/types";
import useTagStore from "../../../store/tag/tagStore";

const md: any = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

export default function EntryCardContent(props: {
  divRef: React.RefObject<HTMLDivElement>;
  body: string;
}) {
  const tagStore = useTagStore();

  function renderMarkdown(body: string) {
    const bodyWithTagStyles = addStylesToTags(body, tagStore.tags);
    const bodyWithCheckBoxes = addCheckBoxes(bodyWithTagStyles);
    return md.render(bodyWithCheckBoxes);
  }

  return (
    <div className="" ref={props.divRef}>
      <div className="h-3" />

      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(props.body) }}
      ></div>
    </div>
  );
}

/**
 * Helper functions
 */

function addStylesToTags(body: string, allTags: TagType[]) {
  let bodyWithStyles = body;

  // extract tags from body
  const tagNames = extractTagsFromBody(body);
  if (!tagNames) {
    return body;
  }

  // add styles to tags
  tagNames.forEach((tag) => {
    const tagColor = allTags.find((t) => {
      return t.text.toLowerCase() === tag.toLowerCase();
    });

    if (tagColor) {
      const color = getTagColor(tagColor.color);

      bodyWithStyles = bodyWithStyles.replace(
        `#${tag}`,
        `<span class="clickable clickable-tag" data=${tag} style="color: ${color}; background-color: ${color}1c; background-opacity: 0.1; text-decoration:none; font-weight: 500; font-size: 14px; padding: 3px 5px; border-radius: 0.3rem;" href="https://papery.me/s/#${tag}">#${tag}</span>`
      );
    }
  });

  return bodyWithStyles;
}

function addCheckBoxes(body: string) {
  let bodyWithCheckBoxes = body;

  // for each line, add checkbox
  bodyWithCheckBoxes = bodyWithCheckBoxes
    .split("\n")
    .map((line) => {
      const lineWithCheckBox = addCheckBoxToLine(line);
      return lineWithCheckBox;
    })
    .join("\n");

  return bodyWithCheckBoxes;
}

function addCheckBoxToLine(line: string) {
  // if line is empty, return empty string
  if (line.trim() === "") return "";

  const checkedRegex = /\[[x|-]\]/g;
  const uncheckedRegex = /\[\s?\]/g;

  if (line.match(checkedRegex)) {
    return `<div class="line-through decoration-[#b5b2ad91] text-[#949289]">
        ${line.replace(
          checkedRegex,
          `<input type="checkbox" checked class="mr-0.5 h-4 w-4 pointer-events-none" />`
        )}
      </div>`;
  }

  if (line.match(uncheckedRegex)) {
    return `<div>
        ${line.replace(
          uncheckedRegex,
          `<input type="checkbox" class="mr-0.5 h-4 w-4 pointer-events-none" />`
        )}
      </div>`;
  }

  return line;
}
