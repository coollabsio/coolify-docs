// Aside visibility manager for VitePress
export function initAsideManager() {
  if (typeof window === 'undefined') return

  function updateAsideClasses() {
    const docElement = document.querySelector('.VPDoc')
    if (!docElement) return

    const aside = document.querySelector('.VPDoc .aside')
    const asideContent = aside?.querySelector('.VPDocAside')
    
    if (asideContent) {
      const hasContent = asideContent.children.length > 0
      const isVisible = window.innerWidth >= 1280
      const shouldShowAside = hasContent && isVisible
      
      // Update classes
      if (shouldShowAside) {
        docElement.classList.add('has-aside')
      } else {
        docElement.classList.remove('has-aside')
      }
    } else {
      docElement.classList.remove('has-aside')
    }
  }

  // Initial check
  updateAsideClasses()

  // Watch for content changes
  const observer = new MutationObserver(() => {
    updateAsideClasses()
  })

  const aside = document.querySelector('.VPDoc .aside')
  if (aside) {
    observer.observe(aside, {
      childList: true,
      subtree: true
    })
  }

  // Listen for window resize
  window.addEventListener('resize', updateAsideClasses)

  // Cleanup function
  return () => {
    observer.disconnect()
    window.removeEventListener('resize', updateAsideClasses)
  }
} 