import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser as setAuthUser } from "../slices/authSlice.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const tryKeepLogin = async () => {
        return await axios.post(
          `${import.meta.env.VITE_API_URL}user/keeplogin`,
          {},
          { withCredentials: true }
        );
      };

      const tryRefresh = async () => {
        return await axios.post(
          `${import.meta.env.VITE_API_URL}user/refresh-token`,
          {},
          { withCredentials: true }
        );
      };

      try {
        const response = await tryKeepLogin();

        if (response.status === 200 && response.data?.user) {
          dispatch(setAuthUser(response.data.user));
          setUser(response.data.user);
          return;
        }

        setUser(null);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await tryRefresh();
            const retryResponse = await tryKeepLogin();
            if (retryResponse.status === 200 && retryResponse.data?.user) {
              dispatch(setAuthUser(retryResponse.data.user));
              setUser(retryResponse.data.user);
              return;
            }
          } catch (refreshError) {
            if (refreshError.response?.status === 401) {
              setSessionExpired(true);
            }
          }
        }

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return { user, setUser, loading, sessionExpired, setSessionExpired };
};
