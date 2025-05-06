'use client'

import { DocumentEditorContainerComponent, Toolbar, type ToolbarItem, type CustomToolbarItemModel, Inject } from '@syncfusion/ej2-react-documenteditor';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { useRef, useEffect, useState } from 'react';
import { SelectFileDialog } from './select-file-dialog';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { type ItemModel } from '@syncfusion/ej2-navigations';

DocumentEditorContainerComponent.Inject(Toolbar);

interface TextEditorProps {
  documentName: string;
  workspaceId: string;
  folderId?: string | undefined;
  workspaceName: string;
  folderName?: string | undefined;
}

// Define a custom type that combines both ItemModel and our custom properties
type CustomToolbarItem = ItemModel & {
  tooltipText?: string;
  prefixIcon?: string;
  text?: string;
  id?: string;
};

export default function TextEditorPage({
  documentName,
  workspaceId,
  folderId,
  workspaceName,
  folderName
}: TextEditorProps) {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const router = useRouter();

  const updateFile = api.file.updateFileContentByFileId.useMutation();
  const createNewFile = api.file.createEmptyFile.useMutation({
    onSuccess: (newFileId) => {
      router.push(`/file/${newFileId}`);
    },
  });

  const onWrapText = (text: string): string => {
    let content = '';
    const index: number = text.lastIndexOf(' ');

    if (index !== -1) {
      content = text.slice(0, index) + "<div class='e-de-text-wrap'>" + text.slice(index + 1) + "</div>";
    } else {
      content = text;
    }

    return content;
  };

  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;

    if (containerRef.current) {
      autoSaveInterval = setInterval(() => {
        if (contentChanged && containerRef.current) {
          void (async () => {
            try {
              if (!containerRef.current) return;
              const blob = await containerRef.current.documentEditor.saveAsBlob('Docx');
              const arrayBuffer = await blob.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);

              await updateFile.mutateAsync({
                fileId: documentName,
                fileBuffer: uint8Array,
              });

              console.log('Document auto-saved successfully');
              setContentChanged(false);
            } catch (error) {
              console.error('Error auto-saving document:', error);
            }
          })();
        }
      }, 10000);
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [contentChanged, documentName, updateFile]);

  const handleContentChange = (): void => {
    setContentChanged(true);
    void handleAutoComplete();
  };

  const handleAutoComplete = async (): Promise<void> => {
    if (!containerRef.current) return;

    const editor = containerRef.current.documentEditor;
    // const startPosition = editor.selection.start;

    // if (!startPosition?.paragraph) return;

    // const fullText = editor.selection.text ?? '';
    // const textUpToCursor = fullText.substring(0, startPosition.offset);

    try {
      // Use placeholder suggestion instead of LLM
      const placeholderSuggestion = " [placeholder suggestion]";
      setSuggestion(placeholderSuggestion);

      // Handle Tab key to accept suggestion
      editor.keyDown = (args: KeyboardEvent) => {
        if (args.key === 'Tab' && suggestion) {
          args.preventDefault();
          editor.editor.insertText(suggestion);
          setSuggestion(null);
          setContentChanged(true);
        }
      };
    } catch (error) {
      console.error('Error in auto-complete:', error);
      setSuggestion(null);
    }
  };

  // Add styles for suggestion overlay
  useEffect(() => {
    if (!containerRef.current || !suggestion) return;

    const editor = containerRef.current.documentEditor;
    const suggestionElement = document.createElement('div');
    suggestionElement.className = 'text-suggestion';
    suggestionElement.textContent = suggestion;
    suggestionElement.style.cssText = `
      position: absolute;
      color: #6b7280;
      pointer-events: none;
      z-index: 100;
    `;

    // Position suggestion after cursor
    const caret = editor.selection.caret;
if (caret) {
  // Extract position from the caret element
    const caretRect = caret.getBoundingClientRect();
    const editorRect = editor.element.getBoundingClientRect();
    
    // Get the current text node's position
    // This helps account for bullet points and indentation
    const selection = window.getSelection();
    let offsetAdjustment = 0;
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textRect = range.getBoundingClientRect();
      // Use the text position instead of caret when available
      if (textRect.width > 0) {
        offsetAdjustment = textRect.left - caretRect.left;
      }
    }
  
  // Position right after the caret with adjustments
    suggestionElement.style.position = 'absolute';
    
    // Adjust horizontal position - place directly after text content, not just caret
    suggestionElement.style.left = `${caretRect.left - editorRect.left + offsetAdjustment}px`;
    
    // Adjust vertical position - align with the text baseline
    suggestionElement.style.top = `${caretRect.bottom - editorRect.top + 58}px`;
    
    // Match text styling from the document
    const documentStyles = window.getComputedStyle(editor.element.querySelector('.e-de-content') ?? editor.element);
    suggestionElement.style.lineHeight = documentStyles.lineHeight;
    suggestionElement.style.fontFamily = documentStyles.fontFamily;
    suggestionElement.style.fontSize = documentStyles.fontSize;
  }

    editor.element.appendChild(suggestionElement);

    return () => {
      suggestionElement.remove();
    };
  }, [suggestion]);

  const handleToolbarClick = async (args: ClickEventArgs): Promise<void> => {
    if (containerRef.current) {
      switch (args.item.id) {
        case 'Open':
          setIsUploadDialogOpen(true);
          break;
        case 'New':
          void createNewFile.mutateAsync({
            workspaceId,
            folderId: folderId ?? undefined,
            workspaceName,
            folderName: folderName ?? undefined,
          });
          break;
      }
    }
  };

  useEffect(() => {
    if (documentName) {
      fetch(
        `${process.env.NEXT_PUBLIC_DOCUMENT_EDITOR_WEB_SERVER_URL}/LoadFromS3`,
        {
          method: 'Post',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          body: JSON.stringify({ documentName: documentName })
        }
      )
        .then(response => {
          if (response.status === 200 || response.status === 304) {
            return response.json();
          } else {
            throw new Error('Error loading data');
          }
        })
        .then(json => {
          if (containerRef.current) {
            containerRef.current.documentEditor.open(JSON.stringify(json));
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [documentName]);

  const customToolbarItems: (CustomToolbarItem | string)[] = [
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
    {
      prefixIcon: "e-icons e-file-new",
      tooltipText: "New Document",
      text: onWrapText("New"),
      id: "New",
      type: 'Button'
    },
    {
      prefixIcon: "e-icons e-folder-open",
      tooltipText: "Open Document",
      text: onWrapText("Open"),
      id: "Open",
      type: 'Button'
    },
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
    'Undo',
    'Redo',
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
    'Image',
    'Table',
    {
      prefixIcon: 'e-icons e-link',
      tooltipText: 'Link',
      text: onWrapText('Link'),
      id: 'Link',
      type: 'Button'
    },
    'Bookmark',
    'TableOfContents',
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
    'Header',
    'Footer',
    'PageSetup',
    'PageNumber',
    'Break',
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
    'Find',
    'Comments',
    'TrackChanges',
    { type: 'Separator', template: '<div class="e-toolbar-separator ml-4"></div>' },
  ];

  return (
    <div className="h-full w-[calc(100vw-208px)] bg-white">
      <DocumentEditorContainerComponent
        id="container"
        height='100%'
        serviceUrl={process.env.NEXT_PUBLIC_DOCUMENT_EDITOR_WEB_SERVER_URL}
        enableToolbar={true}
        ref={containerRef}
        toolbarItems={customToolbarItems as (CustomToolbarItemModel | ToolbarItem)[]}
        toolbarClick={handleToolbarClick}
        contentChange={handleContentChange}
        style={{
          backgroundColor: 'white',
          '--toolbar-background': 'white',
          '--toolbar-btn-hover': '#f5f5f5',
          '--content-background': 'white',
          '--toolbar-btn-text-color': '#333',
          '--toolbar-separator-border': '#E0E0E0',
          '--toolbar-btn-bg': 'transparent',
        } as React.CSSProperties}
      >
        <style jsx global>{`
          .e-toolbar .e-toolbar-items {
            justify-content: center;
            width: 100%;
          }
          .e-toolbar .e-toolbar-items .e-toolbar-item {
            margin: 0 2px;
          }
          .e-toolbar .e-toolbar-items .e-toolbar-separator {
            height: 40px;
            border-right: 1px solid var(--toolbar-separator-border);
          }
          .e-tab-text {
            color: #333;
          }
          .text-suggestion {
            font-family: inherit;
            font-size: inherit;
            opacity: 0.6;
          }
        `}</style>
        <Inject services={[Toolbar]} />
      </DocumentEditorContainerComponent>

      <SelectFileDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  )
}

