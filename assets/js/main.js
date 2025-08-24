document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.premo-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 1. Initial Page Load Animations ---
    const section1Img = document.querySelector('.section-1-img');
    const section1Bottom = document.querySelector('.section-1-bottom');

    if (navbar) {
        navbar.classList.add('animate-on-load');
        setTimeout(() => { navbar.classList.add('loaded'); }, 200);
    }
    if (section1Img) {
        setTimeout(() => { section1Img.classList.add('loaded'); }, 200);
    }
    if (section1Bottom) {
        setTimeout(() => { section1Bottom.classList.add('loaded'); }, 200);
    }

    // --- Word-by-Word Fade-In for Main Titles ---
    ['.section-3-main-title', '.section-4-main-title', '.section-7-main-title'].forEach(selector => {
        const mainTitle = document.querySelector(selector);
        if (mainTitle) {
            const textContent = mainTitle.innerHTML.replace(/<br\s*\/?>/gi, ' ##BR## ');
            const words = textContent.split(' ').filter(word => word.length > 0);
            
            mainTitle.innerHTML = ''; 

            words.forEach(word => {
                if (word === '##BR##') {
                    mainTitle.appendChild(document.createElement('br'));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word;
                    wordSpan.classList.add('fade-in-word');
                    mainTitle.appendChild(wordSpan);
                    mainTitle.appendChild(document.createTextNode(' '));
                }
            });

            const titleObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = mainTitle.querySelectorAll('.fade-in-word');
                        spans.forEach((span, index) => {
                            span.style.transitionDelay = `${index * 0.1}s`;
                            span.classList.add('visible');
                        });
                        observer.unobserve(mainTitle);
                    }
                });
            }, { threshold: 0.1 });

            titleObserver.observe(mainTitle);
        }
    });

    // --- 3. Staggered Phase Card Animation on Scroll ---
    const phasesGrid = document.querySelector('.section-3-phases-grid');
    const phaseCards = document.querySelectorAll('.phase-card');
    const steps = document.querySelectorAll('.section-3-step');

    if (phasesGrid && phaseCards.length > 0 && steps.length > 0) {
        const phaseObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationStagger = 600; // ms
                    const transitionDuration = 600; // ms, from CSS

                    phaseCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                            
                            steps.forEach(step => step.classList.remove('active'));
                            if (steps[index]) {
                                steps[index].classList.add('active');
                            }
                        }, index * animationStagger);
                    });

                    const totalAnimationTime = (phaseCards.length - 1) * animationStagger + transitionDuration;
                    setTimeout(() => {
                        steps.forEach(step => step.classList.remove('active'));
                    }, totalAnimationTime);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        phaseObserver.observe(phasesGrid);
    }

    // --- 4. Staggered Image Fade-In for Tech Stack & Brand Slider ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const imageContainerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const images = entry.target.querySelectorAll('img');
                const totalAnimationTime = 2000; // 4 seconds total animation for the group
                const staggerDelay = images.length > 0 ? totalAnimationTime / images.length : 0;

                images.forEach((img, index) => {
                    setTimeout(() => {
                        img.classList.add('visible');
                    }, index * staggerDelay);
                });
                observer.unobserve(entry.target); // Animate only once per container
            }
        });
    }, observerOptions);

    const techStackContainer = document.querySelector('.tech-stack-container');
    const brandSlider = document.querySelector('.brand-slider');

    if (techStackContainer) {
        imageContainerObserver.observe(techStackContainer);
    }
    if (brandSlider) {
        imageContainerObserver.observe(brandSlider);
    }

    // --- 5. Real-Time Clock (Philippine Time) ---
    const clockElement = document.querySelector('.nav-clock');

    function updateClock() {
        if (clockElement) {
            const options = {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const philippineTime = new Date().toLocaleTimeString('en-US', options);
            clockElement.textContent = philippineTime;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
    
    // --- Section 8 Sticky Title Observer ---
    const section8 = document.querySelector('.section-8');
    const stickyTitle = document.querySelector('.section-8-sticky-title');

    if (section8 && stickyTitle) {
        const section8Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyTitle.classList.add('hidden');
                } else {
                    stickyTitle.classList.remove('hidden');
                }
            });
        }, { threshold: 0.1 });

        section8Observer.observe(section8);
    }

    // --- Portfolio Observer ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    portfolioItems.forEach(item => {
        portfolioObserver.observe(item);
    });
    
    // --- KLly Carousel Functionality ---
    const kllyCarousel = document.querySelector('.klly-carousel');
    if (kllyCarousel) {
        const slides = kllyCarousel.querySelectorAll('.carousel-slide');
        const dots = kllyCarousel.querySelectorAll('.dot');
        const nextBtn = kllyCarousel.querySelector('.next-btn');
        const titleStatic = kllyCarousel.querySelector('.carousel-title-static');
        const subtitleStatic = kllyCarousel.querySelector('.carousel-subtitle-static');
        const container = kllyCarousel.querySelector('.carousel-container');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval = null;

        function showSlide(index) {
            // Slide the container
            if (container) {
                container.style.transform = `translateX(-${index * 100}%)`;
            }
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            // Update static caption
            const caption = slides[index].querySelector('.carousel-caption');
            if (caption && titleStatic && subtitleStatic) {
                const title = caption.querySelector('.carousel-title');
                const subtitle = caption.querySelector('.carousel-subtitle');
                titleStatic.textContent = title ? title.textContent : '';
                subtitleStatic.textContent = subtitle ? subtitle.textContent : '';
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        // Event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-slide only on hover
        function startAutoSlide() {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
        }
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        kllyCarousel.addEventListener('mouseenter', startAutoSlide);
        kllyCarousel.addEventListener('mouseleave', stopAutoSlide);

        // Initialize first slide
        showSlide(0);
    }
});

document.addEventListener('DOMContentLoaded', function () {
  const section6 = document.getElementById('section-6');
  const cards = document.querySelectorAll('.services-dropdown-list .service-dropdown-card');

  if (section6 && cards.length > 0) {
    const observer = new window.IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add('animated');
              }, 600 * i);
            });
            observer.unobserve(section6); // Only trigger once
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section6);
  }
});

// Section-4 Carousel Logic
function setupCarousel(carouselSelector, dotSelector, arrowSelector) {
  const carousel = document.querySelector(carouselSelector);
  const images = carousel.querySelectorAll('.carousel-image');
  const dots = document.querySelectorAll(dotSelector + ' .dot');
  const arrow = document.querySelector(arrowSelector);

  function showAt(idx) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === idx);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      showAt(idx);
    });
  });

  if (arrow) {
    arrow.addEventListener('click', () => {
      let current = 0;
      images.forEach((img, i) => {
        if (img.classList.contains('active')) current = i;
      });
      const next = (current + 1) % images.length;
      showAt(next);
    });
  }
}

// --- Modal logic ---
const modal = document.getElementById('image-modal');
const modalImg = document.querySelector('.image-modal-img');
const modalOverlay = document.querySelector('.image-modal-overlay');
const modalArrowLeft = document.querySelector('.image-modal-arrow-left');
const modalArrowRight = document.querySelector('.image-modal-arrow-right');

// Add a second image for sliding effect
let modalImg2 = null;
if (!document.querySelector('.image-modal-img2')) {
  modalImg2 = document.createElement('img');
  modalImg2.className = 'image-modal-img image-modal-img2';
  modalImg2.style.position = 'absolute';
  modalImg2.style.top = '0';
  modalImg2.style.left = '0';
  modalImg2.style.width = '100%';
  modalImg2.style.height = '100%';
  modalImg2.style.pointerEvents = 'none';
  modalImg2.style.zIndex = '2';
  modalImg.parentNode.insertBefore(modalImg2, modalImg);
} else {
  modalImg2 = document.querySelector('.image-modal-img2');
}
modalImg2.style.display = 'none';

let currentCarouselImages = [];
let currentImageIndex = 0;

// Open modal on carousel image click
document.querySelectorAll('.carousel-image').forEach(img => {
  img.addEventListener('click', function(e) {
    const carousel = this.closest('.carousel-image-wrapper');
    if (!carousel) return;
    currentCarouselImages = Array.from(carousel.querySelectorAll('.carousel-image'));
    currentImageIndex = currentCarouselImages.indexOf(this);
    showModalImage(currentImageIndex, 'none');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateModalArrows();
  });
});

// Add click event to carousel arrows to open modal at next image
  document.querySelectorAll('.carousel-arrow').forEach(arrowBtn => {
    arrowBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Find the carousel wrapper
      const carousel = this.closest('.carousel-card')?.querySelector('.carousel-image-wrapper');
      if (!carousel) return;
      const images = Array.from(carousel.querySelectorAll('.carousel-image'));
      // Find the currently active image
      let currentIdx = images.findIndex(img => img.classList.contains('active'));
      // Go to next image (loop)
      let nextIdx = (currentIdx + 1) % images.length;
      currentCarouselImages = images;
      currentImageIndex = nextIdx;
      showModalImage(currentImageIndex, 'none');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateModalArrows();
    });
  });

function showModalImage(idx, direction) {
  if (!currentCarouselImages.length) return;
  const img = currentCarouselImages[idx];
  if (!img) return;
  if (direction === 'left' || direction === 'right') {
    // Prepare sliding
    modalImg2.src = modalImg.src;
    modalImg2.style.aspectRatio = modalImg.style.aspectRatio;
    modalImg2.style.display = '';
    modalImg2.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
    modalImg.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
    // Outgoing image slides out
    modalImg2.classList.add(direction === 'left' ? 'slide-out-right' : 'slide-out-left');
    // Incoming image slides in
    modalImg.src = img.src;
    modalImg.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
    modalImg.classList.add(direction === 'left' ? 'slide-in-left' : 'slide-in-right');
    // After animation, clean up
    setTimeout(() => {
      modalImg2.style.display = 'none';
      modalImg2.classList.remove('slide-out-left', 'slide-out-right');
      modalImg.classList.remove('slide-in-left', 'slide-in-right');
    }, 400);
  } else {
    // No slide, just show
    modalImg.src = img.src;
    modalImg.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
    modalImg.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
    modalImg2.style.display = 'none';
  }
}

function updateModalArrows() {
  if (currentCarouselImages.length > 1) {
    modalArrowLeft.style.display = '';
    modalArrowRight.style.display = '';
  } else {
    modalArrowLeft.style.display = 'none';
    modalArrowRight.style.display = 'none';
  }
}

modalArrowLeft.addEventListener('click', function(e) {
  e.stopPropagation();
  if (!currentCarouselImages.length) return;
  const prevIndex = (currentImageIndex - 1 + currentCarouselImages.length) % currentCarouselImages.length;
  showModalImage(prevIndex, 'left');
  currentImageIndex = prevIndex;
});
modalArrowRight.addEventListener('click', function(e) {
  e.stopPropagation();
  if (!currentCarouselImages.length) return;
  const nextIndex = (currentImageIndex + 1) % currentCarouselImages.length;
  showModalImage(nextIndex, 'right');
  currentImageIndex = nextIndex;
});

function closeModal() {
  modal.classList.remove('open');
  setTimeout(() => {
    modalImg.src = '';
    document.body.style.overflow = '';
    currentCarouselImages = [];
    currentImageIndex = 0;
    modalImg2.style.display = 'none';
  }, 400);
}
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

    // --- Section 5 Parallax Image Effect ---
    const section5 = document.querySelector('.section-5');
    const parallaxImg = document.querySelector('.section-5-parallax-img');
    if (section5 && parallaxImg) {
        let ticking = false;
        let lastScrollY = window.scrollY;
        // Helper to get element's offset from top of viewport
        function getOffsetTop(elem) {
            const rect = elem.getBoundingClientRect();
            return rect.top + window.scrollY;
        }
        function updateParallax() {
            const sectionTop = getOffsetTop(section5);
            const sectionHeight = section5.offsetHeight;
            const imgHeight = parallaxImg.offsetHeight;
            const scrollY = window.scrollY;
            const windowH = window.innerHeight;
            // When section-5 is in viewport
            const start = sectionTop - windowH * 0.5;
            const end = sectionTop + sectionHeight - windowH * 0.2;
            if (scrollY > start && scrollY < end) {
                // Calculate progress (0 = just entered, 1 = fully passed)
                const progress = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
                // Parallax: translateY from 60px to 0, scale from 1.15 to 1
                const translateY = 60 * (1 - progress);
                const scale = 1.15 - 0.15 * progress;
                parallaxImg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                parallaxImg.style.opacity = 0.92 + 0.08 * progress;
                parallaxImg.classList.add('parallax-visible');
            } else {
                // Hide/zoom in when out of view
                if (scrollY <= start) {
                    parallaxImg.style.transform = 'scale(1.15) translateY(60px)';
                    parallaxImg.style.opacity = 0.92;
                } else {
                    parallaxImg.style.transform = 'scale(1.25) translateY(-60px)';
                    parallaxImg.style.opacity = 0.7;
                }
                parallaxImg.classList.remove('parallax-visible');
            }
            ticking = false;
        }
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onScroll);
        // Initial state
        updateParallax();
    }

// --- Section 5 Title Parallax Shrink/Expand Effect ---
(function() {
    const section5 = document.querySelector('.section-5');
    const title = document.querySelector('.section-5-title');
    if (!section5 || !title) return;

    function handleParallaxTitle() {
        const rect = section5.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Only apply effect when section 5 is in the viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
            // Calculate scroll progress within section 5 (0 at top, 1 at bottom)
            const sectionHeight = rect.height;
            const scrollY = Math.min(Math.max(windowHeight - rect.top, 0), sectionHeight);
            const progress = scrollY / sectionHeight;
            // Scale from 1 (fully expanded) to 0.7 (shrink) as you scroll down
            const minScale = 0.7;
            const maxScale = 1;
            const scale = maxScale - (maxScale - minScale) * progress;
            title.style.transform = `scale(${scale})`;
            title.style.transition = "transform 0.1s linear";
            title.style.transformOrigin = "center top";
        } else {
            // Reset when out of view
            title.style.transform = "scale(1)";
            title.style.transition = "transform 0.3s";
        }
    }
    window.addEventListener("scroll", handleParallaxTitle, { passive: true });
    window.addEventListener("resize", handleParallaxTitle);
    handleParallaxTitle(); // Initial call
})();

// --- Section 5 Animated Image Reveal and Bio Text ---
(function() {
  const section5 = document.querySelector('.section-5');
  const reveal = document.querySelector('.section-5-anim-reveal');
  const glow = document.querySelector('.section-5-anim-glow');
  const bioContainer = document.querySelector('.section-5-bio-container');
  const bioText = document.querySelector('.section-5-bio-text');
  const imageContainer = document.querySelector('.section-5-anim-image-container');
  let animated = false;

  if (section5 && reveal && glow && bioContainer && bioText && imageContainer) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            reveal.style.animationPlayState = 'running';
            glow.style.animationPlayState = 'running';
            animated = true;

            // After reveal animation, add revealed class for card animation
            setTimeout(() => {
              imageContainer.classList.add('revealed');
            }, 2200); // Slightly before reveal animation ends

            // After card animation, remove glow from image
            setTimeout(() => {
              imageContainer.classList.add('no-glow');
            }, 2800); // Card animation delay + buffer

            // After card animation, show bio text with glow
            setTimeout(() => {
              bioContainer.classList.add('revealing');

              // Animate paragraph word by word
              const text = bioText.textContent.trim();
              bioText.innerHTML = '';
              const words = text.split(' ');
              words.forEach((word, i) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                bioText.appendChild(span);
                setTimeout(() => {
                  span.classList.add('visible');
                  span.classList.add('glow-reveal-word');
                  setTimeout(() => {
                    span.classList.remove('glow-reveal-word');
                  }, 500); // Match the CSS animation duration
                }, 60 * i);
              });

              // Add glow effect to bio text
              bioText.classList.add('glow-reveal');

              // After text animation completes, remove glow and fade out image glow
              const totalTextTime = words.length * 60 + 1000; // Total time for text animation + buffer
              setTimeout(() => {
                bioText.classList.remove('glow-reveal');
                bioContainer.classList.remove('revealing');
                bioContainer.classList.add('visible');
                
                // Fade out the image glow after text reveal is complete
                if (glow) {
                  glow.classList.add('fade-out'); // Smooth fade out the glow effect
                }
                // Show the resume button with fade-in blinking effect
                bioContainer.classList.add('show-resume-btn');
              }, totalTextTime);
            }, 3200); // Card animation delay + text delay
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(section5);
  }
})();

// Section 6 Services Dropdown Accordion
(function() {
  const serviceCards = document.querySelectorAll('.service-dropdown-card');
  serviceCards.forEach(card => {
    const btn = card.querySelector('.service-dropdown-toggle');
    btn.addEventListener('click', function() {
      const isOpen = card.classList.contains('open');
      // Close all
      serviceCards.forEach(c => {
        c.classList.remove('open');
        c.querySelector('.service-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
      // Open this one if it was not open
      if (!isOpen) {
        card.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

document.addEventListener('DOMContentLoaded', function() {
  // Section 8 Sticky Title Visibility and Experience Items Animation
  const section8 = document.querySelector('.section-8');
  const stickyTitle = document.querySelector('.section-8-sticky-title');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stickyTitle.classList.remove('hidden');
      } else {
        stickyTitle.classList.add('hidden');
      }
    });
  }, observerOptions);

  const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        experienceObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  if (section8 && stickyTitle) {
    sectionObserver.observe(section8);
    // Observe all experience items for animation
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
      experienceObserver.observe(item);
    });
  }

  // GSAP Parallax/Trailing for Section 7
  const parallaxTitle = document.querySelector('.section-7-parallax-title');
  const section7 = document.querySelector('.section-7');
  let effectDone = false;

  if (parallaxTitle && section7 && window.gsap && window.ScrollTrigger) {
    // Lock scroll initially for Section 7
    let scrollLocked = false;
    function lockScroll() {
      if (!scrollLocked) {
        document.body.style.overflow = 'hidden';
        scrollLocked = true;
      }
    }
    function unlockScroll() {
      document.body.style.overflow = '';
      scrollLocked = false;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: section7,
      start: "top 70%",
      onEnter: () => {
        if (!effectDone) {
          lockScroll();
          gsap.fromTo(
            parallaxTitle,
            { opacity: 0, y: 80, scale: 1.2, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.out",
              onComplete: () => {
                // trailing effect: split text and animate each letter
                const text = parallaxTitle.textContent;
                parallaxTitle.innerHTML = text.split("").map((char, i) =>
                  `<span class="trail-letter" style="display:inline-block;opacity:0;transform:translateY(40px)">${char === " " ? "&nbsp;" : char}</span>`
                ).join("");
                const letters = parallaxTitle.querySelectorAll('.trail-letter');
                gsap.to(letters, {
                  opacity: 1,
                  y: 0,
                  stagger: 0.04,
                  duration: 0.7,
                  ease: "power2.out",
                  onComplete: () => {
                    unlockScroll();
                    effectDone = true;
                  }
                });
              }
            }
          );
        }
      }
    });
  }
});

    // --- Section 7 Carousel Logic ---
    const carouselTrack = document.querySelector('.section-7-carousel-track');
    const carouselItems = document.querySelectorAll('.section-7-image-item');
    const carouselDesc = document.getElementById('section-7-image-desc');
    const leftArrow = document.querySelector('.section-7-carousel-arrow.left');
    const rightArrow = document.querySelector('.section-7-carousel-arrow.right');
    let carouselIndex = 0;
    function updateCarousel() {
        carouselItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === carouselIndex);
        });
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${carouselIndex * 280}px)`;
        }
        if (carouselDesc) {
            carouselDesc.textContent = carouselItems[carouselIndex].getAttribute('data-desc') || '';
        }
        if (leftArrow) leftArrow.disabled = carouselIndex === 0;
        if (rightArrow) rightArrow.disabled = carouselIndex === carouselItems.length - 1;
    }
    if (carouselItems.length) {
        updateCarousel();
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                if (carouselIndex > 0) {
                    carouselIndex--;
                    updateCarousel();
                }
            });
        }
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                if (carouselIndex < carouselItems.length - 1) {
                    carouselIndex++;
                    updateCarousel();
                }
            });
        }
    }

// Show Outline Box (Section 7)
function showOutlineBox(n) {
  const boxes = document.querySelectorAll('.section-7-outline-box');
  const details = document.querySelectorAll('.section-7-outline-detail');
  const clickedBox = boxes[n - 1];
  const isActive = clickedBox.classList.contains('active');

  // Remove .active from all boxes
  boxes.forEach(box => box.classList.remove('active'));
  // Hide all details
  details.forEach(detail => detail.style.display = 'none');

  if (!isActive) {
    // Activate the clicked box
    clickedBox.classList.add('active');
    // Show the corresponding detail
    const detail = document.querySelector('.section-7-outline-detail[data-box="' + n + '"]');
    if (detail) {
      detail.style.display = 'block';
      // Scroll to the details container
      const detailsContainer = document.getElementById('section-7-outline-details');
      if (detailsContainer) {
        detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  // If isActive, everything is now deactivated/hidden
}

// Section 7 Outline Boxes Slide Up Animation on Viewport
(function() {
  const outlineBoxes = document.querySelectorAll('.section-7-outline-box');
  const section7 = document.getElementById('section-7');
  let animated = false;
  if (section7 && outlineBoxes.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          outlineBoxes.forEach((box, i) => {
            setTimeout(() => {
              box.classList.add('animated');
              // Set first box as active and show its detail when animation starts
              if (i === 0) {
                box.classList.add('active');
                const details = document.querySelectorAll('.section-7-outline-detail');
                details.forEach(detail => detail.style.display = 'none');
                const detail = document.querySelector('.section-7-outline-detail[data-box="1"]');
                if (detail) detail.style.display = 'block';
              }
            }, i * 400);
          });
          animated = true;
          observer.unobserve(section7);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section7);
  }
})();



function smoothScrollToSection(targetSelector, duration = 1200) {
    const target = document.querySelector(targetSelector);
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Attach click events for both logo and back-to-top button
document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollToSection('.section-1');
});

document.querySelector('.nav-bar-logo').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollToSection('.section-1');
});

        function showCard() {
            const overlay = document.getElementById('cardOverlay');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function hideCard(event) {
            if (event && event.target.closest('.calling-card') && !event.target.classList.contains('close-btn')) {
                return;
            }
            
            const overlay = document.getElementById('cardOverlay');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Add keyboard support
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                hideCard();
            }
        });

        // Add subtle animation to the button
        document.addEventListener('mousemove', function(e) {
            const button = document.querySelector('.nav-contact');
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            if (distance < 100) {
                const strength = (100 - distance) / 100;
                button.style.transform = `translateX(${x * strength * 0.1}px) translateY(${y * strength * 0.1}px)`;
            } else {
                button.style.transform = 'translateX(0) translateY(0)';
            }
        });


function downloadResume() {
    // Check if file exists first
    fetch('assets/pdf/resume.pdf')
        .then(response => {
            if (response.ok) {
                const link = document.createElement('a');
                link.href = 'assets/pdf/resume.pdf';
                link.download = 'resume.pdf';
                link.click();
            } else {
                alert('Resume file not found. Please contact me directly.');
            }
        })
        .catch(() => {
            alert('Resume file not found. Please contact me directly.');
        });
}