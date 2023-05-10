import React, { useContext } from 'react'
import styled from 'styled-components'
import { GithubContext } from '../context/context'
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts'

const Repos = () => {
  const GithubCtx = useContext(GithubContext)

  //console.log(GithubCtx.repos)

  const languages = GithubCtx.repos.reduce((total, item) => {
    const { language, stargazers_count } = item

    //if language is null then return total
    if (!language) return total

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count }
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      }
    }
    //console.log(language)
    return total
  }, {})

  //console.log(languages)

  //now convert object into array so and also sort by descending and get first 5 entries only
  const mostUsed = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
  //console.log(languages)

  //most star per language
  const mostPopular = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    .map((item) => {
      return { ...item, value: item.stars }
    })
    .slice(0, 5)

  //stars, forks

  let { stars, forks } = GithubCtx.repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item
      total.stars[stargazers_count] = { label: name, value: stargazers_count }

      total.forks[forks] = { label: name, value: forks }

      return total
    },
    {
      stars: {},
      forks: {},
    }
  )

  //convert object into array and take last five and reverse them
  stars = Object.values(stars).slice(-5).reverse()

  forks = Object.values(forks).slice(-5).reverse()

  //console.log(stars, forks)

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        {/* <ExampleChart data={chartData} /> */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
