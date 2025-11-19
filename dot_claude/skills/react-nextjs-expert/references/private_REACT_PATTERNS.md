# React Patterns & Best Practices

## Component Composition Patterns

### Compound Components Pattern
Create components that work together to form a cohesive API.

**Example: Tabs Component**
```tsx
// Compound component API
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

**Implementation:**
```tsx
interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export function Tabs({ children, defaultValue, onChange }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onChange: handleChange }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  return (
    <button
      onClick={() => context.onChange(value)}
      aria-selected={context.value === value}
    >
      {children}
    </button>
  )
}
```

**Benefits:**
- Flexible, composable API
- Shared state without prop drilling
- Better developer experience
- Self-documenting structure

### Render Props Pattern
Share code between components using a prop whose value is a function.

**Example:**
```tsx
function DataFetcher({ url, render }: { url: string; render: (data: any) => ReactNode }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [url])

  return render({ data, loading })
}

// Usage
<DataFetcher
  url="/api/users"
  render={({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
/>
```

**When to use:**
- Logic reuse across different UI
- Flexible rendering based on state
- Alternative to HOCs

### Higher-Order Components (HOC)
Function that takes a component and returns a new component.

**Example:**
```tsx
function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) return <Spinner />
    if (!user) return <Redirect to="/login" />

    return <Component {...props} />
  }
}

// Usage
const ProtectedPage = withAuth(Dashboard)
```

**When to use:**
- Cross-cutting concerns (auth, logging, analytics)
- Props manipulation
- Legacy code (prefer hooks in new code)

## Custom Hooks Patterns

### Data Fetching Hook
```tsx
function useQuery<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, error, loading }
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useQuery<User>(`/api/users/${userId}`)

  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  if (!user) return null

  return <div>{user.name}</div>
}
```

### Local Storage Hook
```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  )
}
```

### Debounce Hook
```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Fetch search results
      fetch(`/api/search?q=${debouncedSearchTerm}`)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
```

## Error Boundary Pattern

### Class-based Error Boundary
```tsx
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Multiple Error Boundaries
```tsx
function App() {
  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <Header />
      <ErrorBoundary fallback={<SidebarErrorFallback />}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ContentErrorFallback />}>
        <MainContent />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
```

**Strategy:**
- App-level boundary for critical errors
- Feature-level boundaries for isolated failures
- Component-level for experimental features

## Performance Optimization Patterns

### Memoization Pattern
```tsx
// React.memo - prevent re-renders when props haven't changed
const ExpensiveComponent = React.memo(({ data }: { data: Data }) => {
  return <div>{/* expensive rendering */}</div>
})

// useMemo - memoize expensive calculations
function FilteredList({ items, filter }: { items: Item[]; filter: string }) {
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  )

  return <List items={filteredItems} />
}

// useCallback - memoize callback functions
function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <ChildComponent onClick={handleClick} />
}
```

**When to use:**
- ✅ Expensive calculations (complex filtering, sorting)
- ✅ Callbacks passed to optimized child components
- ✅ Dependencies in other hooks
- ❌ Simple calculations (premature optimization)
- ❌ Every component (measure first)

### Code Splitting Pattern
```tsx
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'))

function Analytics() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
```

### Virtualization Pattern
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Best Practices Checklist

- [ ] Use functional components with hooks (not class components)
- [ ] Extract custom hooks for reusable logic
- [ ] Implement error boundaries for graceful degradation
- [ ] Use React.memo strategically (not everywhere)
- [ ] Code split routes and heavy components
- [ ] Virtualize long lists (>100 items)
- [ ] Clean up effects (event listeners, timers, subscriptions)
- [ ] Use proper TypeScript types (avoid `any`)
- [ ] Test components with React Testing Library
- [ ] Profile performance with React DevTools
