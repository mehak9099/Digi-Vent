import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  Clock,
  User,
  Users,
  MessageCircle,
  Paperclip,
  Flag,
  Plus,
  Search,
  Filter,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  X,
  Edit,
  Trash2,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Timer,
  Tag,
  ArrowRight,
  Zap,
  Target,
  Activity
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignees: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  reporter: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  tags: string[];
  comments: number;
  attachments: number;
  subtasks: {
    completed: number;
    total: number;
  };
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
  event: string;
  category: string;
}

interface Column {
  id: string;
  title: string;
  wipLimit?: number;
  color: string;
  tasks: Task[];
}

const TaskBoard = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    assignee: '',
    priority: '',
    dueDate: '',
    tags: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Sample data
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'backlog',
      title: 'Backlog',
      color: 'bg-gray-100',
      tasks: [
        {
          id: '1',
          title: 'Setup registration booth',
          description: 'Prepare materials and signage for volunteer registration',
          status: 'backlog',
          priority: 'medium',
          assignees: [],
          reporter: { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-15',
          estimatedHours: 4,
          actualHours: 0,
          progress: 0,
          tags: ['setup', 'registration'],
          comments: 2,
          attachments: 1,
          subtasks: { completed: 0, total: 3 },
          dependencies: [],
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          event: 'Community Food Drive',
          category: 'Setup'
        },
        {
          id: '2',
          title: 'Order catering supplies',
          description: 'Purchase food and beverages for volunteers',
          status: 'backlog',
          priority: 'high',
          assignees: [],
          reporter: { id: '2', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-10',
          estimatedHours: 2,
          actualHours: 0,
          progress: 0,
          tags: ['catering', 'supplies'],
          comments: 0,
          attachments: 0,
          subtasks: { completed: 0, total: 2 },
          dependencies: [],
          createdAt: '2024-01-19',
          updatedAt: '2024-01-19',
          event: 'Community Food Drive',
          category: 'Logistics'
        }
      ]
    },
    {
      id: 'todo',
      title: 'To Do',
      wipLimit: 5,
      color: 'bg-blue-50',
      tasks: [
        {
          id: '3',
          title: 'Create volunteer schedule',
          description: 'Assign volunteers to specific time slots and roles',
          status: 'todo',
          priority: 'high',
          assignees: [
            { id: '3', name: 'Emma Davis', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
          ],
          reporter: { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-12',
          estimatedHours: 6,
          actualHours: 0,
          progress: 0,
          tags: ['scheduling', 'volunteers'],
          comments: 5,
          attachments: 2,
          subtasks: { completed: 1, total: 4 },
          dependencies: ['1'],
          createdAt: '2024-01-18',
          updatedAt: '2024-01-21',
          event: 'Community Food Drive',
          category: 'Planning'
        }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      wipLimit: 3,
      color: 'bg-yellow-50',
      tasks: [
        {
          id: '4',
          title: 'Design event flyers',
          description: 'Create promotional materials for social media and print',
          status: 'progress',
          priority: 'medium',
          assignees: [
            { id: '4', name: 'Alex Rivera', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
          ],
          reporter: { id: '2', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-08',
          estimatedHours: 8,
          actualHours: 3,
          progress: 60,
          tags: ['design', 'marketing'],
          comments: 3,
          attachments: 4,
          subtasks: { completed: 3, total: 5 },
          dependencies: [],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-22',
          event: 'Community Food Drive',
          category: 'Marketing'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      wipLimit: 2,
      color: 'bg-purple-50',
      tasks: [
        {
          id: '5',
          title: 'Venue safety inspection',
          description: 'Complete safety checklist and documentation',
          status: 'review',
          priority: 'urgent',
          assignees: [
            { id: '5', name: 'Jordan Kim', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
          ],
          reporter: { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-05',
          estimatedHours: 3,
          actualHours: 3,
          progress: 100,
          tags: ['safety', 'venue'],
          comments: 1,
          attachments: 3,
          subtasks: { completed: 4, total: 4 },
          dependencies: [],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-22',
          event: 'Community Food Drive',
          category: 'Safety'
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-50',
      tasks: [
        {
          id: '6',
          title: 'Book event venue',
          description: 'Secure location and sign rental agreement',
          status: 'completed',
          priority: 'high',
          assignees: [
            { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
          ],
          reporter: { id: '1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-01-30',
          estimatedHours: 4,
          actualHours: 5,
          progress: 100,
          tags: ['venue', 'booking'],
          comments: 8,
          attachments: 2,
          subtasks: { completed: 3, total: 3 },
          dependencies: [],
          createdAt: '2024-01-05',
          updatedAt: '2024-01-25',
          event: 'Community Food Drive',
          category: 'Logistics'
        }
      ]
    },
    {
      id: 'blocked',
      title: 'Blocked',
      color: 'bg-red-50',
      tasks: [
        {
          id: '7',
          title: 'Setup sound system',
          description: 'Install and test audio equipment for announcements',
          status: 'blocked',
          priority: 'medium',
          assignees: [
            { id: '6', name: 'Taylor Swift', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }
          ],
          reporter: { id: '2', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
          dueDate: '2024-02-14',
          estimatedHours: 3,
          actualHours: 0,
          progress: 0,
          tags: ['equipment', 'audio'],
          comments: 4,
          attachments: 1,
          subtasks: { completed: 0, total: 2 },
          dependencies: ['6'],
          createdAt: '2024-01-16',
          updatedAt: '2024-01-20',
          event: 'Community Food Drive',
          category: 'Setup'
        }
      ]
    }
  ]);

  const events = [
    { id: 'all', name: 'All Events' },
    { id: '1', name: 'Community Food Drive' },
    { id: '2', name: 'Park Cleanup' },
    { id: '3', name: 'Youth Workshop' }
  ];

  const analytics = {
    totalTasks: columns.reduce((sum, col) => sum + col.tasks.length, 0),
    completedTasks: columns.find(col => col.id === 'completed')?.tasks.length || 0,
    overdueTasks: 3,
    avgCompletionTime: '2.3 days',
    teamVelocity: 85,
    burndownData: [100, 85, 70, 55, 40, 25, 10]
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task and its current column
    let activeTask: Task | null = null;
    let activeColumnId: string | null = null;

    for (const column of columns) {
      const task = column.tasks.find(t => t.id === activeId);
      if (task) {
        activeTask = task;
        activeColumnId = column.id;
        break;
      }
    }

    if (!activeTask || !activeColumnId) return;

    // Determine target column
    let targetColumnId = overId;
    
    // If dropped on a task, find its column
    if (!columns.find(col => col.id === overId)) {
      for (const column of columns) {
        if (column.tasks.find(t => t.id === overId)) {
          targetColumnId = column.id;
          break;
        }
      }
    }

    // Update task status and move between columns
    if (activeColumnId !== targetColumnId) {
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === activeColumnId) {
            // Remove from source column
            return {
              ...column,
              tasks: column.tasks.filter(t => t.id !== activeId)
            };
          } else if (column.id === targetColumnId) {
            // Add to target column
            const updatedTask = {
              ...activeTask,
              status: targetColumnId as Task['status'],
              updatedAt: new Date().toISOString()
            };
            return {
              ...column,
              tasks: [...column.tasks, updatedTask]
            };
          }
          return column;
        });
      });
    }

    setActiveId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-4 h-4 text-red-600" />;
      case 'high': return <Flag className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Flag className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'backlog': return <Circle className="w-4 h-4 text-gray-400" />;
      case 'todo': return <Circle className="w-4 h-4 text-blue-500" />;
      case 'progress': return <Timer className="w-4 h-4 text-yellow-500" />;
      case 'review': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days`;
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Admin
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Analytics Bar */}
      {showAnalytics && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.totalTasks}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{analytics.completedTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-red-900">{analytics.overdueTasks}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Avg Time</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.avgCompletionTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Velocity</p>
                  <p className="text-2xl font-bold text-orange-900">{analytics.teamVelocity}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Team Load</p>
                  <p className="text-2xl font-bold text-indigo-900">78%</p>
                </div>
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Burndown</p>
                  <div className="w-16 h-8 bg-gray-200 rounded mt-1">
                    <div className="h-full bg-blue-500 rounded" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!showAnalytics && (
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <button
            onClick={() => setShowAnalytics(true)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            Show Analytics
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Edit className="w-4 h-4 mr-2" />
              Bulk Actions
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={column.tasks}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeId ? (
              <TaskCard
                task={columns
                  .flatMap(col => col.tasks)
                  .find(task => task.id === activeId)!}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks }) => {
  const isWipLimitExceeded = column.wipLimit && tasks.length > column.wipLimit;

  return (
    <div className={`${column.color} border-2 border-dashed border-gray-200 rounded-xl min-h-[600px] w-80 flex-shrink-0 p-4 transition-all duration-300 hover:shadow-lg`}>
      {/* Column Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 pb-3 mb-4 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {column.wipLimit && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">WIP Limit: {column.wipLimit}</span>
            {isWipLimitExceeded && (
              <span className="text-red-600 font-medium">Limit exceeded!</span>
            )}
          </div>
        )}
        
        <button className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200">
          <Plus className="w-4 h-4 mx-auto" />
        </button>
      </div>

      {/* Tasks */}
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

interface SortableTaskCardProps {
  task: Task;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-4 h-4 text-red-600" />;
      case 'high': return <Flag className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Flag className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days`;
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <div
      className={`
        ${getPriorityColor(task.priority)}
        ${isDragging ? 'shadow-2xl border-blue-400 rotate-2 scale-105' : 'shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1'}
        ${isOverdue(task.dueDate) ? 'ring-2 ring-red-200' : ''}
        bg-white border-l-4 border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200
      `}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getPriorityIcon(task.priority)}
          <span className="text-xs text-gray-500 font-medium">#{task.id}</span>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {task.progress > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtasks */}
      {task.subtasks.total > 0 && (
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {task.subtasks.completed}/{task.subtasks.total} subtasks
          </span>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className={`text-sm ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Time Tracking */}
      {task.actualHours > 0 && (
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {task.actualHours}h / {task.estimatedHours}h
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Assignees */}
        <div className="flex items-center space-x-2">
          {task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <img
                  key={index}
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={assignee.name}
                />
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>

        {/* Interaction Icons */}
        <div className="flex items-center space-x-3 text-gray-400">
          {task.comments > 0 && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{task.comments}</span>
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">{task.attachments}</span>
            </div>
          )}
          {task.dependencies.length > 0 && (
            <div className="flex items-center space-x-1">
              <ArrowRight className="w-4 h-4" />
              <span className="text-xs">{task.dependencies.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;