import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type ExternalLinkDialogProps = {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Alert({ isOpen, url, onConfirm, onCancel }: ExternalLinkDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl text-rose-500" />
            <AlertDialogTitle className="text-rose-500 select-none">Hey, Listen...</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-200">
            <p className="select-none">You are about to navigate to an external website:</p>
            <p className="">{url}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel onClick={onCancel} className="mt-2 select-none sm:mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="select-none">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
