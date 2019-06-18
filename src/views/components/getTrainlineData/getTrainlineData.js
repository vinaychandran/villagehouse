import Global from '../global/global';

const level = {
  toLevel1: 'toLevel1',
  toLevel2: 'toLevel2',
  toLevel3: 'toLevel3',
  toLevel4: 'toLevel4',
};

const getTrainlineData = {
  requestDataList: (levelTogo, preId = null, trainlineId = null) => {
    return new Promise((resolve) => {
      if (document.querySelector('#sdfTrainlineAreaDataBaseUrl')) {
        const langkey = Global.getSiteLanguage();
        let url = document.querySelector('#sdfTrainlineAreaDataBaseUrl').value;
        if (levelTogo === level.toLevel1 || levelTogo === level.toLevel2) {
          url += `GetRegionPrefectureTrainData?sc_lang=${langkey}`;
        } else if (levelTogo === level.toLevel3) {
          url += `GetTrainLineByPrefectureData?sc_lang=${langkey}&prefId=${preId}`;
        } else if (levelTogo === level.toLevel4) {
          url += `GetTrainStationByTrainLineData?sc_lang=${langkey}&prefId=${preId}&trainLineId=${trainlineId}`;
        }
        const xhrHttp = new XMLHttpRequest();
        xhrHttp.open('GET', url, true);
        xhrHttp.responseType = 'json';
        xhrHttp.onreadystatechange = () => {
          if (xhrHttp.readyState === 4 && xhrHttp.status === 200) {
            let httpResponse = xhrHttp.response;
            if (Global.isJson(xhrHttp.response)) {
              httpResponse = JSON.parse(xhrHttp.response);
            } else {
              httpResponse = xhrHttp.response;
            }
            resolve(httpResponse);
          }
        };
        xhrHttp.send();
      }
    });
  },
  getDataList: async (levelTogo, preId = null, trainlineId = null) => {
    const resultDataList = await getTrainlineData.requestDataList(levelTogo, preId, trainlineId);
    return resultDataList;
  },
};

export default getTrainlineData;
