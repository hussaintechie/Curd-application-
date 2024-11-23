import { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [user, setUser] = useState([]);
  const [filter, setFilter] = useState([]);
  const [isPop, setIsPop] = useState(false);
  const [userData, setUserData] = useState({
    name: "", age: "", city: ""
  });

  const getALLUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUser(res.data);
      setFilter(res.data); // Set the filter state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getALLUser();
  }, []);

  const searchFunction = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = user.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilter(filteredUsers);
  };

  const deleteFunction = async (id) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this user?");
      if (isConfirmed) {
        await axios.delete(`http://localhost:8000/users/${id}`);
        getALLUser(); // Fetch the updated list of users
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeFunction = () => {
    setIsPop(false);
  };

  const add = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsPop(true);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.id) {
        const res = await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        console.log(res);
      } else {
        const res = await axios.post("http://localhost:8000/users", userData);
        console.log(res);
      }
      getALLUser(); // Fetch the updated list of users
      setIsPop(false); // Close the modal
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const editFunction = (user) => {
    setUserData(user);
    setIsPop(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
        <div className="input-search">
          <input type="search" placeholder="Search Text Here" onChange={searchFunction} />
          <button className="blue" onClick={add}>Add Record</button>
        </div>
        <table className="tablsearch">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filter && filter.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className="green" onClick={() => editFunction(user)}>Edit</button></td>
                <td><button className="red" onClick={() => deleteFunction(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {isPop && (
          <div className="modal">
            <div className="modal-content">
              <div className="close" onClick={closeFunction}>&times;</div>
              <h2>{userData.id ? "Update Record":"Add Record"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" name="name" value={userData.name} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input type="number" name="age" value={userData.age} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" name="city" value={userData.city} onChange={handleChange} />
                </div>
                <button className="green" type="submit">Save User</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
