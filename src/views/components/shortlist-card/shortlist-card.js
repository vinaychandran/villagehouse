const breakpoint = {
  sm: 767,
  md: 992,
};

const ShortListCard = {
  initShortListSlider: (item, childItem, slidesToShowDesktop, slidesToShowMobile) => {
    const options = {
      dots: true,
      speed: 600,
      slidesToShow: slidesToShowDesktop,
      prevArrow: $(`${item}+.slick-controls .icon-arrow-left`),
      nextArrow: $(`${item}+.slick-controls .icon-arrow-right`),
      variableWidth: item === '#near-properties__slider',
      responsive: [
        {
          breakpoint: item === '#near-properties__slider' ? breakpoint.md : breakpoint.sm,
          settings: {
            slidesToShow: slidesToShowMobile,
            centerMode: item === '#near-properties__slider',
          },
        },
      ],
    };
    if ($(item).length > 0) {
      if ($(item).find(childItem).length > 1) {
        $(item).slick(options).on('setPosition', (event, slick) => {
          slick.$slides.css('height', `${slick.$slideTrack.height()}px`);
          slick.$slideTrack.find('.slick-cloned').css('height', `${slick.$slideTrack.height()}px`);
        });
      } else if ($(item).find(childItem).length === 1) {
        $(item).next('.slick-controls').addClass('hidden');
      }
    }
  },
};
export default ShortListCard;
