// dragdrop.js

(function (global) {
  function initDragDrop(options) {
    const {
      container,
      onFile,
      accept = '.xls,.xlsx',
      placeholderText = '📁 Drag and Drop file here or click to upload',
    } = options || {};

    if (!container || typeof onFile !== 'function') {
      console.error('DragDrop: container and onFile function are required.');
      return;
    }

    // Create elements
    const dropZone = document.createElement('div');
    dropZone.className = 'simple-drop-zone';
    dropZone.textContent = placeholderText;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;
    fileInput.style.display = 'none';

    container.appendChild(dropZone);
    container.appendChild(fileInput);

    // Inject CSS once
    if (!document.getElementById('simple-drop-css')) {
      const style = document.createElement('style');
      style.id = 'simple-drop-css';
      style.textContent = `
        .simple-drop-zone {
          border: 2px dashed #888;
          padding: 20px;
          text-align: center;
          background: #f3f3f3;
          cursor: pointer;
          margin-bottom: 10px;
          transition: background 0.3s, border-color 0.3s;
          user-select: none;
        }
        .simple-drop-zone.hover {
          background: #e0ffe0;
          border-color: green;
        }
      `;
      document.head.appendChild(style);
    }

    // Event helpers
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function isAccepted(filename) {
      const extensions = accept.split(',').map((ext) => ext.trim().toLowerCase());
      return extensions.some((ext) => filename.toLowerCase().endsWith(ext));
    }

    // Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) =>
      dropZone.addEventListener(eventName, preventDefaults)
    );

    dropZone.addEventListener('dragenter', () => dropZone.classList.add('hover'));
    dropZone.addEventListener('dragover', () => dropZone.classList.add('hover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));

    dropZone.addEventListener('drop', function (e) {
      dropZone.classList.remove('hover');
      const file = e.dataTransfer.files[0];
      if (file && isAccepted(file.name)) {
        onFile(file);
      } else {
        alert('Invalid file type. Please drop a valid file.');
      }
    });

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file && isAccepted(file.name)) {
        onFile(file);
      } else {
        alert('Invalid file type. Please select a valid file.');
      }
    });
  }

  // Attach to global window
  global.initDragDrop = initDragDrop;
})(window);
