import React, { ReactElement } from 'react'

function RootLayout({children}:{children:ReactElement}) {
  return (

    <main>
        {children}
    </main>
  )
}

export default RootLayout;