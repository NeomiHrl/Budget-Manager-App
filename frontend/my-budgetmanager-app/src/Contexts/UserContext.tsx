import { useEffect,useState,createContext,useContext } from "react";
import { loginUser,registerUser,checkToken } from "../Api/ApiUser";

const UserContext = createContext<any>(null);

export const useUser=()=>{
    const context=useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider=({children}:any)=>{
    const [user,setUser]=useState<any>(null);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string | null>(null);
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(false);
    const [token, setToken]=useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const initializeUser = async () => {
            console.log('🔍 Context: Starting initialization...');
            const savedToken = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            console.log('🔍 Context: Retrieved token and user from localStorage:', { token: !!savedToken, userData: !!userData });
            
            if (savedToken && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('✅ Context: Parsed user data:', parsedUser); // ← DEBUG
                    
                    // בדיקה שהטוקן עדיין תקף
                    const isValid = await checkToken();
                    
                    if (isValid) {
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                        setToken(savedToken);
                        console.log('✅ Context: User restored successfully'); // ← DEBUG
                    } else {
                        console.log('❌ Context: Token invalid, clearing storage'); // ← DEBUG
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                    }
                } catch (error) {
                    console.error("❌ Context: Error parsing user data:", error); // ← DEBUG
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    setToken(null);
                }
            } else {
                console.log('❌ Context: No saved auth data found'); // ← DEBUG
            }
            
            setLoading(false);
            console.log('🔍 Context: Initialization complete'); // ← DEBUG
        };
        initializeUser();
    }, []);

    const login=async(credentials:any)=>{
        setLoading(true);
        setError(null);
        try{
            const response= await loginUser(credentials);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                throw new Error(response.error);
            }
            console.log('🔍 Context: Login successful, response:', response);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));

            setUser(response);
            setIsAuthenticated(true);
            setToken(response.token);
            setLoading(false);

            console.log('✅ login: User data saved to localStorage');

            return {success: true, user: response};
        }catch(err:any){
            console.error('❌ Context: Login failed:', err);
            setError(err.message || 'Login failed');
            setLoading(false);
            return {success: false, error: err.message || 'Login failed'};
        }
    };

    const register=async(userData:any)=>{
        setLoading(true);
        setError(null);
        try{
            const response= await registerUser(userData);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                throw new Error(response.error);
            }
            console.log('🔍 Context: Registration successful, response:', response);
            setLoading(false);
            return {success: true, user: response};
        }
        catch(err:any){
            console.error('❌ Context: Registration failed:', err);
            setError(err.message || 'Registration failed');
            setLoading(false);
            return {success: false, error: err.message || 'Registration failed'};
        }
    };

    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
    };

    const updateUser = (updates: Partial<typeof user>) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const clearError=()=>{
        setError(null);
    };

    const value={
        user,
        loading,
        error,
        isAuthenticated,
        updateUser,
        token,
        login,
        register,
        logout,
        isAdmin: user?.role_id===1,
        isUser: user?.role_id===2,
        userFullName: user ? `${user.first_name} ${user.last_name}`.trim() : '',
        userInitials: user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase() : '',
        clearError,
    };

    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}   

export default UserContext;
// עדכון גם בפרופיל:
// אחרי כל setUser(updated) בפרופיל, להוסיף:
// localStorage.setItem("user", JSON.stringify(updated));