import { ChangeEvent } from "react";

type dbDataType = {
  id: string;
  text: string;
  completed: boolean;
}[];

type getTodoType = () => Promise<void>;
type deleteTodoType = (id: string) => Promise<void>;
type editTodoTextType = (id: string, newText: string) => Promise<void>;
type editedTextType = string;
type setEditedTextType = (value: string) => void;
type editingIdType = string | null;
type setEditingIdType = (value: string | null) => void;
type toggleEditFormType = (textId: string) => void;
type updateCompletedStatusType = (
  id: string,
  completedStatus: boolean
) => Promise<void>;

type activePagePageProps = {
  dbData: dbDataType;
  getTodo: getTodoType;
  deleteTodo: deleteTodoType;
  editTodoText: editTodoTextType;
  editedText: editedTextType;
  setEditedText: setEditedTextType;
  editingId: editingIdType;
  setEditingId: setEditingIdType;
  toggleEditForm: toggleEditFormType;
  updateCompletedStatus: updateCompletedStatusType;
};

const Active = (props: activePagePageProps) => {
  return (
    <section>
      <h1 className="sectionHeading">
        Active (
        {props.dbData.filter((items) => items.completed === false).length})
      </h1>

      <div className="todoGrp">
        {props?.dbData
          ?.filter((items) => items.completed === false)
          .map((e, i) => (
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

                      props.updateCompletedStatus(e.id, boxStatus);
                    }}
                  />

                  <div>
                    <p className="todoId">ID : {e.id}</p>
                    <p
                      className={`todoText ${
                        e.completed ? " line-through" : ""
                      }`}
                    >
                      {e.text}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row items-center  gap-5">
                  <button onClick={() => props.deleteTodo(e.id)}>Delete</button>

                  <button
                    onClick={() => {
                      props.toggleEditForm(e.id);
                    }}
                  >
                    {props.editingId === e.id ? "Close" : "Edit"}
                  </button>
                </div>
              </div>

              {/* editing form */}
              {props.editingId === e.id && (
                <form
                  className="editTodoGrp"
                  onSubmit={(event) => {
                    event.preventDefault();
                    props.editTodoText(e.id, props.editedText);
                    props.setEditedText("");
                    props.setEditingId(null);
                  }}
                >
                  <input
                    type="text"
                    className="editTodo"
                    value={props.editedText}
                    placeholder="Edit your todo"
                    onChange={(e) => props.setEditedText(e.target.value)}
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

export default Active;
