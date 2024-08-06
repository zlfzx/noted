import { useCreateBlockNote } from "@blocknote/react";
import Layout from "./components/layout";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css"
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import { GetNote, SaveNote } from "../wailsjs/go/notes/Service";
import { useParams } from "react-router-dom";
import { useToast } from "./components/ui/use-toast";
import { GetHttpPort } from "../wailsjs/go/services/App";

export default function Add() {
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [note, setNote] = useState(null);

    const editor = useCreateBlockNote({
        uploadFile: async (file) => {
            const httpPort = await GetHttpPort().then((port) => {
                return port
            })

            const url = "http://localhost:" + httpPort + "/upload-file";

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            
            return data.path;
        }
    });

    const { toast } = useToast();

    const getNote = async (id) => {
        GetNote(id).then((note) => {
            setTitle(note.title)
            setContent(JSON.parse(note.content))
            setNote(note)

            editor.insertBlocks(JSON.parse(note.content), editor.document[0], 'before')
        })
    }

    const save = async () => {
        if (title === '' || content === '') {
            return;
        }

        const data = {
            id: parseInt(id),
            title: title,
            content: JSON.stringify(content),
            // markdown: await editor.blocksToMarkdownLossy(content),
            html: await editor.blocksToHTMLLossy(content),
        }

        SaveNote(data).then((d) => {
            // redirect to home
            window.location.href = "#/"
            toast({
                title: "Note " + title + " saved",
                description: "The note has been saved",
            })
        })
    }
    
    const formatTime = (time) => {
        const date = new Date(time)
        
        // 6 March 2021 at 10:00
        const getDate = date.getDate()
        const getMonth = date.toLocaleString('default', { month: 'long' })
        const getYear = date.getFullYear()
        const getHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        const getMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        
        return `${getDate} ${getMonth} ${getYear} at ${getHours}:${getMinutes}`
    }

    useEffect(() => {
        if (!!id) {
            getNote(parseInt(id))
        }
    }, [id])

    return (
        <Layout buttons={
            <>
                <Button variant="secondary" className="mr-3" onClick={() => window.location.href = "#/"}>Back</Button>
                <Button variant="default" onClick={save} disabled={(title === '' || content === '')}>Save</Button>
            </>
        }>
            {
                id && note &&
                <p className="text-right text-slate-500 text-sm mb-2">{formatTime(note.updated_at)}</p>
            }
            <div className="bg-white min-h-80 overflow-y-auto py-10 rounded-md" style={{ maxHeight: id ? "calc(100% - 4rem)" : "calc(100% - 2rem)" }}>
                <Input className="bg-white px-14 mb-2 focus-visible:ring-0 border-none shadow-none rounded-md font-semibold text-2xl placeholder:italic placeholder:text-slate-300" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                <BlockNoteView editor={editor} theme="light" onChange={() => setContent(editor.document)} />
            </div>
        </Layout>
    )
}