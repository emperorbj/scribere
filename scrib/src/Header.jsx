import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "./UserContext";
import { Tooltip } from 'react-tooltip';

const PLACES = ['top-end'];

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('https://scriberebackend.vercel.app/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  // function logout() {
  //   fetch('https://scriberebackend.vercel.app/logout', {
  //     credentials: 'include',
  //     method: 'POST',
  //   });
  //   setUserInfo(null);
  // }

  function logout() {
    localStorage.removeItem('token');
    // Optionally, you can also clear user info
    // localStorage.removeItem('user');
  }
  
  // const username = userInfo?.username
  const username = userInfo?.username ? userInfo.username.slice(0, 2).toUpperCase() : null;
  

  

  return (
    <header className="bg-white rounded-xl mb-10 shadow-sm px-6 py-4 space-y-2 md:space-y-0 
    md:flex md:justify-between md:items-center">
      <Link to="/" className="logo text-orange-400 text-4xl">Scrib</Link>
      <nav>
        {username && (
          <>
            <Link to="/create" className="font-bold text-center px-4 
            rounded-md py-3 text-orange-600 shadow-md  hover:bg-orange-500 hover:text-white bg-orange-200">New post</Link>
            <a id="my-anchor-element-id"
            data-tooltip-variant="info">
            <button className="p-2 h-12 w-12 rounded-full shadow-md bg-blue-400 text-white
            text-bold text-center" onClick={logout}>{username}</button>
            </a>
            {PLACES.map(place => (
              <Tooltip key={place}
              anchorSelect="#my-anchor-element-id"
              content="Log out"
              place={place}
              style={{borderRadius:"12px"}} 
              />
            ))
            }



          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="bg-purple-300
            rounded-md shadow-md hover:bg-purple-500 hover:text-white transition-all duration-500 
            max-w-[100px] md:max-w-[240px] py-2 px-3 md:py-2 md:px-5 
            text-bold text-purple-600 text-xl">Login</Link>
            <Link to="/register" className="bg-purple-300
            rounded-md shadow-md hover:bg-purple-500 hover:text-white
            transition-all duration-500 
            max-w-[100px] md:max-w-[240px] py-2 px-3 md:py-2 md:px-5 
            text-bold text-purple-600 text-xl">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
