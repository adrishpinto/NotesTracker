import { useEffect, useState } from "react";
import axios from "axios";
import icon from "./assets/icon.svg";
import trash from "./assets/trash.svg";
import { Navigate, useNavigate } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URI;
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");

  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`, {
        headers: { Authorization: "Bearer asd1u2h2u89h9ansixnc" },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.log("error");
    }
  };

  const createNote = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/notes`,
        {
          content: noteContent,
        },
        {
          headers: {
            Authorization: "Bearer asd1u2h2u89h9ansixnc",
          },
        }
      );

      setNoteContent("");
    } catch (error) {
      console.log("Error creating note:", error);
    }
  };

  useEffect(() => {
    getUser();
    getNotes();
  }, [noteContent]);

  return (
    <div>
      <div className="mt-10">
        <div className="flex justify-around sm:justify-between sm:w-[90%] mx-auto">
          <div className="flex">
            <img src={icon} className="ml " alt="icon" />
            <h1 className="text-xl sm:text-3xl ml-5">Dashboard</h1>
          </div>
          <p
            className="underline text-blue-500 font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Sign out
          </p>
        </div>
      </div>

      {user && (
        <>
          <div className="w-[90%] mx-auto border-2 mt-10 shadow-xl p-5 rounded-2xl">
            <p className="text-2xl sm:text-4xl font-bold">
              Welcome, {user.name}!
            </p>
            <p className="sm:text-2xl mt-3 sm:mt-4 text-gray-500">
              email: {user.email}
            </p>
          </div>
        </>
      )}
      <div
        className="bg-[#367AFF] sm:w-[300px] sm:text-xl cursor-pointer sm:font-normal w-[90%] flex items-center justify-center text-white text-[16px] font-semibold h-[52px] mx-auto rounded-xl mt-10 hover:bg-opacity-85"
        onClick={createNote}
      >
        Create Note
      </div>

      <div className="sm:w-[400px] resize outline-none focus:outline-none w-[90%] mx-auto mt-4">
        <input
          type="text"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter note content"
          className="w-full p-3 border-2 rounded-lg outline-none focus:border-blue-500"
        />
      </div>
      <div className="w-[90%] sm:w-[90%] mx-auto">
        <div className="w-full  mx-auto sm:mx-0 text-[20px] mt-10">
          <h1>Notes</h1>
          <div className="flex sm:flex-row flex-col gap-10 w-full flex-wrap">
            {notes.map((note, i) => (
              <div
                key={note.id}
                className="w-full sm:w-[300px]  border-2 my-2 p-3 text-[16px] px-4 justify-between h-[px] shadow-md items-center rounded-xl hover:bg-slate-100"
              >
                <p>note {i + 1} </p>
                <div className="flex mt-2 justify-between">
                  <p>{note.content}</p>
                  <img
                    src={trash}
                    className="size-[24px] cursor-pointer"
                    alt="trash"
                    onClick={() => deleteNote(note._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
