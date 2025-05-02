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
      border: 2px dashed #aaa;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #f9f9f9, #fff);
      cursor: pointer;
      margin-bottom: 20px;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      user-select: none;
      font-family: 'Segoe UI', sans-serif;
      color: #444;
      position: relative;
      overflow: hidden;
    }

    .simple-drop-zone::before {
      content: '📁';
      font-size: 48px;
      display: block;
      margin-bottom: 10px;
      animation: float 2s ease-in-out infinite;
    }

    .simple-drop-zone.hover {
      background: #e6fbee;
      border-color: #30c96e;
      box-shadow: 0 0 10px rgba(48, 201, 110, 0.3);
    }

    .simple-drop-zone p {
      margin: 0;
      font-size: 16px;
      color: #555;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
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
