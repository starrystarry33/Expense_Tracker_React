import React, { useEffect } from 'react'
// import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import './News.scss'
import NewsItem from '../NewsItem/NewsItem';

// Set News Component
function News() {
    // get context from global context
    const {news, getNews} = useGlobalContext()

    // Load data on hook
    useEffect(() =>{
        getNews()
    }, [])
    return(
        <div className='news-main'>
            <InnerLayout>
                <h1>NEWS</h1>
                <h2 className="news-intro">Today's Happening <span>{}</span></h2>
                <div className='news-content'>
                {news.map((data) => {
                    const content = {...data}
                    const source = content.source.name
                    const title = content.title
                    const publishedAt = content.publishedAt
                    const url = content.url
                    const descript = content.descript

                    return <NewsItem 
                        key={content.title}
                        source={source}
                        title={title}
                        publishedAt={publishedAt}
                        url={url}
                        descript={descript}
                    />
                })}
                </div>
            </InnerLayout>
        </div>
    )

    
}


export default News