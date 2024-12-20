// src/utils/scrollLock.ts

let scrollPosition = 0;

export const lockScroll = () => {
  // Only store position and lock if not already locked
  if (document.body.style.position !== 'fixed') {
    scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    // Prevent content shift
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  }
};

export const unlockScroll = () => {
  // Only unlock if currently locked
  if (document.body.style.position === 'fixed') {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
    // Reset stored position
    scrollPosition = 0;
  }
};

// New utility to force scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
};
