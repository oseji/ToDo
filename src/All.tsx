import { ChangeEvent, useState } from "react";
import { auth, db } from "./config/firebase";
import { updateDoc, doc, collection } from "firebase/firestore";

type dbDataType = {
  id: string;
  text: string;
  completed: boolean;
}[];

type getTodoType = () => Promise<void>;
type deleteTodoType = (id: string) => Promise<void>;
type editTodoTextType = (id: string, newText: string) => Promise<void>;

type allPagePageProps = {
  dbData: dbDataType;
  getTodo: getTodoType;
  deleteTodo: deleteTodoType;
  editTodoText: editTodoTextType;
};

const All = (props: allPagePageProps) => {
  const [editedText, setEditedText] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleEditForm = (textId: string) => {
    setEditingId((prev) => (prev === textId ? null : textId));
    console.log(textId);
  };

  const updateCompletedStatus = async (
    id: string,
    completedStatus: boolean
  ) => {
    const user = auth.currentUser;

    try {
      if (user) {
        const todoDoc = doc(
          collection(db, `users/${user.email}/userTodos`),
          id
        );
        await updateDoc(todoDoc, { completed: completedStatus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      props.getTodo();
    }
  };

  return (
    <section>
      <h1 className="sectionHeading">All</h1>

      <div className="todoGrp">
        {props?.dbData?.map((e, i) => (
          <div className="todoBox" key={i}>
            <div className="topTodoGrp">
              <div className="textGrp">
                <input
                  type="checkbox"
                  className="checkBox"
                  checked={e.completed}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const boxStatus = event.target.checked;
                    console.log(boxStatus);

                    updateCompletedStatus(e.id, boxStatus);
                  }}
                />

                <div>
                  <p className="todoId">ID : {e.id}</p>
                  <p
                    className={`todoText ${e.completed ? " line-through" : ""}`}
                  >
                    {e.text}
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center  gap-5">
                <button onClick={() => props.deleteTodo(e.id)}>Delete</button>

                <button
                  onClick={() => {
                    toggleEditForm(e.id);
                  }}
                >
                  {editingId === e.id ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {/* editing form */}
            {editingId === e.id && (
              <form
                className="editTodoGrp"
                onSubmit={(event) => {
                  event.preventDefault();
                  props.editTodoText(e.id, editedText);
                  setEditedText("");
                  setEditingId(null);
                }}
              >
                <input
                  type="text"
                  className="editTodo"
                  value={editedText}
                  placeholder="Edit your todo"
                  onChange={(e) => setEditedText(e.target.value)}
                  required
                />
                <button>Submit</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default All;
