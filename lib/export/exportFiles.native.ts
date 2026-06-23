import * as FileSystem from "expo-file-system/legacy";
import { Share } from "react-native";

type ExportTextFileParams = {
  content: string;
  fileName: string;
  mimeType: string;
};

export async function exportTextFile({ content, fileName, mimeType }: ExportTextFileParams): Promise<void> {
  const baseDirectory = FileSystem.documentDirectory;

  if (!baseDirectory) {
    throw new Error("File export directory is not available.");
  }

  const fileUri = `${baseDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8
  });

  await Share.share({
    title: fileName,
    message: `${fileName}\n${fileUri}`,
    url: fileUri
  });
}
