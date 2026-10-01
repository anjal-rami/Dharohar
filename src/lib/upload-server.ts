import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";

export const uploadMediaFile = createServerFn({ method: "POST" })
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid upload payload");
    }
    return formData;
  })
  .handler(async ({ data: formData }) => {
    try {
      const file = formData.get("file") as File | null;
      if (!file) {
        return { success: false, error: "No file received" };
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 1. Create Base64 Data URI for immediate, rock-solid UI display
      const mimeType = file.type || "image/jpeg";
      const base64Data = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      // 2. Also save to public/uploads on disk for persistence
      const ext = path.extname(file.name) || ".jpg";
      const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueFileName = `${Date.now()}-${cleanBaseName}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, uniqueFileName), buffer);
      } catch (err) {
        console.warn("Could not write to disk, using dataUri fallback:", err);
      }

      return {
        success: true,
        // dataUri is guaranteed to render in the browser immediately
        fileUrl: dataUri,
        fileName: file.name,
      };
    } catch (err: unknown) {
      console.error("File upload error:", err);
      const message = err instanceof Error ? err.message : "File upload failed";
      return { success: false, error: message };
    }
  });
