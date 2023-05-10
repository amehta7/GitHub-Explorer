import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: '' })

  const checkReq = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let { remaining } = data.data.rate
        //console.log(remaining)

        setRequests(remaining)
        if (remaining === 0) {
          toggleError(
            true,
            'sorry, you have exceeded your hourly rate limit!!!'
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const toggleError = (show = false, msg = '') => {
    setError({ show: show, msg: msg })
  }

  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    const res = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )

    if (res) {
      //console.log(res)
      setGithubUser(res.data)

      const { login, followers_url } = res.data
      //repos
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((res) =>
      //   setRepos(res.data)
      // )
      // //followers
      // axios(`${followers_url}?per_page=100`).then((res) =>
      //   setFollowers(res.data)
      // )

      //when repo and followers data fetched and then only display so do this
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((res) => {
          //console.log(res)
          const [repos, followers] = res
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((err) => console.log(err))
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkReq()
    setIsLoading(false)
  }

  useEffect(() => {
    checkReq()
    // eslint-disable-next-line
  }, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser: githubUser,
        repos: repos,
        followers: followers,
        requests: requests,
        error: error,
        searchGithubUser: searchGithubUser,
        isLoading: isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubContext, GithubProvider }
