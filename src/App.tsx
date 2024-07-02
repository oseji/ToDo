import { useState, useRef, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";

import { db, auth } from "./config/firebase";
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";

import AuthScreen from "./Auth";
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

  // const todoCollection = query(
  //   collection(db, "users"),
  //   where("userID", "==", auth?.currentUser?.uid)
  // );
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

  //get todo list immediately upon page load
  useEffect(() => {
    getTodo();
  }, []);

  //get new todo list when current user changes
  useEffect(() => {
    getTodo();
  }, [auth?.currentUser]);

  //set profile email
  useEffect(() => {
    setProfile(auth?.currentUser?.email);
    console.log(profile);
  }, [auth?.currentUser]);

  return (
    <div className="App" ref={appRef}>
      <header>
        <div className="themeGrp">
          <p className={`${!themeToggled ? "font-bold" : ""}`}>Light</p>

          <div className="themeSwitcher" onClick={toggleTheme}>
            <div className="dot" ref={dotRef}></div>
          </div>

          <p className={`${themeToggled ? "font-bold" : ""}`}>Dark</p>
        </div>

        <p>{profile}</p>

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
      </header>

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
          type="text"
          name="message"
          id="message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="formBtn">Submit</button>
      </form>

      <AuthScreen getTodo={getTodo} />

      <main>
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
