import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentSession } from "@/lib/authz";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Sans ce controle, la route accepte les uploads de n'importe qui sur
      // Internet et remplit le quota UploadThing du projet.
      const session = await getCurrentSession();

      if (!session?.user?.id) {
        throw new UploadThingError("Unauthorized");
      }

      // Renvoye a `onUploadComplete` via `metadata`.
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
