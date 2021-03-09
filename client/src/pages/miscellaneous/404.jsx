import React from 'react';

function PageNotFound({history}) {
    console.log(history.location.pathname)
    return (
        <div className='background'>
            <div className='page_not_found'>
                <h1>Page not Found</h1>
                <h2>The page you were searching for <span>{history.location.pathname}</span> dosen't exist</h2>
            </div>
        </div>
    )
}

export default PageNotFound
