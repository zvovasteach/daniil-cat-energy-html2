ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
      center: screen.width < 1440 ? [59.938631, 30.323037] : [59.938797, 30.319902] ,
      zoom: 17,
      controls: ['smallMapDefaultSet']
    }, {
      searchControlProvider: 'yandex#search'
    }),

    myPlacemark = new ymaps.Placemark(
      [59.938631, 30.323037],
      {},
      {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '../img/icons/map-pin.png',
        // Размеры метки.
        iconImageSize: screen.width < 768 ? [57, 53] : [113, 106],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: screen.width < 768 ? [-28, -26] : [-56, -106]
    });

  myMap.geoObjects.add(myPlacemark);
});
