
import { shallowMount } from '@vue/test-utils'
import store from '~/store'
import router from '~/routes'
import Header from '~/components/Header'


describe('components/Header.vue',()=> {
  // 기본적 매번 테스트를 진행할때 초기화 필요 
  // beforeEach를 통해 하면 편함
  let wrapper // beforeEach() 변수 범위
  beforeEach(async () => {
    //모의 함수로 동작 하걸로 인식
    window.scrollTo = jest.fn()
    router.push('/movie/tt1234567')
    await router.isReady()
      wrapper = shallowMount(Header,{
      global : {
        plugins: [
          router,
          store
        ]
      }
    })
  })

  test('경로 정규표현식이 없는 경우 일치하지 않습니다',()=>{
    const regExp = undefined
    expect(wrapper.vm.isMatch(regExp)).toBe(false)  
  })

  test('경로 정규표현식이 일치해야 합니다',()=>{
    //경로 설정없으면 메인으로 연결되어 있는 듯
    const regExp = /^\/movie/
    expect(wrapper.vm.isMatch(regExp)).toBe(true) 
  })

  test('경로 정규표현식이 일치하지 않아야 합니다',()=>{
    const regExp = /^\/heropy/
    expect(wrapper.vm.isMatch(regExp)).toBe(false)
  })
})
