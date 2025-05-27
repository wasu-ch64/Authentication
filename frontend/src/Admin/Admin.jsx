import React from 'react'
import { useAuthStore } from '../store/authStore'

const Adminpage = () => {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    }
  return (
    <div>
        Adminpage
        <button 
            onClick={handleLogout}
            className='bg-red-500 px-2 py-4 hover:bg-red-600'
        >
                ออกจการะบบ
        </button>
    </div>
  )
}

export default Adminpage