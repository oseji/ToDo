import { useState } from "react";

type dbDataType = {
  id: string;
  text: string;
  completed: boolean;
}[];

type deleteTodoType = (id: string) => Promise<void>;
type editTodoTextType = (id: string, newText: string) => Promise<void>;

type allPagePageProps = {
  dbData: dbDataType;
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

  return (
    <section>
      <h1 className="sectionHeading">All</h1>

      <div className="todoGrp">
        {props?.dbData?.map((e, i) => (
          <div className="todoBox" key={i}>
            <div className="topTodoGrp">
              <div>
                <p className="todoId">ID : {e.id}</p>
                <p className="todoText">{e.text}</p>
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
