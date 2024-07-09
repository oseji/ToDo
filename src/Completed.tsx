import { ChangeEvent } from "react";

type dbDataType = {
  id: string;
  text: string;
  completed: boolean;
}[];

type getTodoType = () => Promise<void>;
type deleteTodoType = (id: string) => Promise<void>;

type updateCompletedStatusType = (
  id: string,
  completedStatus: boolean
) => Promise<void>;

type completedPagePageProps = {
  dbData: dbDataType;
  getTodo: getTodoType;
  deleteTodo: deleteTodoType;

  updateCompletedStatus: updateCompletedStatusType;
};

const Completed = (props: completedPagePageProps) => {
  return (
    <section>
      <h1 className="sectionHeading">
        Completed (
        {props.dbData.filter((items) => items.completed === true).length})
      </h1>

      <div className="todoGrp">
        {props?.dbData
          ?.filter((items) => items.completed === true)
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
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Completed;
