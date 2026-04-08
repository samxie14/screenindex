import type { PropsWithChildren } from "react"
import { Sidebar } from "./Sidebar"
import type { AppSection } from "@renderer/App"


type AppShellProps = PropsWithChildren<{
    activeSection: AppSection
    onSectionChange: (section: AppSection) => void
}>

export function AppShell({
    activeSection,
    onSectionChange,
    children
}: AppShellProps): React.JSX.Element {
    return (
        <div className="flex min-h-screen bg-white text-black">
            <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
            <main className="flex-1">{children}</main>
        </div>

    )
}