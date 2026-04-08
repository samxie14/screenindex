import type { AppSection } from "@renderer/App"

type SidebarProps = {
    activeSection: AppSection
    onSectionChange: (section: AppSection) => void
}

const sections: AppSection[] = ["home", "timeline", "settings", "help"]

export function Sidebar({
    activeSection,
    onSectionChange
}: SidebarProps): React.JSX.Element {
    return (
        <aside className="flex w-64 flex-col border-r border-gray-200 bg-gray-50 p-4">
            <div className="mb-4 text-lg font-semibold">Screenindex</div>
            <nav className="flex flex-col gap-2">
                {sections.map((section) => (
                    <button
                        key={section}
                        type="button"
                        onClick={() => onSectionChange(section)}
                        className={`rounded px-3 py-2 text-left capitalize ${
                            activeSection === section ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {section}
                    </button>
                ))}
            </nav>
        </aside>
    )
}
