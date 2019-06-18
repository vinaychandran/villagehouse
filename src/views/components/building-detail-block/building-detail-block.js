import Global from '../global/global';

const BuildingDetailBlock = {
  initSlickSlier: (className) => {
    const allSliders = document.querySelectorAll(className);
    if (allSliders) {
      allSliders.forEach((eachSlider) => {
        $(eachSlider).on('init', () => {
          Global.lazyLoad();
        });
        $(eachSlider).slick({
          infinite: true,
          arrows: true,
          lazyLoad: 'progressive',
        }).magnificPopup({
          type: 'image',
          delegate: 'div.slick-slide:not(.slick-cloned) a',
          gallery: {
            enabled: true,
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
            close: function () {
              $(eachSlider).slick('slickGoTo', parseInt(this.index, 10));
            },
            beforeClose: () => {
              $('.mfp-container').swipe('destroy');
            },
          },
        });
      });
    }
  },
};

export default BuildingDetailBlock;
