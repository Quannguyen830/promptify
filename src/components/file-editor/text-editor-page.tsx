'use client'

import { DocumentEditorContainerComponent, Toolbar, type ToolbarItem, type CustomToolbarItemModel } from '@syncfusion/ej2-react-documenteditor';
import type { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { useRef, useEffect, useState } from 'react';
import { SelectFileDialog } from './select-file-dialog';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

DocumentEditorContainerComponent.Inject(Toolbar);

interface TextEditorProps {
  documentName: string;
  workspaceId: string;
  folderId?: string | undefined;
  workspaceName: string;
  folderName?: string | undefined;
}

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
  const router = useRouter();

  const updateFile = api.file.updateFileByFileId.useMutation();
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
      }, 1000);
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [contentChanged, documentName, updateFile]);

  const handleContentChange = (): void => {
    setContentChanged(true);
  };

  const handleToolbarClick = (args: ClickEventArgs): void => {
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

  const customToolbarItems = [
    {
      prefixIcon: "e-icons e-file-new",
      tooltipText: "New Document",
      text: onWrapText("New"),
      id: "New"
    },
    {
      prefixIcon: "e-icons e-folder-open",
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
    // 'Comments',
    // 'TrackChanges',
    // 'Separator',
    // 'LocalClipboard',
    // 'RestrictEditing',
    // 'Separator',
    // 'FormFields',
    // 'UpdateFields',
    // 'ContentControl'
  ];

  return (
    <div className="h-full w-[calc(100vw-208px)]">
      <DocumentEditorContainerComponent
        id="container"
        height='100%'
        serviceUrl={process.env.NEXT_PUBLIC_DOCUMENT_EDITOR_WEB_SERVER_URL}
        enableToolbar={true}
        ref={containerRef}
        toolbarItems={customToolbarItems as (CustomToolbarItemModel | ToolbarItem)[]}
        toolbarClick={handleToolbarClick}
        contentChange={handleContentChange}
      />

      <SelectFileDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  )
}

