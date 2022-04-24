import queryString from 'query-string';

//解析json
function parseJSON(response){
  return response.json()
}
//检查请求状态
function checkStatus(response){
  if(response.status >= 200 && response.status < 500){
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}


function getUserId() {
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
}

export default function request(options = {}) {
  window.localStorage.setItem("onFetch", "true");
  // console.log('请求数据',options)
  const {data,url} = options
  options = {...options}
  options.mode = 'cors'//跨域
  delete options.url
  if(data){
    delete options.data
    options.body = options.isForm ? queryString.stringify(data) : data
  }
  options.headers={
    'Content-Type': options.isForm ? 'application/x-www-form-urlencoded' : 'application/json',
    'Authorization':getUserId()
  }
  return new Promise((resolve, reject) => {
    fetch(url,options,{credentials: 'include'})
    .then(checkStatus)
      .then(response => {
        window.localStorage.setItem("onFetch", "false");
        resolve(parseJSON(response)) 
      })
      .catch(error => { 
        window.localStorage.setItem("onFetch", "false");
        reject(error); 
      })
  })  
}