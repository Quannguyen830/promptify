'use client'

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
          resourceUrl={process.env.NEXT_PUBLIC_PDF_WEB_SERVER_URL}
          documentPath={documentLink}
          style={{ height: '100%' }}
          serviceUrl={process.env.NEXT_PUBLIC_PDF_WEB_SERVER_URL}
          enableHyperlink={false} // Disable hyperlinks to avoid the annotation error
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
            Print,
            TextSelection,
            TextSearch,
            FormFields,
            FormDesigner,
            ThumbnailView
            // Removed Annotation and LinkAnnotation which are causing issues
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
