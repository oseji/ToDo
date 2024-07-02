import { useState, useRef, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";

import { db, auth, googleProvider } from "./config/firebase";
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { signOut } from "firebase/auth";

import All from "./All";
import Active from "./Active";
import Completed from "./Completed";

type todoType = {
  id: string;
  text: string;
  completed: boolean;
}[];

function App() {
  const [themeToggled, setThemeToggled] = useState<boolean>(false);
  const appRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [inputText, setInputText] = useState<string>("");

  const [dbData, setDbData] = useState<todoType>([]);

  const [profile, setProfile] = useState<any>("");

  const toggleTheme = () => {
    setThemeToggled(!themeToggled);

    appRef.current?.classList.toggle("dark");
    dotRef.current?.classList.toggle("dotAnimation");
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

  const addTodo = async () => {
    const user = auth.currentUser;
    try {
      if (user) {
        await addDoc(collection(db, `users/${user.email}/userTodos`), {
          text: inputText,
          completed: false,
          userID: auth?.currentUser?.uid,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      getTodo();
    }
  };

  const deleteTodo = async (id: string) => {
    const user = auth.currentUser;

    try {
      if (user) {
        const todoDoc = doc(
          collection(db, `users/${user.email}/userTodos`),
          id
        );
        await deleteDoc(todoDoc);
      }
    } catch (err) {
      console.error(err);
    } finally {
      getTodo();
    }
  };

  const editTodoText = async (id: string, newText: string) => {
    const user = auth.currentUser;
    try {
      if (user) {
        const todoDoc = doc(
          collection(db, `users/${user.email}/userTodos`),
          id
        );
        await updateDoc(todoDoc, { text: newText });
      }
    } catch (err) {
      console.error(err);
    } finally {
      getTodo();
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

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

  //refresh todos when logging in or out
  useEffect(() => {
    getTodo();
    console.log(isLoggedIn);
    console.log(auth.currentUser?.email);
  }, [isLoggedIn]);

  //get new todo list when current user changes
  useEffect(() => {
    getTodo();
  }, [auth?.currentUser]);

  //set profile email
  useEffect(() => {
    if (auth.currentUser) {
      setProfile(auth?.currentUser?.email);
    }

    console.log(profile);
  }, [auth?.currentUser]);

  return (
    <div className="App" ref={appRef}>
      <div className="signInPage">
        <form className="flex flex-col gap-5 items-center mt-10">
          <input
            className="w-full md:w-2/3 xl:w-1/2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full md:w-2/3 xl:w-1/2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="flex flex-row gap-5">
            <button
              className=" bg-blue-500 rounded-xl px-4 py-2 text-white"
              onClick={(e) => {
                e.preventDefault();
                createAccount();
              }}
            >
              Create account
            </button>

            <button
              className=" bg-blue-500 rounded-xl px-4 py-2 text-white"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign in
            </button>
          </div>

          <button
            className=" bg-blue-500 rounded-xl px-4 py-2 text-white"
            onClick={(e) => {
              e.preventDefault();
              signInWithGoogle();
            }}
          >
            Sign in with Google
          </button>
        </form>
      </div>

      <header>
        <div className="themeGrp">
          <p className={`${!themeToggled ? "font-bold" : ""}`}>Light</p>

          <div className="themeSwitcher" onClick={toggleTheme}>
            <div className="dot" ref={dotRef}></div>
          </div>

          <p className={`${themeToggled ? "font-bold" : ""}`}>Dark</p>
        </div>

        <div className=" flex flex-row items-center gap-5">
          <p className="text-black dark:text-white">
            Logged in : <span className=" font-bold">{profile}</span>
          </p>

          <button
            className=" bg-blue-500 rounded-xl px-4 py-2 text-white"
            onClick={(e) => {
              e.preventDefault();
              logOut();
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <main>
        <div className="todoNav">
          <form
            className="flex flex-col md:flex-row md:justify-center gap-5 md:gap-10 items-center mt-10"
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
              setInputText("");
            }}
          >
            <input
              className="w-full md:w-2/3 xl:w-1/2"
              placeholder="Enter todo"
              type="text"
              name="message"
              id="message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button>Submit</button>
          </form>

          <nav>
            <Link to={"/"}>
              <p className="navPage">All</p>
            </Link>

            <Link to={"/Active"}>
              <p className="navPage">Active</p>
            </Link>

            <Link to={"/Completed"}>
              <p className="navPage">Completed</p>
            </Link>
          </nav>
        </div>

        <Switch>
          <Route exact path={"/"}>
            <All
              dbData={dbData}
              deleteTodo={deleteTodo}
              editTodoText={editTodoText}
            />
          </Route>

          <Route exact path={"/Active"} component={Active} />

          <Route exact path={"/Completed"} component={Completed} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
