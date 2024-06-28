import Dialog from "@mui/material/Dialog";

type AddStoryDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
};

export default function AddStoryDialog({
  open,
  onClose,
  userId,
}: AddStoryDialogProps) {
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <div>userId: {userId}</div>
    </Dialog>
  );
}
