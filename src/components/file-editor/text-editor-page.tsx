'use client'

import { DocumentEditorContainerComponent, Toolbar, type ToolbarItem, type CustomToolbarItemModel } from '@syncfusion/ej2-react-documenteditor';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { useRef, useEffect, useState } from 'react';
import { SelectFileDialog } from './select-file-dialog';

DocumentEditorContainerComponent.Inject(Toolbar);

interface TextEditorProps {
  documentName: string
}

export default function TextEditorPage({ documentName }: TextEditorProps) {
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Helper function for text wrapping
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

  // Handle toolbar clicks
  const handleToolbarClick = (args: ClickEventArgs): void => {
    if (containerRef.current) {
      switch (args.item.id) {
        case 'Open':
          setIsUploadDialogOpen(true);
          break;
        case 'Custom':
          // Disable image toolbar item
          containerRef.current.toolbar.enableItems(4, false);
          break;
      }
    }
  };

  useEffect(() => {
    if (documentName) {
      fetch(
        'http://localhost:6002/api/documenteditor/LoadFromS3',
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

  const customToolbarItems = [
    {
      prefixIcon: "e-icons e-folder-open",  // Using Syncfusion's open icon
      tooltipText: "Open Document",
      text: onWrapText("Open"),
      id: "Open"
    },
    'Undo',
    'Redo',
    'Separator',
    'Image',
    'Table',
    'Hyperlink',
    'Bookmark',
    'TableOfContents',
    'Separator',
    'Header',
    'Footer',
    'PageSetup',
    'PageNumber',
    'Break',
    'InsertFootnote',
    'InsertEndnote',
    'Separator',
    'Find',
    'Separator',
    'Comments',
    'TrackChanges',
    'Separator',
    'LocalClipboard',
    'RestrictEditing',
    'Separator',
    'FormFields',
    'UpdateFields',
    'ContentControl'
  ];

  return (
    <div className="h-full">
      <DocumentEditorContainerComponent
        id="container"
        height='100%'
        serviceUrl="http://localhost:6002/api/documenteditor"
        enableToolbar={true}
        ref={containerRef}
        toolbarItems={customToolbarItems as (CustomToolbarItemModel | ToolbarItem)[]}
        toolbarClick={handleToolbarClick}
      />

      <SelectFileDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  )
}

