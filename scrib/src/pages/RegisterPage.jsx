import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { CiUser, CiLock } from "react-icons/ci";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai"

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  function handlePassword(){
    setShowPassword(!showPassword)
  }



  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      toast.success('Registration successful! Redirecting to Login...', {
        duration: 2000,
      });

      setTimeout(() => {
        navigate('/login'); // Redirect to the login page
      }, 2000);
    }

    else {
      toast.error('Registration failed!');
    }
  }
  return (
    <div className="flex items-center justify-center h-full">
      <Toaster richColors position="top-center" />
      <form className="register bg-white shadow-lg
    rounded-md 
      h-[400px] w-full flex 
      flex-col gap-6 px-4" onSubmit={register}>
        <h1 className="py-2 text-2xl text-purple-600">Register</h1>
        <label className="text-xl font-semibold">User name</label>
        <div className="flex items-center focus:border-3 focus:border-purple-400 active:border-3 
        active:border-purple-400  justify-center border bg-slate-50
      space-x-3 rounded-md shadow-md">
          <CiUser className="h-8 w-8 ml-2" />
          <input type="text"
            placeholder="username"
            value={username}
            className="py-3 pl-2 border-none outline-none bg-white"
            onChange={ev => setUsername(ev.target.value)} />
        </div>
        
        <label className="text-xl font-semibold">Password</label>
        <div className="flex items-center focus:border-3 focus:border-purple-400 active:border-3 
        active:border-purple-400 justify-center border bg-slate-50
      space-x-3 rounded-md shadow-md">
          <CiLock className="h-8 w-8 ml-2" />
          <input type={showPassword ? "text" : "password"}
            placeholder="password"
            value={password}
            className="py-3 pl-2 border-none outline-none bg-white"
            onChange={ev => setPassword(ev.target.value)} />
            <div onClick={handlePassword}>
              {showPassword  ? <AiOutlineEye className="h-6 w-6 mr-2"/> :  <AiOutlineEyeInvisible className="h-6 w-6 mr-2"/>}
            </div>
        </div>

        <button className="bg-purple-500 py-3 hover:bg-purple-400
        transition-all duration-500 text-white text-bold">Register</button>

      </form>
    </div>
  );
}