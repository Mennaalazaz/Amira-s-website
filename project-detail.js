// Project Detail Page Script - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    
    // Get project ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));
    
    if (!projectId || typeof projects === 'undefined') {
        window.location.href = 'index.html';
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        window.location.href = 'index.html';
        return;
    }
    
    populateProjectDetails(project);
});

// ========== FALLBACK IMAGE GENERATOR ==========
// Creates a data URI fallback image instead of relying on external services
function createFallbackImage(text, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = '#c9a961';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL();
}

function populateProjectDetails(project) {
    
    // ========== HERO SECTION ==========
    const heroImage = document.getElementById('projectHeroImage');
    heroImage.src = project.image;
    heroImage.alt = project.title;
    
    // Add error handling for images - use data URI fallback
    heroImage.onerror = function() {
        console.warn('Hero image failed to load:', project.image);
        this.src = createFallbackImage(project.title, 1920, 1080);
    };
    
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectCategory').textContent = project.category;
    document.title = `${project.title} - Amira Alazaz`;
    
    // ========== PROJECT OVERVIEW ==========
    document.getElementById('projectDescription').textContent = project.fullDescription;
    
    // ========== PROJECT SPECIFICATIONS ==========
    document.getElementById('projectAssignedBy').textContent = project.Assigned_By;
    document.getElementById('projectLocation').textContent = project.location;
    document.getElementById('projectYear').textContent = project.year;
    document.getElementById('projectSoftware').textContent = project.software_used;
    
    // ========== DESIGN CONCEPT ==========
    document.getElementById('designConcept').textContent = project.concept;
    
    // ========== KEY FEATURES ==========
    const featuresList = document.getElementById('keyFeatures');
    featuresList.innerHTML = '';
    
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        featuresList.appendChild(li);
    });
    
    animateList(featuresList.children);
    
    // ========== CLIENT REQUIREMENTS ==========
    const requirementsList = document.getElementById('clientRequirements');
    requirementsList.innerHTML = '';
    
    project.requirements.forEach(requirement => {
        const li = document.createElement('li');
        li.textContent = requirement;
        requirementsList.appendChild(li);
    });
    
    // ========== DESIGN CHALLENGES ==========
    const challengesList = document.getElementById('designChallenges');
    challengesList.innerHTML = '';
    
    project.challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        challengesList.appendChild(li);
    });
    
    // ========== MATERIALS ==========
    const materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = '';
    
    project.materials.forEach(material => {
        const li = document.createElement('li');
        li.textContent = material;
        materialsList.appendChild(li);
    });
    
    // ========== COLOR PALETTE ==========
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';
    
    project.colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.textContent = color.name;
        
        const rgb = hexToRgb(color.hex);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        swatch.style.color = brightness > 128 ? '#000000' : '#ffffff';
        
        colorPalette.appendChild(swatch);
    });
    
    // ========== PROJECT GALLERY ==========
    const gallery = document.getElementById('projectGallery');
    gallery.innerHTML = '';
    
    project.gallery.forEach((imageUrl, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.opacity = '0';
        galleryItem.style.transform = 'scale(0.95)';
        galleryItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${project.title} - Image ${index + 1}`;
        
        // Add error handling for gallery images
        img.onerror = function() {
            console.warn('Gallery image failed to load:', imageUrl);
            this.src = createFallbackImage(`Image ${index + 1}`, 800, 600);
        };
        
        galleryItem.appendChild(img);
        gallery.appendChild(galleryItem);
    });
    
    animateGallery();
    
    // Store gallery data globally for modal navigation
    window.currentGallery = project.gallery;
    window.currentProjectTitle = project.title;
}

// ========== ANIMATION FUNCTIONS ==========
function animateList(items) {
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.style.transition = 'all 0.5s ease';
        }, index * 100);
    });
}

function animateGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    galleryItems.forEach(item => observer.observe(item));
}

// ========== UTILITY FUNCTIONS ==========
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

// ========== SCROLL ANIMATIONS ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.project-hero-image img');
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========== IMAGE MODAL WITH SWIPE NAVIGATION ==========
let currentModalIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('click', function(e) {
    if (e.target.closest('.gallery-item img')) {
        const galleryItem = e.target.closest('.gallery-item');
        const index = parseInt(galleryItem.dataset.index);
        currentModalIndex = index;
        openImageModal(index);
    }
});

function openImageModal(index) {
    if (!window.currentGallery || window.currentGallery.length === 0) return;
    
    currentModalIndex = index;
    const totalImages = window.currentGallery.length;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.id = 'modalImgContainer';
    imgContainer.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: pan-y pinch-zoom;
    `;
    
    // Create main image
    const modalImg = document.createElement('img');
    modalImg.id = 'modalImage';
    modalImg.src = window.currentGallery[index];
    modalImg.alt = `${window.currentProjectTitle} - Image ${index + 1}`;
    modalImg.style.cssText = `
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        user-select: none;
        -webkit-user-drag: none;
    `;
    
    // Prevent image load errors
    modalImg.onerror = function() {
        this.src = createFallbackImage(`Image ${currentModalIndex + 1}`, 800, 600);
    };
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'modal-close-btn';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: transparent;
        border: none;
        color: white;
        font-size: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10001;
        font-weight: 300;
        line-height: 1;
        padding: 0;
        width: 50px;
        height: 50px;
    `;
    
    // Create left arrow (optional - can be hidden for swipe-only)
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '&#8249;';
    leftArrow.className = 'modal-nav-btn modal-nav-left';
    leftArrow.style.cssText = `
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.6);
        font-size: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10001;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 300;
        line-height: 1;
        padding: 0;
        opacity: 0.3;
    `;
    
    // Create right arrow (optional - can be hidden for swipe-only)
    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '&#8250;';
    rightArrow.className = 'modal-nav-btn modal-nav-right';
    rightArrow.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.6);
        font-size: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10001;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 300;
        line-height: 1;
        padding: 0;
        opacity: 0.3;
    `;
    
    // Create image counter
    const counter = document.createElement('div');
    counter.id = 'imageCounter';
    counter.style.cssText = `
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 16px;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px 16px;
        border-radius: 20px;
        z-index: 10001;
    `;
    counter.textContent = `${index + 1} / ${totalImages}`;
    
    // Hover effects for buttons
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.color = '#c9a961';
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.color = 'white';
        closeBtn.style.transform = 'scale(1)';
    });
    
    leftArrow.addEventListener('mouseover', () => {
        leftArrow.style.background = 'rgba(201, 169, 97, 0.8)';
        leftArrow.style.borderColor = '#c9a961';
        leftArrow.style.color = 'white';
        leftArrow.style.opacity = '1';
        leftArrow.style.transform = 'translateY(-50%) scale(1.1)';
    });
    
    leftArrow.addEventListener('mouseout', () => {
        leftArrow.style.background = 'rgba(255, 255, 255, 0.05)';
        leftArrow.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        leftArrow.style.color = 'rgba(255, 255, 255, 0.6)';
        leftArrow.style.opacity = '0.3';
        leftArrow.style.transform = 'translateY(-50%) scale(1)';
    });
    
    rightArrow.addEventListener('mouseover', () => {
        rightArrow.style.background = 'rgba(201, 169, 97, 0.8)';
        rightArrow.style.borderColor = '#c9a961';
        rightArrow.style.color = 'white';
        rightArrow.style.opacity = '1';
        rightArrow.style.transform = 'translateY(-50%) scale(1.1)';
    });
    
    rightArrow.addEventListener('mouseout', () => {
        rightArrow.style.background = 'rgba(255, 255, 255, 0.05)';
        rightArrow.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        rightArrow.style.color = 'rgba(255, 255, 255, 0.6)';
        rightArrow.style.opacity = '0.3';
        rightArrow.style.transform = 'translateY(-50%) scale(1)';
    });
    
    // ========== SWIPE/TOUCH NAVIGATION ==========
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }
    
    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const verticalThreshold = 100; // Maximum vertical movement to be considered horizontal swipe
        
        const horizontalDiff = touchEndX - touchStartX;
        const verticalDiff = Math.abs(touchEndY - touchStartY);
        
        // Only trigger if the swipe is mostly horizontal
        if (verticalDiff < verticalThreshold) {
            if (horizontalDiff > swipeThreshold) {
                // Swipe right - previous image
                showPreviousImage();
            } else if (horizontalDiff < -swipeThreshold) {
                // Swipe left - next image
                showNextImage();
            }
        }
    }
    
    // Add touch event listeners to the image container
    imgContainer.addEventListener('touchstart', handleTouchStart, false);
    imgContainer.addEventListener('touchend', handleTouchEnd, false);
    
    // Navigation functions
    function showPreviousImage() {
        currentModalIndex = (currentModalIndex - 1 + totalImages) % totalImages;
        updateModalImage();
    }
    
    function showNextImage() {
        currentModalIndex = (currentModalIndex + 1) % totalImages;
        updateModalImage();
    }
    
    function updateModalImage() {
        const img = document.getElementById('modalImage');
        const counter = document.getElementById('imageCounter');
        
        // Fade out
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            img.src = window.currentGallery[currentModalIndex];
            img.alt = `${window.currentProjectTitle} - Image ${currentModalIndex + 1}`;
            counter.textContent = `${currentModalIndex + 1} / ${totalImages}`;
            
            // Handle image load error
            img.onerror = function() {
                this.src = createFallbackImage(`Image ${currentModalIndex + 1}`, 800, 600);
            };
            
            // Fade in
            img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Event listeners
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
    
    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });
    
    // Close modal function
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    // Click on background to close
    modal.addEventListener('click', closeModal);
    
    // Prevent closing when clicking on image or buttons
    modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    imgContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Keyboard navigation
    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Assemble modal
    imgContainer.appendChild(modalImg);
    modal.appendChild(imgContainer);
    modal.appendChild(closeBtn);
    modal.appendChild(leftArrow);
    modal.appendChild(rightArrow);
    modal.appendChild(counter);
    document.body.appendChild(modal);
    
    // Hide arrows if only one image
    if (totalImages <= 1) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

// ========== MODAL ANIMATIONS STYLES ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
        .modal-close-btn {
            top: 10px !important;
            right: 10px !important;
            font-size: 40px !important;
            width: 40px !important;
            height: 40px !important;
        }
        
        /* Make arrows even more subtle on mobile since swipe is primary */
        .modal-nav-btn {
            width: 40px !important;
            height: 40px !important;
            font-size: 40px !important;
            opacity: 0.15 !important;
        }
        
        .modal-nav-left {
            left: 10px !important;
        }
        
        .modal-nav-right {
            right: 10px !important;
        }
        
        #imageCounter {
            bottom: 15px !important;
            font-size: 14px !important;
            padding: 6px 12px !important;
        }
    }
    
    /* Desktop - show arrows more prominently on hover */
    @media (min-width: 769px) {
        .modal-nav-btn:hover {
            opacity: 1 !important;
        }
    }
`;
document.head.appendChild(style);