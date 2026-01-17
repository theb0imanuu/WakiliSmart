import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DocumentRepository = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setFiles(response.data);
      } catch (err) {
        setError('Failed to fetch documents.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Helper to render file icons based on type
  const getFileIcon = (type) => {
    switch (type) {
      case 'folder': return <span className="material-symbols-outlined text-yellow-500 text-[28px] fill-1">folder</span>;
      case 'pdf': return <span className="material-symbols-outlined text-red-500 text-[28px]">picture_as_pdf</span>;
      case 'doc': return <span className="material-symbols-outlined text-blue-500 text-[28px]">description</span>;
      case 'image': return <span className="material-symbols-outlined text-purple-500 text-[28px]">image</span>;
      default: return <span className="material-symbols-outlined text-gray-400 text-[28px]">insert_drive_file</span>;
    }
  };

  return (
    <div className="flex h-full -m-6 lg:-m-8 overflow-hidden border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. Secondary Sidebar: Folder Tree (Visible on large screens) */}
      <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#1a202c] border-r border-slate-200 dark:border-slate-800 overflow-y-auto pt-4 pb-4">
        <div className="px-4 pb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Folders</p>
        </div>
        <div className="flex flex-col gap-1 px-2">
          {/* Active Item */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary cursor-pointer">
            <span className="material-symbols-outlined text-[20px] fill-1">folder</span>
            <span className="text-sm font-medium">All Files</span>
          </div>
          
          {/* Expanded Parent */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
              <span className="material-symbols-outlined text-[20px]">folder_shared</span>
              <span className="text-sm font-medium text-slate-900 dark:text-gray-200">Acme Corp</span>
            </div>
            {/* Nested Items */}
            <div className="pl-9 flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[18px]">folder</span>
                <span className="text-sm text-primary font-medium">Merger 2023</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[18px]">folder</span>
                <span className="text-sm">Litigation A</span>
              </div>
            </div>
          </div>

          {/* Other Items */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-gray-400">
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_right</span>
            <span className="material-symbols-outlined text-[20px]">folder_shared</span>
            <span className="text-sm font-medium text-slate-900 dark:text-gray-200">John Doe</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-slate-600 dark:text-gray-400 mt-2">
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span className="text-sm font-medium text-slate-900 dark:text-gray-200">Internal Docs</span>
          </div>
        </div>
      </div>

      {/* 2. Main File Area */}
      <div className="flex flex-col flex-1 bg-white dark:bg-[#111621] overflow-hidden">
        
        {/* Breadcrumbs & Toolbar */}
        <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c]">
          <div className="px-6 py-4 flex items-center text-sm">
            <span className="text-slate-500 hover:text-primary cursor-pointer">Repository</span>
            <span className="material-symbols-outlined text-slate-400 text-base mx-1">chevron_right</span>
            <span className="text-slate-500 hover:text-primary cursor-pointer">Acme Corp</span>
            <span className="material-symbols-outlined text-slate-400 text-base mx-1">chevron_right</span>
            <span className="font-semibold text-slate-900 dark:text-white">Merger 2023</span>
          </div>
          
          <div className="px-6 pb-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center h-10 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-[20px] mr-2">upload_file</span>
                <span>Upload Document</span>
              </button>
              <button className="flex items-center justify-center h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px] mr-2">create_new_folder</span>
                <span>New Folder</span>
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button className="p-1.5 rounded bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">list</span>
              </button>
              <button className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 text-slate-500 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* File List Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fc] dark:bg-[#0f131a]">
          
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 mb-2">
            <div className="col-span-6 md:col-span-5 pl-8">Name</div>
            <div className="col-span-3 hidden md:block">Date Modified</div>
            <div className="col-span-2 hidden md:block">Size</div>
            <div className="col-span-3 md:col-span-2 text-right">Status</div>
          </div>

          {/* File Items Loop */}
          {loading && <p>Loading documents...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="flex flex-col gap-1">
              {files.map((file) => (
                <div key={file.id} className="group relative flex items-center bg-white dark:bg-[#1a202c] border border-transparent hover:border-primary/30 rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-slate-100 dark:bg-slate-700 dark:border-slate-600" type="checkbox"/>
                  </div>
                  <div className="grid grid-cols-12 gap-4 w-full items-center">
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3 pl-8">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</span>
                    </div>
                    <div className="col-span-3 hidden md:block text-sm text-slate-500">{file.date}</div>
                    <div className="col-span-2 hidden md:block text-sm text-slate-500">{file.size}</div>
                    <div className="col-span-3 md:col-span-2 flex justify-end items-center gap-2">
                      {file.status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                          ${file.status === 'Signed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                            file.status === 'Draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {file.status}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-[#1a202c] shadow-sm rounded-md p-1 border border-slate-100 dark:border-slate-700">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">download</span></button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">share</span></button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a202c] px-6 py-10 transition-colors hover:bg-slate-50 dark:hover:bg-[#232936] cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3">
                <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-bold text-center">Drag and drop files here</p>
              <p className="text-slate-500 text-sm font-normal text-center">or select files from your computer</p>
            </div>
            <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-gray-200 text-sm font-bold transition-colors">
              Browse Files
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DocumentRepository;