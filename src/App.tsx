import { useState, useRef, useEffect } from "react";

import { db, auth, googleProvider } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import MainPage from "./MainPage";

export type todoType = {
  id: string;
  text: string;
  completed: boolean;
}[];

function App() {
  const [themeToggled, setThemeToggled] = useState<boolean>(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [dbData, setDbData] = useState<todoType>([]);

  const toggleTheme = () => {
    //check if dark mode is applied
    const isDarkModeApplied = appRef.current?.classList.contains("dark");

    //determine current theme
    const newTheme = isDarkModeApplied ? "light" : "dark";

    //apply new theme manually and trigger dot animation
    if (newTheme === "dark") {
      appRef.current?.classList.add("dark");
      dotRef.current?.classList.add("dotAnimation");
    } else {
      appRef.current?.classList.remove("dark");
      dotRef.current?.classList.remove("dotAnimation");
    }

    setThemeToggled(!themeToggled);
  };

  const getTodo = async () => {
    const user = auth.currentUser;

    try {
      if (user) {
        const q = collection(db, `users/${user.email}/userTodos`);

        const data = (await getDocs(q)).docs;
        const filteredData = data.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as todoType;

        setDbData(filteredData);

        console.log(filteredData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    }
  };

  //check for user preference on page load and set theme accordingly
  useEffect(() => {
    const isDarkModePreferred = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const currentTheme = isDarkModePreferred ? "dark" : "light";

    if (currentTheme === "dark") {
      appRef.current?.classList.add("dark");
      dotRef.current?.classList.add("dotAnimation");
    } else {
      appRef.current?.classList.remove("dark");
      dotRef.current?.classList.remove("dotAnimation");
    }
  }, [window.matchMedia("(prefers-color-scheme: dark)").matches]);

  //refresh todos when logging in or out
  useEffect(() => {
    getTodo();
    console.log(isLoggedIn);
    console.log(auth.currentUser?.email);
  }, [isLoggedIn]);

  return (
    <div className="App" ref={appRef}>
      {/* SIGN IN PAGE */}
      {!isLoggedIn && (
        <div className="signInPage">
          <h1 className="signInHeading">ToDo</h1>

          <form className="flex flex-col gap-5 items-center">
            <input
              className="w-full md:w-2/3 xl:w-1/2"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full md:w-2/3 xl:w-1/2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />

            <div className="flex flex-row gap-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signInWithGoogle();
                }}
              >
                Sign in with Google
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Log in
              </button>
            </div>

            <p
              className=" text-blue-500 underline cursor-pointer hover:scale-110 transition ease-in-out duration-200"
              onClick={(e) => {
                e.preventDefault();
                createAccount();
              }}
            >
              Click to create account and login
            </p>
          </form>
        </div>
      )}

      {/* MAIN SCREEN PAGE */}
      {isLoggedIn && (
        <MainPage
          dotRef={dotRef}
          themeToggled={themeToggled}
          toggleTheme={toggleTheme}
          getTodo={getTodo}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          dbData={dbData}
        ></MainPage>
      )}
    </div>
  );
}

export default App;
