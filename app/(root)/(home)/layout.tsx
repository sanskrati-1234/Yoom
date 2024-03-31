import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import React, { ReactElement } from 'react'

function HomeLayout({children}:{children:ReactElement}) {
  return (

    <main className='relative'>
        <Navbar/>
        <div className='flex'>
            <Sidebar/>
            <section className='flex min-h-screen  flex-1 flex-col px-6 pb-6 pt-28 max-md:pd-14 sm:pb-14'>
                <div className='w-full'>
                    {children}
                </div>
            </section>
            
          
        </div>
        
    </main>
  )
}

export default HomeLayout;