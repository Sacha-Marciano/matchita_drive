import { docs_v1 } from "@googleapis/docs";

export const extractTextFromGoogleDoc = (doc: docs_v1.Schema$Document): string => {
    let text = "";
  
    const content = doc.body?.content || [];
    for (const element of content) {
      if (element.paragraph?.elements) {
        for (const part of element.paragraph.elements) {
          text += part.textRun?.content || "";
        }
        text += "\n";
      }
  
      if (element.table?.tableRows) {
        for (const row of element.table.tableRows) {
          for (const cell of row.tableCells || []) {
            const cellText = (cell.content || [])
              .map((el) =>
                el.paragraph?.elements
                  ?.map((p) => p.textRun?.content || "")
                  .join("") || ""
              )
              .join(" ");
            text += `| ${cellText} `;
          }
          text += "|\n";
        }
      }
    }
  
    return text.trim();
  };
  