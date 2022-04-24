import request from './helper';
import queryString from 'query-string';

const apiBase = '/api';

const createErrorResult = error => {
  return {
    error: error
  };
};

const getDataFromResponse = jsonData => {
  const { data, message, messageCode, success } = jsonData;
  if (!success) {
    return createErrorResult(message);
  }
  return data;
};

const api = () => {
  return {
    login: payload => {
      console.log(payload);
      return request({
        url: `${apiBase}/account/login`,
        method: 'post',
        isForm: true,
        data: payload
      });
    },
    getUserId() {
      let userId = '';
      try {
        userId =
          localStorage.getItem('token') &&
          JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
            .userId;
        return userId;
      } catch (error) {
        return userId;
      }
    },
    getToken() {
      let token = '';
      try {
        token =
          localStorage.getItem('token') &&
          JSON.parse(localStorage.getItem('token')).loginResult.userInfoDto
            .token;
        return token;
      } catch (error) {
        return token;
      }
    },
    ifExpired: payload => {
      // 判断登入是否过期
      return request({
        url: `${apiBase}/account/check`,
        method: 'POST',
        data: JSON.stringify(payload)
      });
    },
    download: payload => {
      return request({
        url: `${apiBase}/book/down/${payload}`,
        method: 'get'
      });
    },
    preview: payload => {
      return request({
        url: `${apiBase}/book/preview/${payload}`,
        method: 'get'
      });
    },
    savePage: payload => {
      return request({
        url: `${apiBase}/book`,
        method: 'put',
        data: JSON.stringify(payload)
      });
    },
    getPage: payload => {
      return request({
        url: `${apiBase}/book/${payload}`,
        method: 'get'
      });
    },
    getMediaAudioTag() {
      // 获得音乐库tag
      return request({
        url: `${apiBase}/media/audio/tag?userId=${this.getUserId()}`,
        method: 'get'
      });
    },
    getImageAudioTag(mediaCategory) {
      // 获得图片库tag
      return request({
        url: `${apiBase}/media/image/tag?mediaCategory=${mediaCategory}&userId=${this.getUserId()}`,
        method: 'get'
      });
    },
    getAllImageAudioTag(mediaCategory) {
      // 获得图片库tag
      return request({
        url: `${apiBase}/media/image/tag?mediaCategory=${mediaCategory}`,
        method: 'get'
      });
    },
    getMediaAudios(data) {
      // 获取音乐库
      // pageNo = pageNo ? pageNo : 1
      return request({
        url: `${apiBase}/media/audio?${queryString.stringify(data)}`,
        // url: `${apiBase}/media/audio?page=${pageNo}&userId=${this.getUserId()}&pageSize=30&mediaCategory=${mediaCategory}`,
        method: 'get'
      });
    },
    getMediaImages(data) {
      // 获取图片库
      // pageNo = pageNo ? pageNo : 1
      // data.userId = this.getUserId();
      return request({
        url: `${apiBase}/${
          data.myself ? 'collection' : 'media'
        }/image?${queryString.stringify(data)}`,
        // url: `${apiBase}/media/audio?page=${pageNo}&userId=${this.getUserId()}&pageSize=30&mediaCategory=${mediaCategory}`,
        method: 'get'
      });
    },
    getMediaImagesList(data) {
      // 获取图片库
      // pageNo = pageNo ? pageNo : 1
      return request({
        url: `${apiBase}/media/image?${queryString.stringify(data)}`,
        // url: `${apiBase}/media/audio?page=${pageNo}&userId=${this.getUserId()}&pageSize=30&mediaCategory=${mediaCategory}`,
        method: 'get'
      });
    },
    deleteMedia(id) {
      // 删除音乐库
      return request({
        url: `${apiBase}/media?id=${id}`,
        method: 'delete'
      });
    },
    deleteAllMedia(ids) {
      // 批量删除音乐库
      return request({
        url: `${apiBase}/media/batchDelete`,
        method: 'delete',
        data: JSON.stringify(ids)
      });
    },

    changeAllMediaTag(params) {
      // 批量改变tag
      return request({
        url: `${apiBase}/media/movetag`,
        method: 'post',
        data: JSON.stringify(params)
      });
    },
    collectionMedia(item) {
      // 添加收藏
      item.userId = this.getUserId();
      return request({
        url: `${apiBase}/collection`,
        method: 'post',
        data: JSON.stringify(item)
      });
    },
    cancelCollectionMedia(id) {
      // 取消收藏
      return request({
        url: `${apiBase}/collection?id=${id}`,
        method: 'delete'
      });
    },
    editAudio(data) {
      // 修改音乐库
      return request({
        url: `${apiBase}/media/audio`,
        method: 'put',
        data: JSON.stringify(data)
      });
    },
    editImage(data) {
      // 修改图片库
      return request({
        url: `${apiBase}/media/image`,
        method: 'put',
        data: JSON.stringify(data)
      });
    },
    getPageList: payload => {
      return request({
        url: `${apiBase}/book?page=${payload.page}&pageSize=${
          payload.pageSize
        }&userId=${payload.userId}&searchKey=${
          payload.searchKey ? payload.searchKey : ''
        }`,
        method: 'get'
        // data: JSON.stringify(payload)
      });
    },
    delPage: payload => {
      return request({
        url: `${apiBase}/book/${payload}`,
        method: 'delete'
      });
    },
    getElementTemplates: (tag, type = 'name') => {
      let params = type === 'name' ? `?name=${tag}` : `?tag=${tag}`;
      return request({
        url: `${apiBase}/elementemplate${params}`,
        method: 'get'
      });
    },
    getElementTags: () => {
      return request({
        url: `${apiBase}/elementemplate/tags`,
        method: 'get'
      });
    },
    getPageTemplateTags: () => {
      return request({
        url: `${apiBase}/template/tags`,
        method: 'get'
      });
    },
    deletePageTemplatDetail:id=>{
      return request({
        url: `${apiBase}/template/${id}`,
        method: 'delete'
      });
    },
    getElementTemplatDetail: id => {
      return request({
        url: `${apiBase}/elementemplate/${id}`,
        method: 'get'
      });
    },
    deleteElementTemplatDetail: id => {
      return request({
        url: `${apiBase}/elementemplate/${id}`,
        method: 'delete'
      });
    },
    getComposeElementTemplates: (pageNo, search) => {
      pageNo = pageNo ? pageNo : 1;
      return request({
        url: `${apiBase}/templates/group/${pageNo}/${search}`,
        method: 'get'
      });
    },
    getPageTemplates: (pageNo, tag, type = 'name') => {
      let params = type === 'name' ? `&name=${tag}` : `&tag=${tag}`;
      pageNo = pageNo ? pageNo : 1;
      return request({
        url: `${apiBase}/template/page?page=${pageNo}&pageSize=${1000}${params}`,
        method: 'get'
      });
    },
    pageTemplateSetTop: (id, isTop) => {
      return request({
        url: `${apiBase}/template/setTop?id=${id}&isTop=${isTop}`,
        method: 'get'
      });
    },
    elementTemplateSetTop: (id, isTop) => {
      return request({
        url: `${apiBase}/elementemplate/setTop?id=${id}&isTop=${isTop}`,
        method: 'get'
      });
    },

    saveAsElementTemplate: template => {
      return request({
        url: `${apiBase}/elementemplate`,
        method: 'POST',
        data: JSON.stringify(template)
      });
    },
    saveAsComposeTemplate: composeTemplate => {
      return request({
        url: `${apiBase}/templates/saveElement`,
        method: 'post',
        data: JSON.stringify(composeTemplate)
      });
    },
    saveAsPageTemplate: composeTemplate => {
      return request({
        url: `${apiBase}/template`,
        method: 'PUT',
        data: JSON.stringify(composeTemplate)
      });
    },
    /*imgList: async pageNo => {
      try {
        pageNo = pageNo ? pageNo : 1;
        let response = await fetch(`${apiBase}/images/list/${pageNo}`, {
          method: 'GET'
        });
        let data = await response.json();
        return getDataFromResponse(data);
      } catch (e) {
        return createErrorResult(e.message);
      }
    },*/
    imgList: async pageNo => {
      pageNo = pageNo ? pageNo : 1;
      let res = await request({
        url: `${apiBase}/images/list/${pageNo}`,
        method: 'get'
      });
      return res.data;
    },
    musicList: async pageNo => {
      pageNo = pageNo ? pageNo : 1;
      let res = await request({
        url: `${apiBase}/audio/list/${pageNo}`,
        method: 'get'
      });
      return res.data;
    },
    updatePassword: (email, password, verifyCode) => {
      return request({
        url: `${apiBase}/user/resetpass`,
        method: 'post',
        data: {
          email: email,
          newpass: password,
          vercode: verifyCode
        }
      });
    },
    sendvercode: email => {
      return request({
        url: `${apiBase}/user/sendvercode?email=${email}`,
        method: 'post'
      });
    },
    copyBook: (sourceId, newId, newName, newBookCode) => {
      const params = { sourceId, newId, newName, newBookCode };
      return request({
        url: `${apiBase}/book/copy`,
        method: 'post',
        data: JSON.stringify(params)
      });
    },
    getPinyinContent: content => {
      // 文本生成拼音繁体
      return request({
        url: `${apiBase}/text`,
        method: 'POST',
        data: JSON.stringify(content)
      });
    },
    errorCorrection: content => {
      // 拼音繁体纠错
      return request({
        url: `${apiBase}/text/errorCorrection`,
        method: 'POST',
        data: JSON.stringify(content)
      });
    },
    saveSvgHtml : (url,content) =>{
      return request({
        url: `${apiBase}/media/updateSvg`,
        method: 'POST',
        data: JSON.stringify({
          url,content
        })
      });
    },
    saveQuestion : (bookId, questions) =>{
      return request({
        url: `${apiBase}/question/${bookId}`,
        method: 'POST',
        data: JSON.stringify(questions)
      });
    },
    getQuestion : (bookId) =>{
      return request({
        url: `${apiBase}/question/${bookId}`,
        method: 'get',
      });
    },
    getQuestionByBookCode : (bookCode) =>{
      return request({
        url: `${apiBase}/question/bybookcode/${bookCode}`,
        method: 'get',
      });
    },
    getQuestions : (timestamp) =>{
      return request({
        url: `${apiBase}/question/latestupdate?timestamp=${timestamp}`,
        method: 'get',
      });
    }
  };
};

export default api();
