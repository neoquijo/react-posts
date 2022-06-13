import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TQuery = ((page: number, query: string) => any)

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/posts/' }),
    endpoints: (build) => ({
        getPostById: build.query({
            query: (id) => {
                return '/' + id
            }
        }),
        getPosts: build.query({
            query: (a) => {
                return a?.query?.length > 1 ?
                    `search?q=${a.query}&limit=10&${a.page !== undefined && 'skip=' + ((parseInt(a.page) - 1) * 10)}`
                    :
                    `?limit=10&${a.page !== undefined && 'skip=' + ((parseInt(a.page) - 1) * 10)}`
            }

        })
    })

})

export const {
    useGetPostByIdQuery,
    useGetPostsQuery,
} = postsApi
