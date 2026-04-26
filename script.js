document.addEventListener('DOMContentLoaded', () => {
    // 1. Selection & Initialization
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const downloadBtn = document.getElementById('download-btn');

    let visibleItems = Array.from(galleryItems);
    let currentIndex = 0;

    /**
     * Updates the list of currently visible gallery items based on filters.
     * This ensures the lightbox navigation (next/prev) only cycles through visible images.
     */
    const updateVisibleItems = () => {
        visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hide') && getComputedStyle(item).display !== 'none'
        );
    };

    // 2. Filtering Logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                    
                    // Staggered fade in
                    setTimeout(() => {
                        item.classList.add('show');
                    }, index * 50); // 50ms interval between items
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                    setTimeout(() => {
                        if (item.classList.contains('hide')) {
                            item.style.display = 'none';
                        }
                    }, 400); 
                }
            });
            
            // Re-sync visible items for lightbox after short delay (filter animation)
            setTimeout(updateVisibleItems, 450);
        });
    });

    // 3. Lightbox Functionality
    const openLightbox = (index) => {
        currentIndex = index;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
        downloadBtn.href = img.src;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore background scroll
    };

    const navigate = (direction) => {
        if (visibleItems.length <= 1) return;

        // Apply fade-out
        lightboxImg.style.opacity = '0';
        lightboxCaption.style.opacity = '0';

        setTimeout(() => {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % visibleItems.length;
            } else {
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            }

            const item = visibleItems[currentIndex];
            const img = item.querySelector('img');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            downloadBtn.href = img.src;
            
            // Fade-in after source update
            lightboxImg.style.opacity = '1';
            lightboxCaption.style.opacity = '1';
        }, 150);
    };

    // 4. Global Event Listeners
    
    // Open Lightbox on item click
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = visibleItems.indexOf(item);
            if (index !== -1) openLightbox(index);
        });
    });

    // Lightbox Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => navigate('next'));
    prevBtn.addEventListener('click', () => navigate('prev'));

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowRight': navigate('next'); break;
            case 'ArrowLeft': navigate('prev'); break;
        }
    });

    // Initial sync
    updateVisibleItems();
});
