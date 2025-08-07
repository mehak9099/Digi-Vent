import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useEvents } from '../hooks/useEvents';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Flag, 
  MoreHorizontal,
  ArrowLeft,
  Bell,
  Settings,
  LogOut,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  Users,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import LogoutModal from '../components/LogoutModal';

interface Task {
  id: string;
  title: string;
  description: string | null;
  event_id: string | null;
  status: 'backlog' | 'todo' | 'progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  estimated_hours: number;
  actual_hours: number;
  progress: number;
  tags: string[];
  dependencies: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface TaskFormData {
  title: string;
  description: string;
  event_id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  estimated_hours: number;
  tags: string[];
}

const TaskBoard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { tasks, loading, createTask, updateTask } = useTasks();
  const { events } = useEvents();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [newTag, setNewTag] = useState('');

  const [taskForm, setTaskForm] = useState<TaskFormData>({
    title: '',
    description: '',
    event_id: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 1,
    tags: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
    { id: 'todo', title: 'To Do', color: 'bg-blue-100' },
    { id: 'progress', title: 'In Progress', color: 'bg-yellow-100' },
    { id: 'review', title: 'Review', color: 'bg-purple-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-100' }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesEvent = selectedEvent === 'all' || task.event_id === selectedEvent;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesEvent && matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as string;
    
    // Check if it's a valid column
    if (columns.some(col => col.id === newStatus)) {
      try {
        await updateTask(taskId, { 
          status: newStatus as any,
          progress: newStatus === 'completed' ? 100 : newStatus === 'progress' ? 50 : 0
        });
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task status');
      }
    }
    
    setActiveId(null);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createTask({
        title: taskForm.title,
        description: taskForm.description || null,
        event_id: taskForm.event_id || null,
        status: 'backlog',
        priority: taskForm.priority,
        due_date: taskForm.due_date || null,
        estimated_hours: taskForm.estimated_hours,
        actual_hours: 0,
        progress: 0,
        tags: taskForm.tags,
        dependencies: []
      });

      if (result.success) {
        setShowTaskModal(false);
        setTaskForm({
          title: '',
          description: '',
          event_id: '',
          priority: 'medium',
          due_date: '',
          estimated_hours: 1,
          tags: []
        });
        alert('Task created successfully!');
      } else {
        alert(result.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTask = (taskId: string) => {
    alert(`View task ${taskId} details would be implemented here`);
  };

  const handleEditTask = (taskId: string) => {
    alert(`Edit task ${taskId} functionality would be implemented here`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      alert(`Task ${taskId} would be deleted`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !taskForm.tags.includes(newTag.trim())) {
      setTaskForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTaskForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventName = (eventId: string | null) => {
    if (!eventId) return 'No Event';
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Task Board</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefreshData}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">{profile?.role || 'Admin'}</p>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
              
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowTaskModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                getEventName={getEventName}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeId ? (
              <TaskCard
                task={filteredTasks.find(t => t.id === activeId)!}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                getEventName={getEventName}
                getPriorityColor={getPriorityColor}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Task description (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event
                  </label>
                  <select
                    value={taskForm.event_id}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, event_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">No Event</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={taskForm.estimated_hours}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {taskForm.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

// Task Column Component
interface TaskColumnProps {
  column: { id: string; title: string; color: string };
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  getEventName: (eventId: string | null) => string;
  getPriorityColor: (priority: string) => string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  getEventName,
  getPriorityColor
}) => {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${column.color} rounded-xl p-4 min-h-[500px] ${
        isOver ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewTask={onViewTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              getEventName={getEventName}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  onViewTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  getEventName: (eventId: string | null) => string;
  getPriorityColor: (priority: string) => string;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onViewTask,
  onEditTask,
  onDeleteTask,
  getEventName,
  getPriorityColor,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
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
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
        <div className="flex items-center space-x-1">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="space-y-2 mb-3">
        {task.event_id && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="truncate">{getEventName(task.event_id)}</span>
          </div>
        )}
        
        {task.due_date && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500">
          <Zap className="w-3 h-3 mr-1" />
          <span>{task.estimated_hours}h estimated</span>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {task.progress > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewTask(task.id);
            }}
            className="p-1 text-gray-400 hover:text-indigo-600 rounded"
            title="View Task"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task.id);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="Edit Task"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskBoard;