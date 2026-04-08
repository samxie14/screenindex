import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { HomeView } from './components/home/HomeView'
import { TimelineView } from './components/timeline/TimelineView'


export type AppSection = 'home' | 'timeline' | 'settings' | 'help'

function App(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<AppSection>('home')

  return (
    <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
      {activeSection === 'home' && <HomeView />}
      {activeSection === 'timeline' && <TimelineView />}
      {activeSection === 'settings' &&  <div>Settings</div>}
      {activeSection === 'help' && <div>Help</div>}
    </AppShell>
    
  )
}

export default App
