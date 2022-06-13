import css from './App.module.css'
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useGetPostByIdQuery, useGetPostsQuery } from './app/postApi';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setQuery } from './app/postSlice';
import { Loading } from './Loading/Loading';
import { useEffect } from 'react';

const handleSearch = (dispatch, value, navigate) => {
  dispatch(setQuery(value))
  navigate('/')
}

const getPagesNum = (total) => {

  return (total % 10) === 0 ? total / 10 : parseInt((total / 10).toFixed(0)) + 1
}

const pagination = (total, page, navigate) => {
  const pnum = getPagesNum(total)
  const pages = new Array((pnum)).fill('a')
  if (page > pnum || !page) page = 1
  return pages.map((el, i) => <div onClick={() => navigate(`/${i + 1}`)} className={parseInt(page) === i + 1 ? css.activePage : css.page}>{i + 1}</div>)
}

const clearQuery = (dispatch, setInputValue) => {
  setInputValue('')
  dispatch(setQuery(''))

}



function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: post, isSuccess } = useGetPostByIdQuery(id)
  return (

    <div className={css.wrapper}>
      {isSuccess ? (<>
        <button onClick={() => navigate(-1)}>GoBack</button>
        <div className={css.post}>
          <div className={css.postTitle}>{post.title}</div>
          <div className={css.postBody}>{post.body}</div>
        </div>
      </>) :
        <div className={css.loading}>
          Loading
        </div>
      }
    </div>

  )
}

function Page() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(s => s.search.query)
  const { page } = useParams()
  const [inputValue, setInputValue] = useState(query)
  const { data, isSuccess, isFetching } = useGetPostsQuery({ page, query })
  const navigate = useNavigate()
  useEffect(() => {
    if (parseInt(page) === 1)
      navigate('/')
  })
  return (<>

    <div className={css.wrapper}>
      <div>
        {isFetching && <Loading />}
        <input value={inputValue} onChange={e => setInputValue(prec => e.target.value)} />
        <button onClick={() => handleSearch(dispatch, inputValue, navigate)}>Поиск</button>
        {query && <button onClick={e => clearQuery(dispatch, setInputValue)}>clear</button>}

      </div>
      <div className={css.posts}>
        {isSuccess && data.posts.map(post => <div key={post.id} className={css.postItem} onClick={() => navigate('/post/' + post.id)}>{post.title}</div>)}
        {isSuccess && data.posts.length === 0 && <div>sorry, no results found</div>}
      </div>
      {data?.posts?.length > 0 &&
        <div className={css.pagination}>
          <div onClick={() => navigate('/1')} className={css.page}>First</div>
          {parseInt(page) > 1 && <>
            <div onClick={() => navigate('/' + (parseInt(page) - 1))} className={css.page}>Prev</div>
          </>}
          {isSuccess && pagination(parseInt(data.total), page, navigate)}
          {(parseInt(page) < parseInt(data.total) / 10 || !page) && <>
            <div onClick={() => navigate('/' + (parseInt(page) + 1))} className={css.page}>Next</div>
          </>}
          <div onClick={() => {
            navigate('/' + parseInt(data.total) / 10)
          }} className={css.page}>Last</div>
        </div>}
    </div>
  </>)
}

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/post/:id'} element={<Post />} />
          <Route path={'/'} element={<Page />} />
          <Route path={'/:page'} element={<Page />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
