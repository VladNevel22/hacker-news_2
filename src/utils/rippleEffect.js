export function attachRippleEffect(selector = '.ripple') {
	const createRipple = event => {
		const button = event.currentTarget
		const circle = document.createElement('span')
		const diameter = Math.max(button.clientWidth, button.clientHeight)
		const radius = diameter / 2

		circle.style.width = circle.style.height = `${diameter}px`
		circle.style.left = `${
			event.clientX - button.getBoundingClientRect().left - radius
		}px`
		circle.style.top = `${
			event.clientY - button.getBoundingClientRect().top - radius
		}px`
		circle.classList.add('ripple-effect')

		const ripple = button.getElementsByClassName('ripple-effect')[0]
		if (ripple) {
			ripple.remove()
		}

		button.appendChild(circle)

		// Удаляем элемент после анимации
		setTimeout(() => {
			if (circle.parentNode === button) {
				button.removeChild(circle)
			}
		}, 600)
	}

	// Применяем ко всем элементам с классом ripple
	document.querySelectorAll(selector).forEach(element => {
		element.addEventListener('click', createRipple)
	})
}

// CSS для ripple эффекта
export function injectRippleStyles() {
	const style = document.createElement('style')
	style.textContent = `
    .ripple {
      position: relative;
      overflow: hidden;
      transform: translate3d(0, 0, 0);
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
	document.head.appendChild(style)
}
