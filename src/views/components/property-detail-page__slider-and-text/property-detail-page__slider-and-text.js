const PropertyDetailSlider = {
  initImageSlider: ($imageCarousel, thumnailCarouselClass) => {
    if ($imageCarousel.length > 0) {
      $imageCarousel.on('init afterChange', () => {
        const containerElmComputed = getComputedStyle(document.querySelector('.property-detail__image-slider'));
        const centerElmComputed = getComputedStyle(document.querySelector('.property-detail__image-slider .slick-active'));
        const allOverlays = document.querySelectorAll('.property-detail__image-slider__overlay');
        const containerElmWidth = parseInt(containerElmComputed.width, 10) - parseInt(containerElmComputed.paddingLeft, 10) * 2;
        const centerElmWidth = parseInt(centerElmComputed.width, 10) - parseInt(centerElmComputed.paddingLeft, 10) * 2;
        allOverlays.forEach((eachOverlay) => {
          const returnWidth = (containerElmWidth - centerElmWidth) / 2;
          eachOverlay.style.width = `${returnWidth}px`;
        });
      });
      $imageCarousel.slick({
        infinite: true,
        slidesToShow: 1,
        variableWidth: true,
        centerMode: true,
        slidesToScroll: 1,
        asNavFor: thumnailCarouselClass,
        arrows: true,
        lazyLoad: 'progressive',
      }).magnificPopup({
        type: 'image',
        delegate: 'div.slick-slide:not(.slick-cloned) a',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
        },
        image: {
          verticalFit: true,
        },
        mainClass: 'mfp-fade',
        callbacks: {
          open: () => {
            setTimeout(() => {
              const magnificPopup = $.magnificPopup.instance;
              $('.mfp-container').swipe({
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                  console.log("swipe right");
                  magnificPopup.next();
                },
                swipeRight:function(event, direction, distance, duration, fingerCount) {
                  console.log("swipe left");
                  magnificPopup.prev();
                },
              });
            }, 500);
          },
          close: function() {
            $imageCarousel.slick('slickGoTo', parseInt(this.index, 10));
          },
          beforeClose: () => {
            $('.mfp-container').swipe('destroy');
          },
        },
      });
      PropertyDetailSlider.handleClickOverlay($imageCarousel);
    }
  },
  handleWidthOfOverlays: () => {
    const containerElm = document.querySelector('.property-detail__image-slider');
    const centerElm = containerElm.querySelector('.property-detail__image-slider .slick-active');
    const allOverlays = document.querySelectorAll('.property-detail__image-slider__overlay');
    allOverlays.forEach((eachOverlay) => {
      eachOverlay.offsetWidth = (parseInt(containerElm.offsetWidth, 10) - parseInt(centerElm.offsetWidth, 10)) / 2;
    });
  },
  initThumnnailSlider: ($thumnailCarousel, imageCarouselClass) => {
    $thumnailCarousel.slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      variableWidth: true,
      asNavFor: imageCarouselClass,
      arrows: false,
      focusOnSelect: true,
      infinite: false,
      lazyLoad: 'progressive',
    });
  },
  handleClickOverlay: ($imageCarousel) => {
    const allOverlays = document.querySelectorAll('.property-detail__image-slider__overlay');
    allOverlays.forEach((overlay) => {
      overlay.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('is-prev')) {
          $imageCarousel.slick('slickPrev');
        } else {
          $imageCarousel.slick('slickNext');
        }
      });
    });
  },
  handleFloorPlanButton: (imageCarouselClass, thumnailCarouselClass, floorPlanIndex) => {
    const floorPlanBtn = document.querySelector('.property-detail__floorplan-btn');
    if (floorPlanBtn) {
      floorPlanBtn.addEventListener('click', () => {
        $(imageCarouselClass).slick('slickGoTo', floorPlanIndex);
        $(thumnailCarouselClass).slick('slickGoTo', floorPlanIndex);
      });
    }
  },
  initSlider: (imageCarouselClass, thumnailCarouselClass) => {
    const allThumbs = document.querySelectorAll('.property-detail__thumnail-slider .property-slider__thumnail');
    const floorPlanThumb = document.querySelector('.property-slider__thumnail.is-floorplan');
    const floorPlanIndex = [].indexOf.call(allThumbs, floorPlanThumb);

    const $imageCarousel = $(imageCarouselClass);
    const $thumnailCarousel = $(thumnailCarouselClass);
    PropertyDetailSlider.initImageSlider($imageCarousel, thumnailCarouselClass);
    PropertyDetailSlider.initThumnnailSlider($thumnailCarousel, imageCarouselClass);
    PropertyDetailSlider.handleFloorPlanButton(imageCarouselClass, thumnailCarouselClass, floorPlanIndex);
  },
};

export default PropertyDetailSlider;
