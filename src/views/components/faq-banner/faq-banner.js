import fitvids from 'fitvids';

const FaqBanner = {
  toggleTimestampList: () => {
    const timestampListWrapperElm = document.querySelector('.faq-banner__section-list');
    if (timestampListWrapperElm) {
      const sectionListButton = document.querySelector('.faq-banner__section-list__button');
      sectionListButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        timestampListWrapperElm.classList.toggle('show-timestamp');
      });
      document.querySelector('body').addEventListener('click', (evt) => {
        evt.stopPropagation();
        if (timestampListWrapperElm.classList.contains('show-timestamp')) {
          timestampListWrapperElm.classList.remove('show-timestamp')
        }
      });
    }
  },
  addClickTimeStampList: (player) => {
    const allLinks = document.querySelectorAll('.faq-banner__section-list__list ul a');
    allLinks.forEach((eachLink) => {
      eachLink.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        FaqBanner.jumpTimeStamp(player, eachLink.dataset.jumpTimestamp);
      });
    });
  },
  initYoutubeApi: () => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  onPlayerReady: (evt) => {
    evt.target.pauseVideo();
    fitvids({
      players: 'iframe[src*="youtube"]',
    })
  },
  onPlayerStateChange: (evt) => {
  },
  jumpTimeStamp: (player, second) => {
    player.seekTo(second);
  },
};


export default FaqBanner;
