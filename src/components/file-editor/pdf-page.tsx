import { useState } from 'react';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation,
  Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject,
  ThumbnailView
} from '@syncfusion/ej2-react-pdfviewer';
import { SelectFileDialog } from './select-file-dialog';

export default function PdfPage({ documentLink }: { documentLink: string }) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const toolbarClick = (args: { item: { id: string } }) => {
    if (args.item?.id === 'openDocument') {
      setIsUploadDialogOpen(true);
    }
  };

  const customToolbarItems = [
    {
      id: 'openDocument',
      text: 'Open',
      prefixIcon: 'e-icons e-folder-open',
      align: 'Left',
      tooltipText: 'Open',
    }
  ];

  return (
    <div className='h-full w-full'>
      <style>
        {`
          .e-pv-sidebar-toolbar {
            z-index: 20;
          }

          .e-pv-sidebar-toolbar-splitter {
            z-index: 20;
          }

          .e-pv-sidebar-content-container {
            z-index: 10;
          }
        `}
      </style>
      <div className='control-section h-full'>
        <PdfViewerComponent
          id="container"
          documentPath={documentLink}
          resourceUrl="https://cdn.syncfusion.com/ej2/26.2.11/dist/ej2-pdfviewer-lib"
          style={{ height: '100%' }}
          toolbarSettings={{
            toolbarItems: [
              ...customToolbarItems,
              'PageNavigationTool',
              'MagnificationTool',
              'PanTool',
              'SelectionTool',
              'SearchOption',
              'PrintOption',
              'DownloadOption',
            ]
          }}
          toolbarClick={toolbarClick}
        >
          <Inject services={[
            Toolbar,
            Magnification,
            Navigation,
            Annotation,
            LinkAnnotation,
            Print,
            TextSelection,
            TextSearch,
            FormFields,
            FormDesigner,
            ThumbnailView
          ]} />
        </PdfViewerComponent>

        <SelectFileDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
        />
      </div>
    </div>
  );
}
