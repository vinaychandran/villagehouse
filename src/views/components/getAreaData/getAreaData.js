import Global from '../global/global';

const getAreaData = {
  requestDataList: () => {
    return new Promise((resolve) => {
      if (document.querySelector('#sdfTrainlineAreaDataBaseUrl')) {
        const langkey = Global.getSiteLanguage();
        let url = document.querySelector('#sdfTrainlineAreaDataBaseUrl').value;
        url += `GetAreaData?sc_lang=${langkey}`;
        const xhrHttp = new XMLHttpRequest();
        xhrHttp.open('GET', url, true);
        xhrHttp.responseType = 'json';
        xhrHttp.onreadystatechange = () => {
          if ((xhrHttp.readyState === 4 && xhrHttp.status === 200)) {
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
  getDataList: async () => {
    const resultDataList = await getAreaData.requestDataList();
    return resultDataList;
  },
};

export default getAreaData;
