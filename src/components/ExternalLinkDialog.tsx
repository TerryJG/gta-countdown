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
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

type ExternalLinkDialogProps = {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ExternalLinkDialog = ({ isOpen, url, onConfirm, onCancel }: ExternalLinkDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-black/80 border-gray-700 text-white">
        <AlertDialogHeader className="gap-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-500 text-xl" />
            <AlertDialogTitle className="text-rose-500">External Link Navigation</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-200">
            <p>You are about to navigate to an external website:</p>
            <p className="my-2 rounded bg-zinc-900/50 p-2 font-mono break-all text-white">{url}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-800 text-white border-gray-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExternalLinkDialog; 