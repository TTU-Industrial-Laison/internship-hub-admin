interface MinimalItem {
  id: string;
  name: string;
}

export interface DeleteConfirmationDialogProps {
  data: MinimalItem;
  children: React.ReactNode;
  onCloseDialog?: () => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isSuccess?: boolean;
  title?: string;
  description?: string;
}
