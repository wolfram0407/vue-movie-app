
import movieStore from '~/store/movie'
import _cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'

describe('store/movie.js',()=> {
  let store
  beforeEach( () => {
    // 데이터를테스트 많이 하다보면 오렴되는 현상 방지
    store = _cloneDeep(movieStore)
    store.state = store.state()
    //함수는다시 만들어줘야 함
    store.commit = (name, payload) =>{
      store.mutations[name](store.state, payload)
    }
    //비동기 함수
    store.dispatch = (name, payload) => {
      const context = {
        state: store.state,
        commit : store.commit,
        dispatch : store.dispatch
      }
      return store.actions[name](context, payload)
    }
  })
  test('영화 데이터 초기화', ( ) =>{
    // store 초기화 
    store.commit('updateState',{
      movies: [{imdbId:'1'}],
      message: 'Hello world',
      loading: true,
    })
    // store 재설정 후 기존과 동일한지 테스트
    store.commit('resetMovies')
    expect(store.state.movies).toEqual([])
    expect(store.state.message).toBe('Search for the movie title!')
    expect(store.state.loading).toBe(false)
  })
  
  test('영화 목록을 잘 가져온 경우 데이터를 확인합니다',async ()=>{
    const res = {
      data: {
        totalResults: '1',
        Search: [
          {
            imdbID: '1',
            Title: 'Hello',
            Poster: 'hello.jpg',
            Year: '2021'
          }
        ]
      }
    }
    axios.post = jest.fn().mockResolvedValue(res)
    await store.dispatch('searchMovies')
    expect(store.state.movies).toEqual(res.data.Search)
  })

  test('영화 목록을 가져오지 못한 경우 에러 메시지를 확인합니다', async () =>{
    // 설정
    const errorMessage = 'Network Error.'
    axios.post = jest.fn().mockRejectedValue(new Error(errorMessage))

    // 동작
    await store.dispatch('searchMovies')

    // 확인
    expect(store.state.message).toBe(errorMessage)
  })

  test('영화 아이템이 중복된 경우 고유하게 처리합니다', async () => {
    // 설정
    const res = {
      data: {
        totalResults: '1',
        Search: [
          {
            imdbID: '1',
            Title: 'Hello',
            Poster: 'hello.jpg',
            Year: '2021'
          },
          {
            imdbID: '1',
            Title: 'Hello',
            Poster: 'hello.jpg',
            Year: '2021'
          },
          {
            imdbID: '1',
            Title: 'Hello',
            Poster: 'hello.jpg',
            Year: '2021'
          }
        ]
      }
    }
    axios.post = jest.fn().mockResolvedValue(res)
    // 동작
    await store.dispatch('searchMovies')
    // 확인
    expect(store.state.movies.length).toBe(1)
  })

  test('단일 영화의 상세 정보를 잘 가져온 경우 데이터를 확인합니다', async () => {
    // 설정
    const res = {
      data: {
        imdbID: '1',
        Title: 'Frozen',
        Poster: 'frozen.png',
        Year: '2021'
      }
    }
    axios.post = jest.fn().mockResolvedValue(res)
    // 동작
    await store.dispatch('searchMovieWithId')
    // 확인
    expect(store.state.theMovie).toEqual(res.data)
  })
})