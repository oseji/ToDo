import { useEffect, useState } from "react";
import { auth, googleProvider } from "./config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

type getTodoType = () => Promise<void>;

type authScreenProps = {
  getTodo: getTodoType;
};

const AuthScreen = (props: authScreenProps) => {
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

  //refresh todos when logging in or out
  useEffect(() => {
    props.getTodo();
    console.log(isLoggedIn);
    console.log(auth.currentUser?.email);
  }, [isLoggedIn]);

  return (
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

        <button
          className=" bg-blue-500 rounded-xl px-4 py-2 text-white"
          onClick={(e) => {
            e.preventDefault();
            logOut();
          }}
        >
          Log out
        </button>
      </form>
    </div>
  );
};

export default AuthScreen;
