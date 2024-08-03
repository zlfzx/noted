import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { useContext } from "react";
import { Context } from "./../store";

export default function CardNote({ note }) {

    const [state, dispatch] = useContext(Context)

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Link to={"/detail/" + note.id} className="w-full">
                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle>{note.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription dangerouslySetInnerHTML={{ __html: note.html }}></CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    <Link to={"/detail/" + note.id}>Edit</Link>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => dispatch({ type: "SET_DELETE_NOTE", payload: note })}>
                    <span className="text-red-500 cursor-pointer">Delete</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}