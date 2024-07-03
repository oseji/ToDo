import { Route, Switch, Link } from "react-router-dom";
import { useState, useRef, useEffect, SyntheticEvent, RefObject } from "react";
import { signOut } from "firebase/auth";
import { db, auth } from "./config/firebase";
import {
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";
import { todoType } from "./App";
import All from "./All";
import Active from "./Active";
import Completed from "./Completed";

type dotRefType = RefObject<HTMLDivElement>;

type emailType = string;
type setEmailType = (value: string) => void;
type passwordType = string;
type setPasswordType = (value: string) => void;
type isLoggedInType = boolean;
type setIsLoggedInType = (value: boolean) => void;

// type dotRefType=
type themeToggledType = boolean;
type toggleThemeType = () => void;

type getTodoType = () => Promise<void>;

type mainPageProps = {
  email: emailType;
  setEmail: setEmailType;
  password: passwordType;
  setPassword: setPasswordType;
  isLoggedIn: isLoggedInType;
  setIsLoggedIn: setIsLoggedInType;

  dotRef: dotRefType;
  themeToggled: themeToggledType;
  toggleTheme: toggleThemeType;

  getTodo: getTodoType;
  dbData: todoType;
};

const MainPage = (props: mainPageProps) => {
  const navHeaderRefs = [
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
    useRef<HTMLParagraphElement>(null),
  ];

  const [inputText, setInputText] = useState<string>("");

  const [profile, setProfile] = useState<any>("");

  const toggleActiveNavClass = (e: SyntheticEvent) => {
    const clicked = Number(e.currentTarget.getAttribute("data-value"));

    navHeaderRefs.forEach((element, index) => {
      const header = element.current;

      if (index === clicked) {
        header?.classList.add("activeNav");
      } else {
        header?.classList.remove("activeNav");
      }
    });
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
      props.getTodo();
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
      props.getTodo();
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
      props.getTodo();
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      props.setIsLoggedIn(false);

      props.setEmail("");
      props.setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  //get new todo list and set profile when current user changes
  useEffect(() => {
    props.getTodo();

    if (auth.currentUser) {
      setProfile(auth?.currentUser?.email);
    }

    console.log(profile);
  }, [auth?.currentUser]);

  return (
    <div>
      <header>
        <div className="themeGrp">
          <p className={`${!props.themeToggled ? "font-bold" : ""}`}>Light</p>

          <div className="themeSwitcher" onClick={props.toggleTheme}>
            <div className="dot" ref={props.dotRef}></div>
          </div>

          <p className={`${props.themeToggled ? "font-bold" : ""}`}>Dark</p>
        </div>

        <div className=" flex flex-col md:flex-row items-center gap-2 md:gap-5">
          <p className="text-black dark:text-white">
            Logged in as : <span className=" font-bold">{profile}</span>
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
            required
          />
          <button>Submit</button>
        </form>

        <nav>
          <Link to={"/"}>
            <p
              className="navPage activeNav"
              ref={navHeaderRefs[0]}
              data-value={0}
              onClick={toggleActiveNavClass}
            >
              All
            </p>
          </Link>

          <Link to={"/Active"}>
            <p
              className="navPage"
              ref={navHeaderRefs[1]}
              data-value={1}
              onClick={toggleActiveNavClass}
            >
              Active
            </p>
          </Link>

          <Link to={"/Completed"}>
            <p
              className="navPage"
              ref={navHeaderRefs[2]}
              data-value={2}
              onClick={toggleActiveNavClass}
            >
              Completed
            </p>
          </Link>
        </nav>
      </div>

      <main>
        <Switch>
          <Route exact path={"/"}>
            <All
              dbData={props.dbData}
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
};

export default MainPage;
