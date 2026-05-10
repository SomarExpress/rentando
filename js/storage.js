// ==========================================================
// UTILIDADES DE STORAGE - Subir archivos a Supabase
// ==========================================================

// Validar archivo de imagen
function validateImageFile(file, maxSizeMB = 5) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes (JPG, PNG, WEBP)' };
  }
  
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `La imagen no puede pesar más de ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}

// Validar archivo (PDF o imagen)
function validateDocumentFile(file, maxSizeMB = 10) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formatos permitidos: JPG, PNG, WEBP, PDF' };
  }
  
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `El archivo no puede pesar más de ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}

// Generar nombre único de archivo
function generateFileName(userId, originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop().toLowerCase();
  return `${userId}/${timestamp}-${random}.${ext}`;
}

// Subir archivo a Supabase Storage
async function uploadFile(bucket, file, userId, customPath = null) {
  try {
    const fileName = customPath || generateFileName(userId, file.name);
    
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { 
      success: true, 
      path: fileName,
      url: publicUrl 
    };
  } catch (err) {
    console.error('Error en uploadFile:', err);
    return { success: false, error: 'Error inesperado al subir archivo' };
  }
}

// Eliminar archivo de Storage
async function deleteFile(bucket, path) {
  try {
    const { error } = await supabaseClient.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error eliminando:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error en deleteFile:', err);
    return false;
  }
}

// Helper: Formato de tamaño legible
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Helper: Renderizar zona de upload
function setupFileUpload(elementId, onFileSelected, options = {}) {
  const {
    accept = 'image/*',
    maxSizeMB = 5,
    label = 'Click o arrastra una imagen aquí',
    hint = 'JPG, PNG o WEBP (máx 5MB)',
    isDocument = false
  } = options;

  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = `
    <div class="upload-area" id="${elementId}-area">
      <input type="file" 
             class="upload-input" 
             id="${elementId}-input"
             accept="${accept}">
      <i data-lucide="upload-cloud" class="upload-icon"></i>
      <div class="upload-text">${label}</div>
      <div class="upload-hint">${hint}</div>
    </div>
    <div id="${elementId}-preview"></div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();

  const input = document.getElementById(elementId + '-input');
  const area = document.getElementById(elementId + '-area');
  const preview = document.getElementById(elementId + '-preview');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar
    const validation = isDocument 
      ? validateDocumentFile(file, maxSizeMB)
      : validateImageFile(file, maxSizeMB);
      
    if (!validation.valid) {
      alert(validation.error);
      input.value = '';
      return;
    }

    // Mostrar preview
    showFilePreview(file, preview, area, () => {
      input.value = '';
      preview.innerHTML = '';
      area.classList.remove('has-file');
      onFileSelected(null);
    });

    area.classList.add('has-file');
    onFileSelected(file);
  });
}

function showFilePreview(file, previewEl, areaEl, onRemove) {
  const isImage = file.type.startsWith('image/');
  
  if (isImage) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewEl.innerHTML = `
        <div class="upload-preview">
          <img src="${e.target.result}" class="upload-preview-img" alt="">
          <div class="upload-preview-info">
            <div class="upload-preview-name">${file.name}</div>
            <div class="upload-preview-size">${formatFileSize(file.size)}</div>
          </div>
          <button type="button" class="upload-remove" id="remove-${Date.now()}">
            <i data-lucide="x" style="width:18px;height:18px"></i>
          </button>
        </div>
      `;
      lucide.createIcons();
      const btn = previewEl.querySelector('.upload-remove');
      btn.addEventListener('click', onRemove);
    };
    reader.readAsDataURL(file);
  } else {
    // PDF u otro
    previewEl.innerHTML = `
      <div class="upload-preview">
        <div class="upload-preview-img" style="background:var(--primary-50);display:flex;align-items:center;justify-content:center;color:var(--primary)">
          <i data-lucide="file-text" style="width:24px;height:24px"></i>
        </div>
        <div class="upload-preview-info">
          <div class="upload-preview-name">${file.name}</div>
          <div class="upload-preview-size">${formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="upload-remove" id="remove-${Date.now()}">
          <i data-lucide="x" style="width:18px;height:18px"></i>
        </button>
      </div>
    `;
    lucide.createIcons();
    const btn = previewEl.querySelector('.upload-remove');
    btn.addEventListener('click', onRemove);
  }
}

// Helper: Generar WhatsApp URL
function getWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('504') ? cleanPhone : '504' + cleanPhone;
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${fullPhone}?text=${encodedMsg}`;
}
