exports.handler = async function (event, context){
  return{
    stausCode : 200,
    body : JSON.stringify({
      name: 'Wrecker',
      age : 31,
      email: 'wrecker@gamil.com'
    })
    // body에는 문자만 할당가능 body : 'Hello World'
  }
}