const API_URL = "http://localhost:3000/api/";

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
  setAccessToken: (token: string) => void
) => {
  let currentToken = token;
  let res = await fetch(`${API_URL}lists`, {
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
  if (res.status === 401) {
    const newToken = await getAccessTokenByRefresh();
    if (!newToken) {
      throw new Error("Unauthorized, please login again");
    }
    setAccessToken(newToken);
    currentToken = newToken; // עדכון הטוקן הנוכחי לשימוש בהמשך
  }
  res = await fetch(`${API_URL}lists`, {
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text(); // לקרוא מה כן חזר
    console.error("Response body:", text);
    throw new Error("Failed to fetch lists");
  }
  return res.json();
};
const getAccessTokenByRefresh = async () => {
  try {
    const res = await fetch(`${API_URL}auth/refresh`, {
      credentials: "include", // שולח את העוגיה עם refresh_token
    });
    if (!res.ok) throw new Error("Refresh token invalid");
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    return null;
  }
};

// export const createList = async (name: string, token: string) => {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ name, items: [] }),
//   });
//   if (!res.ok) throw new Error("Failed to create list");
//   return res.json();
// };
