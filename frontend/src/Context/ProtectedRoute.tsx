import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"

function ProtectedRoute() {
    const {accessToken , isLoading} = useAuth();
    const location = useLocation();

    if(isLoading) {
        return <div className="min-h-screen flex items-center justify-center">
            Checking Authentication...
        </div>
    }

    if(!accessToken){
        return (
            <Navigate to={'/login'} replace state={{from : location}}/>
        )
    }
  return <Outlet/>
}

export default ProtectedRoute
