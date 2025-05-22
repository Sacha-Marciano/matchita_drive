export function extractTextFromGoogleDoc(doc: any): string {
    let text = ""
    for (const element of doc.body.content || []) {
      if (element.paragraph) {
        const parts = element.paragraph.elements || []
        for (const part of parts) {
          text += part.textRun?.content || ""
        }
        text += "\n"
      }
      if (element.table) {
        for (const row of element.table.tableRows) {
          for (const cell of row.tableCells) {
            const cellText = cell.content
              .map((el: any) => el.paragraph?.elements?.map((p: any) => p.textRun?.content || "").join("") || "")
              .join(" ")
            text += `| ${cellText} `
          }
          text += "|\n"
        }
      }
    }
    return text.trim()
  }