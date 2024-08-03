import { useContext } from 'react';
import { DeleteNote } from '../../wailsjs/go/notes/Service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from './ui/use-toast';
import { Context } from './../store';

export default function AlertDelete() {
    const { toast } = useToast()
    const [state, dispatch] = useContext(Context)

    function deleteNote() {
        const note = state.deletedNote;

        DeleteNote(note.id).then(() => {
            // getNotes();
            dispatch({ type: "SET_DELETE_NOTE", payload: false })
            toast({
              title: "Note " + note.title + " deleted",
              description: "The note has been deleted",
            })
        })
    }

    return (
        <AlertDialog open={state.doDeleteNote}>
            <AlertDialogTrigger asChild>Open</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => dispatch({ type: "SET_DELETE_NOTE", payload: false })}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteNote()}>Yes, delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}