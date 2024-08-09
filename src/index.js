document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('testimonial-container');
  const leftButton = document.getElementById('btn-left');
  const rightButton = document.getElementById('btn-right');
  const items = document.querySelectorAll('#testimonial-item');

  let scrollAmount = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);

  const scrollMax = container.scrollWidth - container.clientWidth;

  rightButton.addEventListener('click', () => {
    if (scrollAmount > 0) {
      scrollAmount -= itemWidth;
      container.style.transform = `translateX(-${scrollAmount}px)`;
      currentTranslate = -scrollAmount;
      prevTranslate = currentTranslate;
    }
  });

  leftButton.addEventListener('click', () => {
    if (scrollAmount < scrollMax) {
      scrollAmount += itemWidth;
      container.style.transform = `translateX(-${scrollAmount}px)`;
      currentTranslate = -scrollAmount;
      prevTranslate = currentTranslate;
    }
  });

  container.addEventListener('touchstart', touchStart);
  container.addEventListener('touchend', touchEnd);
  container.addEventListener('touchmove', touchMove);

  container.addEventListener('mousedown', touchStart);
  container.addEventListener('mouseup', touchEnd);
  container.addEventListener('mouseleave', touchEnd);
  container.addEventListener('mousemove', touchMove);

  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    container.style.cursor = 'grabbing';
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -itemWidth / 4 && scrollAmount < scrollMax) {
      scrollAmount += itemWidth;
    } else if (movedBy > itemWidth / 4 && scrollAmount > 0) {
      scrollAmount -= itemWidth;
    }

    container.style.transform = `translateX(-${scrollAmount}px)`;
    currentTranslate = -scrollAmount;
    prevTranslate = currentTranslate;

    container.style.cursor = 'grab';
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
      container.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    if (isDragging) {
      requestAnimationFrame(animation);
    }
  }
});
