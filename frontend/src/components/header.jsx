import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

export default function Header({children}) {

    return(
        <header className="bg-white shadow fixed w-full z-50">
            <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Link to="/">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Noted</h1>
                </Link>
                <div>
                    {children}
                </div>
            </div>
        </header>
    )
}