import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { CiUser, CiLock } from "react-icons/ci";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handlePassword(){
    setShowPassword(!showPassword)
  }


  const { setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      response.json()
      // THE RESPONSE CONVERTED TO JSON AND THEN RESOLVED
      // AND SENT INTO A NEW VARIABLE userInfo(which has the same name as our 
      // global userInfo state variable)
      .then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
        console.log(response);

      });
    } else {
      toast.error('wrong email or password...', {
        duration: 2000,
      });
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="flex items-center justify-center h-full">
      <Toaster richColors position="top-center" />
      <form className="login bg-white shadow-lg 
      h-[400px] w-full flex
      rounded-md 
      flex-col gap-6 px-4" onSubmit={login}>
        <h1 className="py-2 text-2xl text-orange-400">Login</h1>


        <label className="text-xl font-semibold">User name</label>
        <div className="flex items-center focus:border-3 focus:border-orange-400 active:border-3 
        active:border-orange-400 justify-center border bg-slate-50
      space-x-3 rounded-md shadow-md">
          <CiUser className="h-8 w-8 ml-2" />
          <input type="text"
            placeholder="username"
            className="py-3 pl-2 border-none outline-none bg-white"
            value={username}
            onChange={e => setUsername(e.target.value)} />
        </div>


        <label className="text-xl font-semibold">Password</label>
        <div className="flex items-center focus:border-3 focus:border-orange-400 active:border-3 
        active:border-orange-400 justify-center border bg-slate-50
      space-x-3 rounded-md shadow-md">
          <CiLock className="h-8 w-8 ml-2" />
          <input type={showPassword ? "text" : "password"}
            placeholder="password"
            className="py-3 pl-2 border-none outline-none bg-white"
            value={password}
            onChange={e => setPassword(e.target.value)} />
            <div onClick={handlePassword}>
              {showPassword  ? <AiOutlineEye className="h-6 w-6 mr-2"/> :  <AiOutlineEyeInvisible className="h-6 w-6 mr-2"/>}
            </div>
        </div>
        <button className="bg-orange-500 py-3 hover:bg-orange-400
        transition-all duration-500 text-bold text-white">Login</button>
      </form>
    </div>
  );
}