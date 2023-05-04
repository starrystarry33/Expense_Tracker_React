import './NewsItem.scss'
import React from 'react'

// News Items
function NewsItem ({ title, source, publishedAt, url, descript}) {

    return <div className="news-item">
        <h4 className="news-title">
            <a href={url}>
                {title}
            </a>
        </h4>
        <p className='new-source'>
            {source}
        </p>
        <p className="news-publishedAt">
            {publishedAt}
        </p>
        <p className="news-descript">
            {descript}
        </p>
    </div>

}

export default NewsItem