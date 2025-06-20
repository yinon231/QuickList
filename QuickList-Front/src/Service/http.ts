const API_URL = "http://localhost:3000/api/";
import { useNavigate } from "react-router-dom";
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  return await response.json(); // מצפה שיחזור { access_token: "..." }
};
export const signup = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(`${API_URL}auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Signup failed");
  }
  return await response.json(); // מצפה שיחזור { access_token: "..." }
};

export const getLists = async (
  token: string,
  setAccessToken: (token: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  let currentToken = token;
  const makeRequest = async () => {
    return await fetch(`${API_URL}lists`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  };
  let res = await makeRequest();
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh(navigate);
    if (!newToken) {
      return;
    }
    setAccessToken(newToken);
    currentToken = newToken; // עדכון הטוקן הנוכחי לשימוש בהמשך
    res = await makeRequest(); // ניסיון נוסף עם הטוקן החדש
  }

  if (!res.ok) {
    const text = await res.json(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to fetch lists");
  }
  return res.json();
};
export const getListById = async (
  id: string,
  token: string,
  setAccessToken: (token: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  let currentToken = token;
  const makeRequest = async () => {
    return await fetch(`${API_URL}lists/${id}`, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  };
  let res = await makeRequest();
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh(navigate);
    if (!newToken) {
      throw new Error("Unauthorized, please login again");
    }
    setAccessToken(newToken);
    currentToken = newToken;
    res = await makeRequest();
  }
  if (!res.ok) {
    const text = await res.json(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to fetch lists");
  }
  return res.json();
};
export const updateList = async (
  id: string,
  list: {
    name: string;
    items: { name: string; quantity: number; checked: boolean }[];
  },
  accessToken: string,
  setAccessToken: (token: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  let currentToken = accessToken;
  const makeRequest = async () => {
    return await fetch(`${API_URL}lists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(list),
    });
  };
  let res = await makeRequest();
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh(navigate);
    if (!newToken) {
      throw new Error("Unauthorized, please login again");
    }
    setAccessToken(newToken);
    currentToken = newToken; // עדכון הטוקן הנוכחי לשימוש בהמשך
    res = await makeRequest(); // ניסיון נוסף עם הטוקן החדש
  }
  if (!res.ok) {
    const text = await res.json(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to update list");
  }
  return res.json();
};
export const createList = async (
  name: string,
  accessToken: string,
  setAccessToken: (token: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  let currentToken = accessToken;
  const makeRequest = async (currentToken: string) => {
    return await fetch(`${API_URL}lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ name, items: [] }),
    });
  };
  let res = await makeRequest(currentToken);
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh(navigate);
    if (!newToken) {
      throw new Error("Unauthorized, please login again");
    }
    setAccessToken(newToken);
    currentToken = newToken; // עדכון הטוקן הנוכחי לשימוש בהמשך
    res = await makeRequest(currentToken); // ניסיון נוסף עם הטוקן החדש
  }

  if (!res.ok) {
    const text = await res.json(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to create list");
  }
  return res.json();
};
export const deleteList = async (
  id: string,
  accessToken: string,
  setAccessToken: (token: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  let currentToken = accessToken;
  const makeRequest = async () => {
    return await fetch(`${API_URL}lists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  };
  let res = await makeRequest();
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh(navigate);
    if (!newToken) {
      throw new Error("Unauthorized, please login again");
    }
    setAccessToken(newToken);
    currentToken = newToken; // עדכון הטוקן הנוכחי לשימוש בהמשך
    res = await makeRequest(); // ניסיון נוסף עם הטוקן החדש
  }
  if (!res.ok) {
    const text = await res.json(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to delete list");
  }
  return res.json();
};
const getAccessTokenByRefresh = async (
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    const res = await fetch(`${API_URL}auth/refresh`, {
      credentials: "include", // שולח את העוגיה עם refresh_token
    });
    if (!res.ok) {
      navigate("/signin");
    }
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Error refreshing access token:", err);
  }
};
