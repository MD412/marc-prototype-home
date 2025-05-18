"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './styles.module.css';

// Dynamically import components that use browser APIs with ssr: false
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className={styles.canvasLoading}>Loading Editor...</div>
});

const RndComponent = dynamic(() => import('react-rnd').then(mod => mod.Rnd), {
  ssr: false,
  loading: () => <div className={styles.canvasLoading}>Loading Window...</div>
});

// Import the CSS without SSR conflict
import 'react-quill/dist/quill.snow.css';

// Add Quill modules configuration
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'link'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ]
};

const quillFormats = [
  'bold', 'italic', 'underline', 'link',
  'list', 'bullet'
];

interface Point {
  x: number;
  y: number;
}

interface DrawingAction {
  points: Point[];
  color: string;
  width: number;
}

interface Window {
  id: string;
  type: 'note' | 'canvas';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  drawingActions?: DrawingAction[];
  zIndex: number;
  isEditingTitle?: boolean;
}

export default function NotedOS() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [showFloatingParticles, setShowFloatingParticles] = useState(true);
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const contextRefs = useRef<{ [key: string]: CanvasRenderingContext2D | null }>({});
  const currentPathRef = useRef<Point[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [mountEditor, setMountEditor] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;
    
    // Load saved windows from localStorage
    try {
      const savedWindows = localStorage.getItem('notedOsWindows');
      if (savedWindows) {
        const parsed = JSON.parse(savedWindows);
        // Ensure all windows have a zIndex property
        const windowsWithZIndex = parsed.map((window: any, index: number) => ({
          ...window,
          zIndex: window.zIndex || 100 + index
        }));
        setWindows(windowsWithZIndex);
        
        // Find the highest zIndex
        const highest = windowsWithZIndex.reduce(
          (max: number, w: Window) => Math.max(max, w.zIndex), 100
        );
        setMaxZIndex(highest);
      }
    } catch (error) {
      console.error("Failed to load windows from localStorage:", error);
    }
  }, [isClient]);

  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;
    
    // Save windows to localStorage whenever they change
    try {
      localStorage.setItem('notedOsWindows', JSON.stringify(windows));
    } catch (error) {
      console.error("Failed to save windows to localStorage:", error);
    }
  }, [windows, isClient]);

  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;
    
    // Initialize/redraw canvases when window state changes
    windows.forEach(window => {
      if (window.type === 'canvas') {
        const canvas = canvasRefs.current[window.id];
        if (canvas) {
          // Make sure canvas dimensions match the container
          canvas.width = window.size.width - 2; // Adjust to account for border
          canvas.height = window.size.height - 45 - 30; // Header height (45px) and content padding (15px top + 15px bottom)
          
          // Get or initialize context
          let context = contextRefs.current[window.id];
          if (!context) {
            context = canvas.getContext('2d');
            if (context) {
              contextRefs.current[window.id] = context;
              context.strokeStyle = '#8a92d1';
              context.lineWidth = 2;
              context.lineCap = 'round';
              context.lineJoin = 'round';
            }
          }
          
          // Redraw if we have a valid context
          if (context && window.drawingActions) {
            redrawCanvas(context, window.drawingActions);
          }
        }
      }
    });
  }, [windows, isClient]);

  // Add cleanup effect when windows change
  useEffect(() => {
    return () => {
      // Force cleanup of any existing Quill instances
      setMountEditor(false);
      setTimeout(() => setMountEditor(true), 0);
    };
  }, [windows]);

  const createNewWindow = (type: 'note' | 'canvas') => {
    // Fixed position in center of screen
    const centerX = typeof window !== 'undefined' ? (window.innerWidth / 2) - 200 : 200;
    const centerY = typeof window !== 'undefined' ? (window.innerHeight / 2) - 200 : 150;
    
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    const newWindow: Window = {
      id: Date.now().toString(),
      type,
      title: type === 'note' ? 'Untitled Note' : 'New Canvas',
      content: '',
      position: { x: centerX, y: centerY },
      size: { width: 400, height: 400 },
      isMinimized: false,
      drawingActions: type === 'canvas' ? [] : undefined,
      zIndex: newZIndex,
      isEditingTitle: type === 'note' // Automatically enable title editing for new notes
    };
    setWindows([...windows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const updateWindowContent = (id: string, content: string) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, content } : window
    ));
  };

  const updateWindowTitle = (id: string, title: string, keepEditing = true) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, title, isEditingTitle: keepEditing } : window
    ));
  };

  const finishEditingTitle = (id: string) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, isEditingTitle: false } : window
    ));
  };

  const startEditingTitle = (id: string) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, isEditingTitle: true } : window
    ));
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setWindows(prev => prev.map(window =>
      window.id === id ? { ...window, zIndex: newZIndex } : window
    ));
    
    setActiveWindow(id);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, windowId: string) => {
    const canvas = canvasRefs.current[windowId];
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPoint({ x, y });
    currentPathRef.current = [{ x, y }];

    // Initialize the path
    const context = contextRefs.current[windowId];
    if (context) {
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, windowId: string) => {
    if (!isDrawing || !currentPoint) return;

    const canvas = canvasRefs.current[windowId];
    const context = contextRefs.current[windowId];
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add to current path
    currentPathRef.current.push({ x, y });
    
    // Draw line
    context.beginPath();
    context.moveTo(currentPoint.x, currentPoint.y);
    context.lineTo(x, y);
    context.stroke();
    
    setCurrentPoint({ x, y });
  };

  const stopDrawing = (windowId: string) => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setCurrentPoint(null);
    
    if (currentPathRef.current.length > 1) {
      setWindows(windows.map(window => {
        if (window.id === windowId && window.type === 'canvas') {
          return {
            ...window,
            drawingActions: [
              ...(window.drawingActions || []),
              { points: [...currentPathRef.current], color: '#8a92d1', width: 2 }
            ]
          };
        }
        return window;
      }));
    }
    
    currentPathRef.current = [];
  };

  const redrawCanvas = (context: CanvasRenderingContext2D, actions: DrawingAction[]) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    actions.forEach(action => {
      if (action.points.length < 2) return;
      
      context.beginPath();
      context.moveTo(action.points[0].x, action.points[0].y);
      
      for (let i = 1; i < action.points.length; i++) {
        context.lineTo(action.points[i].x, action.points[i].y);
      }
      
      context.stroke();
    });
  };

  const clearCanvas = (windowId: string) => {
    const canvas = canvasRefs.current[windowId];
    const context = contextRefs.current[windowId];
    
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      setWindows(prev => prev.map(window =>
        window.id === windowId ? { ...window, drawingActions: [] } : window
      ));
    }
  };

  const undoCanvas = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window || !window.drawingActions || window.drawingActions.length === 0) return;
    
    const canvas = canvasRefs.current[windowId];
    const context = contextRefs.current[windowId];
    
    if (canvas && context) {
      const newActions = [...window.drawingActions];
      newActions.pop();
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      redrawCanvas(context, newActions);
      
      setWindows(prev => prev.map(w =>
        w.id === windowId ? { ...w, drawingActions: newActions } : w
      ));
    }
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(window => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(window => {
      if (window.id === id) {
        // Save current dimensions if minimizing
        const newWindow = { ...window, isMinimized: !window.isMinimized };
        
        // Update the active window if we're minimizing the current active window
        if (newWindow.isMinimized && activeWindow === id) {
          setActiveWindow(null);
        }
        
        return newWindow;
      }
      return window;
    }));
  };

  if (!isClient) {
    return <div className={styles.desktop}>Loading NotedOS...</div>;
  }

  return (
    <div className={styles.desktop}>
      <div className={styles.floatingLeaf1}>🌸</div>
      <div className={styles.floatingLeaf2}>🌿</div>
      <div className={styles.floatingLeaf3}>🍃</div>
      <div className={styles.floatingLeaf4}>🌸</div>
      
      <div className={styles.topBar}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <div className={styles.actionButtons}>
          <button onClick={() => createNewWindow('note')} className={styles.toolbarButton}>
            New Note
          </button>
          <button onClick={() => createNewWindow('canvas')} className={styles.toolbarButton}>
            New Canvas
          </button>
        </div>
      </div>

      {windows.map((window) => (
        <RndComponent
          key={window.id}
          position={{ x: window.position.x, y: window.position.y }}
          size={window.isMinimized 
            ? { width: window.size.width, height: 45 } 
            : { width: window.size.width, height: window.size.height }
          }
          minWidth={200}
          minHeight={window.isMinimized ? 45 : 200}
          disableResizing={window.isMinimized}
          bounds="parent"
          dragHandleClassName={styles.windowHeader}
          enableUserSelectHack={false}
          cancel={`.${styles.titleInput}, .${styles.titleText}, .${styles.windowControl}`}
          style={{ zIndex: window.zIndex }}
          onDrag={(e, d) => {
            e.stopPropagation();
          }}
          onDragStop={(e, d) => {
            e.stopPropagation();
            setWindows(prev => prev.map(w =>
              w.id === window.id ? { ...w, position: { x: d.x, y: d.y } } : w
            ));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWindows(prev => prev.map(w =>
              w.id === window.id ? {
                ...w,
                position,
                size: { width: ref.offsetWidth, height: ref.offsetHeight }
              } : w
            ));
          }}
          className={`${styles.window} ${activeWindow === window.id ? styles.active : ''} ${window.isMinimized ? styles.minimized : ''}`}
          onClick={() => bringToFront(window.id)}
        >
          <div className={styles.windowHeader}>
            <div className={styles.windowTitle}>
              {window.isEditingTitle ? (
                <input
                  type="text"
                  value={window.title}
                  onChange={(e) => updateWindowTitle(window.id, e.target.value)}
                  onBlur={() => finishEditingTitle(window.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      finishEditingTitle(window.id);
                    }
                  }}
                  autoFocus
                  className={styles.titleInput}
                />
              ) : (
                <div 
                  onClick={() => startEditingTitle(window.id)}
                  className={styles.titleText}
                >
                  {window.title}
                </div>
              )}
            </div>
            <div className={styles.windowControls}>
              {window.type === 'canvas' && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      undoCanvas(window.id);
                    }} 
                    className={styles.windowControl}
                  >
                    ↩
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCanvas(window.id);
                    }} 
                    className={styles.windowControl}
                  >
                    🗑
                  </button>
                </>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimize(window.id);
                }} 
                className={styles.windowControl}
                title={window.isMinimized ? "Maximize" : "Minimize"}
              >
                {window.isMinimized ? "+" : "-"}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(window.id);
                }} 
                className={styles.windowControl}
              >
                ×
              </button>
            </div>
          </div>
          {!window.isMinimized && (
            <div className={styles.windowContent}>
              {window.type === 'note' ? (
                <div className={styles.editor}>
                  {mountEditor && (
                    <ReactQuill
                      key={window.id}
                      value={window.content}
                      onChange={(content) => updateWindowContent(window.id, content)}
                      modules={quillModules}
                      formats={quillFormats}
                      theme="snow"
                      preserveWhitespace={true}
                    />
                  )}
                </div>
              ) : (
                <canvas
                  ref={(canvas) => canvasRefs.current[window.id] = canvas}
                  className={styles.canvas}
                  width={window.size.width - 2}
                  height={window.size.height - 45 - 30}
                  onMouseDown={(e) => startDrawing(e, window.id)}
                  onMouseMove={(e) => draw(e, window.id)}
                  onMouseUp={() => stopDrawing(window.id)}
                  onMouseLeave={() => stopDrawing(window.id)}
                />
              )}
            </div>
          )}
        </RndComponent>
      ))}
    </div>
  );
} 