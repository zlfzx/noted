import Header from "./header";
import { Toaster } from "./ui/toaster";

export default function Layout({children, buttons}) {
    return (
        <div id="layout" className="bg-gray-100 h-full">
            <Header children={buttons} />
            <main className="pt-24 h-full">
                <div className="h-full mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 overflow-y-auto">
                    {children}    
                </div>
            </main>
            <Toaster />
        </div>
    )
}