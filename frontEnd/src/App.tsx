import { useState } from 'react'
import Login from './pages/Login'
import Layout, { type Page } from './components/Layout'
import Dashboard from './pages/Dashboard'
import DataEntryKeitto from './pages/DataEntryKeitto'
import DataEntryPakkaamo from './pages/DataEntryPakkaamo'
import DataEntrySeparointi from './pages/DataEntrySeparointi'
import ReportsKeitto from './pages/ReportsKeitto'
import ReportsPakkaamo from './pages/ReportsPakkaamo'
import ReportsSeparointi from './pages/ReportsSeparointi'

interface User {
  name: string
  role: 'operaattori' | 'esimies'
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [page, setPage] = useState<Page>('dashboard')

  const handleLogin = (role: 'operaattori' | 'esimies', name: string) => {
    setUser({ role, name })
    setPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('dashboard')
  }

  const navigate = (p: Page) => {
    // Block report pages for operaattori
    if (!p.startsWith('report-') || user?.role === 'esimies') {
      setPage(p)
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} userRole={user.role} />
      case 'entry-keitto':
        return <DataEntryKeitto onNavigate={navigate} userName={user.name} />
      case 'entry-pakkaamo':
        return <DataEntryPakkaamo onNavigate={navigate} userName={user.name} />
      case 'entry-separointi':
        return <DataEntrySeparointi onNavigate={navigate} userName={user.name} />
      case 'report-keitto':
        return user.role === 'esimies' ? <ReportsKeitto onNavigate={navigate} /> : <Dashboard onNavigate={navigate} userRole={user.role} />
      case 'report-pakkaamo':
        return user.role === 'esimies' ? <ReportsPakkaamo onNavigate={navigate} /> : <Dashboard onNavigate={navigate} userRole={user.role} />
      case 'report-separointi':
        return user.role === 'esimies' ? <ReportsSeparointi onNavigate={navigate} /> : <Dashboard onNavigate={navigate} userRole={user.role} />
      default:
        return <Dashboard onNavigate={navigate} userRole={user.role} />
    }
  }

  return (
    <Layout
      currentPage={page}
      onNavigate={navigate}
      userRole={user.role}
      userName={user.name}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  )
}
