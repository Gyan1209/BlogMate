import React from 'react'
import {Container, Logo} from '../index'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    }
  ]

  //const isActive = (path)=>true;
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  }

  return (
    <header className='py-3 shadow bg-[#151415] sticky top-0 z-50'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/' className='inline-block text-white px-6 py-2 duration-200 hover:bg-yellow-400 rounded-full'>
              <Logo width='70px'/>
            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-6 py-2 duration-200 hover:bg-yellow-400 rounded-full
                      ${isActive(item.slug) ? 'bg-yellow-200 text-gray-900 font-bold' : 'text-white'}`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <Dashboard />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header