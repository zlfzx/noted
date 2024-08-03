import { useContext, useEffect, useState } from 'react';
import { DeleteNote, GetNotes } from "../wailsjs/go/notes/Service";
import Layout from './components/layout';
import { Link } from 'react-router-dom';
import { buttonVariants } from './components/ui/button';
import CardNote from './components/note';
import { useToast } from './components/ui/use-toast';
import { Context } from './store';
import AlertDelete from './components/alert_delete';

function App() {
    const { toast } = useToast()

    const [state, dispatch] = useContext(Context)

    const [mansoryArray, setMansoryArray] = useState([])

    function getNotes() {
        GetNotes().then((notes) => {
            dispatch({ type: "SET_NOTES", payload: notes })
            
            // arr[0] = [notes[0], notes[4], notes[8], notes[12]]
            // arr[1] = [notes[1], notes[5], notes[9], notes[13]]
            // arr[2] = [notes[2], notes[6], notes[10], notes[14]]
            // arr[3] = [notes[3], notes[7], notes[11], notes[15]]

            const numberOfArrays = 4;
            const mansoryArray = Array.from({ length: numberOfArrays }, () => []);

            for (let i = 0; i < notes.length; i++) {
                const arrayIndex = i % numberOfArrays;
                mansoryArray[arrayIndex].push(notes[i]);
            }

            setMansoryArray(mansoryArray)
        })
    }

    useEffect(() => {
        getNotes();
    }, [])

    useEffect(() => {
        if (!state.doDeleteNote) {
            getNotes();
        }
    }, [state.doDeleteNote])

    return (
        <Layout buttons={
            <Link to="/add" className={buttonVariants({ variant: "default" })}>Add</Link>
        }>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {
                    mansoryArray.map((notes, index) => {
                        return (
                            <div key={index} className="grid gap-4">
                                {
                                    notes.map((note, index) => {
                                        return (
                                            <CardNote key={index} note={note} />
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>

            <AlertDelete />
        </Layout>
    )
}

export default App
