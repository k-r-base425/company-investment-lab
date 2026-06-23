type ExportTextFileParams = {
  content: string;
  fileName: string;
  mimeType: string;
};

export async function exportTextFile({ content, fileName, mimeType }: ExportTextFileParams): Promise<void> {
  if (typeof document === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined") {
    throw new Error("File export is not available in this environment.");
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  try {
    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}
