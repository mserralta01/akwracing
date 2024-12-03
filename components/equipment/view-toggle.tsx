import { Button } from "@/components/ui/button"
import { LayoutGrid, Table as TableIcon } from "lucide-react"

type ViewMode = 'grid' | 'table'

type ViewToggleProps = {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentView === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('grid')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant={currentView === 'table' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('table')}
      >
        <TableIcon className="h-4 w-4 mr-2" />
        Table
      </Button>
    </div>
  )
} 