import { createContext, useCallback, useEffect, useState }  from "react";
import { postRequest, baseUrl } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children })=>{
    const [ user, setUser ] =useState(null);
    const [ regError, setRegError] = useState(null);
    const [ isRegLoading, setIsRegLoading] = useState(false);
    const [regInfo, setRegInfo ] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo ] = useState({
        email: "",
        password: "",
    });

    useEffect(()=>{
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }
    ,[])

    const updateRegInfo = useCallback((info)=>{
        setRegInfo(info);
    },[]);

    const regUser = useCallback(async(event)=>{
        event.preventDefault();

        setIsRegLoading(true);
        setRegError(null);

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(regInfo))
        setIsRegLoading(false);

        if(response.error){
            return setRegError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    },[regInfo]);

    const updateLoginInfo = useCallback((info) => {
      setLoginInfo(info);
    }, []);

    const loginUser = useCallback(async (event)=>{
        event.preventDefault();

        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))
        setIsLoginLoading(false);

        if(response.error){
            return setLoginError(response); //return so that it doesn't proceed further
        }

        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
    }
    ,[loginInfo]);
    const logOutUser = useCallback(()=>{
        localStorage.removeItem("User");
        setUser(null);
        setLoginInfo({
          email: "",
          password: "",
        });
        setRegInfo({
          name: "",
          email: "",
          password: "",
        });
    }
    ,[]);

    return (
        <AuthContext.Provider
            value={{
                user,
                regInfo,
                updateRegInfo,
                regUser,
                regError,
                isRegLoading,
                logOutUser,
                loginUser,
                loginInfo,
                updateLoginInfo,
                loginError,
                isLoginLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}