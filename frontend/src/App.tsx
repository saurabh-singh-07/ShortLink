import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Context/ProtectedRoute";
import AuthInitializer from "./components/AuthInitializer";
import Analysis from "./pages/Analysis";
import api from "../src/api/api";
import { useAuthHeaders } from "./utils/getAuthHeaders";
import { type MyLinksType } from "./types/myLinksTypes";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/Signup"));
const ShortUrl = lazy(() => import ("./pages/ShortUrl"))
const MyLinks = lazy (() => import ("./pages/MyLinks"))
const QRCodes = lazy (() => import ("./pages/QrCodes"))
const PageNotFound = lazy (() => import ("./pages/PageNotFound"))
const GoogleCallback = lazy (() => import( "./components/GoogleCallback"))

function App() {
  const { accessToken } = useAuth();
  const [links, setLinks] = useState<MyLinksType[]>([]);
  const {getAuthHeaders} = useAuthHeaders();
  const [loading, setLoading] = useState(false)
  const getLinks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/urls", {
          headers: getAuthHeaders(),
        });
  
        if (response.data.success) {
          setLinks(response.data.urls || []);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        toast.error("Unable to fetch your links.");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      if (accessToken) {
        getLinks();
        console.log(links);
        
      } else {
        setLinks([]);
        setLoading(false);
      }
    }, [accessToken]);
  return (
    <>
        <AuthInitializer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/oauth/callback" element={<GoogleCallback />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/shorturl" element={<ShortUrl />} />
                <Route path="/mylinks" element={<MyLinks links={links} loading={loading} setLinks={setLinks} />} />
                <Route path="/Qrcodes" element={<QRCodes />} />
                <Route path="/analysis" element={<Analysis urls={links}/>}/>
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
    </>
  );
}

export default App;
