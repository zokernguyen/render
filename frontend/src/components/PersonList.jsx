import React from "react";

const Person = ({ person, handleDeletePerson }) => {
  return (
    <p>
      {person.name} {person.number}{" "}
      <button
        onClick={() => {
          handleDeletePerson(person.name, person.id);
        }}
      >
        delete
      </button>
    </p>
  );
};

const PersonList = ({ namesToShow, handleDeletePerson }) => {
  return (
    <div>
      {namesToShow.map((person) => (
        <div
          key={person.id}
        >
          <Person person={person} handleDeletePerson={handleDeletePerson} />
        </div>
      ))}
    </div>
  );
};

export default PersonList;