import { useState, useEffect } from "react";
import personServices from "./services/persons.js";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";

const App = () => {
  const [allPerson, setAllPerson] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [msg, setMsg] = useState({});

  useEffect(() => {
    personServices.getAll().then((list) => {
      setAllPerson(list);
    });
  }, []);

  const handleFilterInput = (e) => {
    console.log(e.target.value);
    setFilter(e.target.value);
  };

  const handleNameInput = (e) => {
    console.log(e.target.value);
    setNewName(e.target.value);
  };

  const handleNumberInput = (e) => {
    console.log(e.target.value);
    setNewNumber(e.target.value);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();

    const nameFlag = isDuplicate(newName, "name");
    const numberFlag = isDuplicate(newNumber, "number");

    let newPerson = {
      name: newName,
      number: newNumber,
    };

    if (nameFlag && !numberFlag) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        newPerson = {
          ...newPerson,
          id: allPerson.filter((p) => p.name === newName)[0].id,
        };
        personServices.update(newPerson.id, newPerson).then(() => {
          setAllPerson(
            allPerson.map((p) => (p.id !== newPerson.id ? p : newPerson))
          );
          setMsg({
            type: "success",
            content: "Updated contact number"});
          setTimeout(() => {
            setMsg(null);
          }, 5000);
        });
      }
      return;
    } else if (!nameFlag && numberFlag) {
      if (
        window.confirm(
          `The number ${newNumber} is already belonged to an existing contact person, rename the old person with this new name?`
        )
      ) {
        newPerson = {
          ...newPerson,
          id: allPerson.filter((p) => p.number === newNumber)[0].id,
        };
        personServices.update(newPerson.id, newPerson).then(() => {
          setAllPerson(
            allPerson.map((p) => (p.id !== newPerson.id ? p : newPerson))
          );
          setMsg({
            type: "success",
            content: "Updated contact number"});
          setTimeout(() => {
            setMsg(null);
          }, 5000);
        });
      }
      return;
    } else if (nameFlag && numberFlag) {
      window.alert(`${newName} is added to phonebook`);
      return;
    } else {
      personServices.addNew(newPerson).then((res) => {
        setAllPerson(allPerson.concat(res));
        setNewName("");
        setNewNumber("");
        setMsg({
          type: "success",
          content: `Added ${newName}`});
        setTimeout(() => {
          setMsg(null);
        }, 5000);
      });
      return;
    }
  };

  const handleDeletePerson = (name, id) => {
    console.log(name, id);
    if (window.confirm(`Delete ${name} ?`)) {
      personServices.remove(id)
        .then(() => {
        setMsg({
          type: "success",
          content: `Deleted ${name}`});
        setTimeout(() => {
          setMsg(null);
        }, 5000);
        setAllPerson(allPerson.filter((p) => p.id !== id));
        })
        .catch(error => {
          setMsg({
            type: "error",
            content: `${name} has already been remove from server`
          });
          setTimeout(() => {
            setMsg(null);
          }, 5000);
          setAllPerson(allPerson.filter(p => p.id !== id));
        });
    }
  };

  const filterName = (name) => {
    let result = allPerson.filter(
      (p) => p.name.toLowerCase().indexOf(name.toLowerCase()) >= 0
    );
    return result;
  };

  const namesToShow = filterName(filter);

  const isDuplicate = (value, key) => {
    return allPerson.some((person) => person[key] === value);
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={msg} />
      <Filter filter={filter} handleFilterInput={handleFilterInput} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
        handleAddPerson={handleAddPerson}
      />
      <h2>Numbers</h2>
      <PersonList
        allPerson={allPerson}
        namesToShow={namesToShow}
        handleDeletePerson={handleDeletePerson}
      />
      {namesToShow.length === 0 && <p>No contacts found.</p>}
    </>
  );
};

export default App;