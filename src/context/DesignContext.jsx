import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DesignContext = createContext(null);

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78;

export const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);
export const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);

const initialDocument = {
  id: null,
  name: 'Untitled Design',
  pages: [
    {
      id: 'page-1',
      elements: []
    }
  ],
  currentPageIndex: 0,
  zoom: 0.75,
  showGrid: true,
  gridSize: 20,
  smartSnapping: true,
};

export function DesignProvider({ children }) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [history, setHistory] = useState([initialDocument]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [documentName, setDocumentName] = useState('Untitled Design');

  const currentPage = document.pages[document.currentPageIndex];
  const elements = currentPage?.elements || [];

  const pushToHistory = useCallback((newDoc) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newDoc);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const setZoom = useCallback((zoom) => {
    setDocument(prev => ({ ...prev, zoom: Math.max(0.25, Math.min(2, zoom)) }));
  }, []);

  const toggleGrid = useCallback(() => {
    setDocument(prev => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const setGridSize = useCallback((size) => {
    setDocument(prev => ({ ...prev, gridSize: size }));
  }, []);

  const toggleSmartSnapping = useCallback(() => {
    setDocument(prev => ({ ...prev, smartSnapping: !prev.smartSnapping }));
  }, []);

  const addElement = useCallback((elementData) => {
    const newElement = {
      id: uuidv4(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      content: 'New Text',
      style: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#1e293b',
        textAlign: 'left',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        padding: 8,
      },
      zIndex: elements.length,
      ...elementData,
    };

    setDocument(prev => {
      const newDoc = {
        ...prev,
        pages: prev.pages.map((page, idx) =>
          idx === prev.currentPageIndex
            ? { ...page, elements: [...page.elements, newElement] }
            : page
        ),
      };
      pushToHistory(newDoc);
      return newDoc;
    });

    setSelectedElementId(newElement.id);
    return newElement.id;
  }, [elements.length, pushToHistory]);

  const updateElement = useCallback((elementId, updates, saveToHistory = false) => {
    setDocument(prev => {
      const newDoc = {
        ...prev,
        pages: prev.pages.map((page, idx) =>
          idx === prev.currentPageIndex
            ? {
                ...page,
                elements: page.elements.map(el =>
                  el.id === elementId ? { ...el, ...updates } : el
                ),
              }
            : page
        ),
      };
      if (saveToHistory) {
        pushToHistory(newDoc);
      }
      return newDoc;
    });
  }, [pushToHistory]);

  const commitElementChange = useCallback(() => {
    setDocument(prev => {
      pushToHistory(prev);
      return prev;
    });
  }, [pushToHistory]);

  const deleteElement = useCallback((elementId) => {
    setDocument(prev => {
      const newDoc = {
        ...prev,
        pages: prev.pages.map((page, idx) =>
          idx === prev.currentPageIndex
            ? { ...page, elements: page.elements.filter(el => el.id !== elementId) }
            : page
        ),
      };
      pushToHistory(newDoc);
      return newDoc;
    });
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId, pushToHistory]);

  const duplicateElement = useCallback((elementId) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: uuidv4(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length,
      };
      setDocument(prev => {
        const newDoc = {
          ...prev,
          pages: prev.pages.map((page, idx) =>
            idx === prev.currentPageIndex
              ? { ...page, elements: [...page.elements, newElement] }
              : page
          ),
        };
        pushToHistory(newDoc);
        return newDoc;
      });
      setSelectedElementId(newElement.id);
    }
  }, [elements, pushToHistory]);

  const bringForward = useCallback((elementId) => {
    setDocument(prev => {
      const page = prev.pages[prev.currentPageIndex];
      const elementIndex = page.elements.findIndex(el => el.id === elementId);
      if (elementIndex < page.elements.length - 1) {
        const newElements = [...page.elements];
        const temp = newElements[elementIndex].zIndex;
        newElements[elementIndex] = { ...newElements[elementIndex], zIndex: newElements[elementIndex + 1].zIndex };
        newElements[elementIndex + 1] = { ...newElements[elementIndex + 1], zIndex: temp };
        [newElements[elementIndex], newElements[elementIndex + 1]] = [newElements[elementIndex + 1], newElements[elementIndex]];
        const newDoc = {
          ...prev,
          pages: prev.pages.map((p, idx) =>
            idx === prev.currentPageIndex ? { ...p, elements: newElements } : p
          ),
        };
        pushToHistory(newDoc);
        return newDoc;
      }
      return prev;
    });
  }, [pushToHistory]);

  const sendBackward = useCallback((elementId) => {
    setDocument(prev => {
      const page = prev.pages[prev.currentPageIndex];
      const elementIndex = page.elements.findIndex(el => el.id === elementId);
      if (elementIndex > 0) {
        const newElements = [...page.elements];
        const temp = newElements[elementIndex].zIndex;
        newElements[elementIndex] = { ...newElements[elementIndex], zIndex: newElements[elementIndex - 1].zIndex };
        newElements[elementIndex - 1] = { ...newElements[elementIndex - 1], zIndex: temp };
        [newElements[elementIndex], newElements[elementIndex - 1]] = [newElements[elementIndex - 1], newElements[elementIndex]];
        const newDoc = {
          ...prev,
          pages: prev.pages.map((p, idx) =>
            idx === prev.currentPageIndex ? { ...p, elements: newElements } : p
          ),
        };
        pushToHistory(newDoc);
        return newDoc;
      }
      return prev;
    });
  }, [pushToHistory]);

  const loadTemplate = useCallback((templateElements) => {
    const newElements = templateElements.map((el, index) => ({
      ...el,
      id: uuidv4(),
      zIndex: index,
    }));
    
    setDocument(prev => {
      const newDoc = {
        ...prev,
        pages: prev.pages.map((page, idx) =>
          idx === prev.currentPageIndex
            ? { ...page, elements: newElements }
            : page
        ),
      };
      pushToHistory(newDoc);
      return newDoc;
    });
    setSelectedElementId(null);
  }, [pushToHistory]);

  const clearCanvas = useCallback(() => {
    setDocument(prev => {
      const newDoc = {
        ...prev,
        pages: prev.pages.map((page, idx) =>
          idx === prev.currentPageIndex
            ? { ...page, elements: [] }
            : page
        ),
      };
      pushToHistory(newDoc);
      return newDoc;
    });
    setSelectedElementId(null);
  }, [pushToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setDocument(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setDocument(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const getSelectedElement = useCallback(() => {
    return elements.find(el => el.id === selectedElementId) || null;
  }, [elements, selectedElementId]);

  const value = {
    document,
    setDocument,
    currentPage,
    elements,
    selectedElementId,
    setSelectedElementId,
    zoom: document.zoom,
    setZoom,
    showGrid: document.showGrid,
    toggleGrid,
    gridSize: document.gridSize,
    setGridSize,
    smartSnapping: document.smartSnapping,
    toggleSmartSnapping,
    addElement,
    updateElement,
    commitElementChange,
    deleteElement,
    duplicateElement,
    bringForward,
    sendBackward,
    loadTemplate,
    clearCanvas,
    getSelectedElement,
    documentName,
    setDocumentName,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
