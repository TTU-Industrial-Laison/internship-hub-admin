"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/common/image-upload";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/auth-slice";
import { Loader } from "lucide-react";
import { useUploadProfileImage } from "@/lib/hooks/mutations/use-profile";

interface ProfileImageDialogProps {
  children: React.ReactNode;
}

export function ProfileImageDialog({
  children,
}: Readonly<ProfileImageDialogProps>) {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<FileList | undefined>(undefined);
  const user = useAppSelector(selectCurrentUser);

  const { mutate: uploadImage, isPending } = useUploadProfileImage({
    onSuccess: () => {
      setOpen(false);
      setFileList(undefined);
    },
  });

  const handleUpload = () => {
    if (fileList && fileList.length > 0) {
      uploadImage(fileList[0]);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFileList(undefined); // Reset on close
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new picture to update your profile avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ImageUpload
            onChange={setFileList}
            value={fileList}
            disabled={isPending}
            existingImageUrl={user?.avatarUrl}
            variant="card"
          />
        </div>

        <DialogFooter className="gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="flex-1 border border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!fileList || fileList.length === 0 || isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                Uploading
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
